/* @ts-nocheck */
import { PrismaClient, AppointmentStatus, ServiceType } from '@prisma/client';
import { addDays, addMinutes, format, isAfter, isBefore, isWithinInterval, parseISO, setHours, setMinutes } from 'date-fns';

interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
  agentId?: string;
  agentName?: string;
  available: boolean;
  capacity?: number;
}

interface WorkingHours {
  [day: string]: {
    start: string;
    end: string;
    breaks?: Array<{ start: string; end: string }>;
  };
}

interface SchedulingRule {
  serviceType: ServiceType;
  duration: number; // minutes
  bufferTime: number; // minutes entre rendez-vous
  maxConcurrent: number;
  requiresSpecificAgent?: boolean;
  autoAssign: boolean;
}

interface AvailabilityQuery {
  serviceType: ServiceType;
  organizationId: string;
  date: Date;
  agentId?: string;
  duration?: number;
}

export class AppointmentSchedulerService {
  private prisma: PrismaClient;
  
  // Règles par défaut pour chaque type de service
  private defaultRules: Record<string, Partial<SchedulingRule>> = {
    CNI: { duration: 30, bufferTime: 5, maxConcurrent: 3 },
    PASSEPORT: { duration: 45, bufferTime: 10, maxConcurrent: 2 },
    ACTE_NAISSANCE: { duration: 20, bufferTime: 5, maxConcurrent: 4 },
    PERMIS_CONDUIRE: { duration: 60, bufferTime: 15, maxConcurrent: 2 },
    // ... autres services
  };

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Trouver les créneaux disponibles pour un service
   */
  async findAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    // 1. Obtenir la configuration du service
    const serviceConfig = await this.getServiceConfig(
      query.organizationId,
      query.serviceType
    );

    if (!serviceConfig || !serviceConfig.isActive) {
      throw new Error('Service non disponible');
    }

    // 2. Obtenir les heures de travail de l'organisation
    const organization = await this.prisma.organization.findUnique({
      where: { id: query.organizationId },
    });

    if (!organization || !organization.workingHours) {
      throw new Error('Horaires non configurés');
    }

    const workingHours = organization.workingHours as WorkingHours;
    const dayOfWeek = format(query.date, 'EEEE').toLowerCase();
    const dayHours = workingHours[dayOfWeek];

    if (!dayHours) {
      return []; // Fermé ce jour
    }

    // 3. Vérifier si c'est un jour férié
    if (await this.isHoliday(query.organizationId, query.date)) {
      return [];
    }

    // 4. Obtenir les agents disponibles
    const availableAgents = await this.getAvailableAgents(
      query.organizationId,
      query.serviceType,
      query.date,
      query.agentId
    );

    if (availableAgents.length === 0) {
      return [];
    }

    // 5. Obtenir les règles de planification
    const rules = this.getSchedulingRules(query.serviceType, serviceConfig);

    // 6. Générer les créneaux possibles
    const slots = this.generateTimeSlots(
      dayHours,
      rules.duration + rules.bufferTime,
      query.date
    );

    // 7. Filtrer par disponibilité
    const availableSlots: TimeSlot[] = [];

    for (const slot of slots) {
      const availability = await this.checkSlotAvailability(
        slot,
        query.date,
        availableAgents,
        rules
      );

      if (availability.available) {
        availableSlots.push({
          ...slot,
          agentId: availability.agentId,
          agentName: availability.agentName,
          capacity: availability.remainingCapacity,
        });
      }
    }

    return availableSlots;
  }

  /**
   * Réserver un créneau
   */
  async bookSlot(
    userId: string,
    serviceType: ServiceType,
    organizationId: string,
    date: Date,
    timeSlot: string,
    agentId?: string,
    notes?: string
  ): Promise<string> {
    // Vérifier la disponibilité une dernière fois
    const slots = await this.findAvailableSlots({
      serviceType,
      organizationId,
      date,
      agentId,
    });

    const selectedSlot = slots.find(s => s.start === timeSlot);
    if (!selectedSlot || !selectedSlot.available) {
      throw new Error('Créneau non disponible');
    }

    // Créer le rendez-vous
    const appointment = await this.prisma.appointment.create({
      data: {
        appointmentNumber: this.generateAppointmentNumber(),
        serviceType,
        organizationId,
        citizenId: userId,
        agentId: selectedSlot.agentId!,
        date,
        timeSlot: `${selectedSlot.start}-${selectedSlot.end}`,
        status: 'SCHEDULED',
        notes,
      },
    });

    // Envoyer la confirmation
    // TODO: Déclencher notification

    return appointment.id;
  }

  /**
   * Optimiser la planification (répartir équitablement)
   */
  async optimizeSchedule(
    organizationId: string,
    date: Date
  ): Promise<void> {
    // Obtenir tous les rendez-vous non assignés
    const unassignedAppointments = await this.prisma.appointment.findMany({
      where: {
        organizationId,
        date: {
          gte: setHours(setMinutes(date, 0), 0),
          lt: addDays(setHours(setMinutes(date, 0), 0), 1),
        },
        agentId: null,
      },
    });

    if (unassignedAppointments.length === 0) return;

    // Obtenir les agents disponibles
    const agents = await this.prisma.user.findMany({
      where: {
        primaryOrganizationId: organizationId,
        role: { in: ['AGENT', 'MANAGER'] },
        isActive: true,
      } as any,
    });

    // Compter les rendez-vous par agent
    const agentLoad = new Map<string, number>();
    
    for (const agent of agents) {
      const count = await this.prisma.appointment.count({
        where: {
          agentId: agent.id,
          date: {
            gte: setHours(setMinutes(date, 0), 0),
            lt: addDays(setHours(setMinutes(date, 0), 0), 1),
          },
        },
      });
      agentLoad.set(agent.id, count);
    }

    // Assigner équitablement
    for (const appointment of unassignedAppointments) {
      // Trouver l'agent avec le moins de charge
      let minLoad = Infinity;
      let selectedAgentId = '';

      agentLoad.forEach((load, agentId) => {
        if (load < minLoad) {
          minLoad = load;
          selectedAgentId = agentId;
        }
      });

      if (selectedAgentId) {
        await this.prisma.appointment.update({
          where: { id: appointment.id },
          data: { agentId: selectedAgentId },
        });

        agentLoad.set(selectedAgentId, minLoad + 1);
      }
    }
  }

  /**
   * Obtenir les statistiques de planification
   */
  async getSchedulingStats(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        organizationId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Calculer les métriques
    const stats = {
      total: appointments.length,
      byStatus: {} as Record<string, number>,
      byService: {} as Record<string, number>,
      byAgent: {} as Record<string, any>,
      utilizationRate: 0,
      noShowRate: 0,
      averageWaitTime: 0,
    };

    // Grouper par statut
    appointments.forEach(apt => {
      stats.byStatus[apt.status] = (stats.byStatus[apt.status] || 0) + 1;
      stats.byService[apt.serviceType] = (stats.byService[apt.serviceType] || 0) + 1;
      
      const agentName = apt.agent ? 
        `${apt.agent.firstName} ${apt.agent.lastName}` : 
        'Non assigné';
        
      if (!stats.byAgent[agentName]) {
        stats.byAgent[agentName] = {
          total: 0,
          completed: 0,
          noShow: 0,
        };
      }
      
      stats.byAgent[agentName].total++;
      if (apt.status === 'COMPLETED') {
        stats.byAgent[agentName].completed++;
      } else if (apt.status === 'NO_SHOW') {
        stats.byAgent[agentName].noShow++;
      }
    });

    // Calculer les taux
    const completed = stats.byStatus['COMPLETED'] || 0;
    const noShow = stats.byStatus['NO_SHOW'] || 0;
    
    stats.noShowRate = stats.total > 0 ? (noShow / stats.total) * 100 : 0;
    
    // TODO: Calculer le taux d'utilisation basé sur la capacité

    return stats;
  }

  // Méthodes privées

  private async getServiceConfig(
    organizationId: string,
    serviceType: ServiceType
  ) {
    return await this.prisma.serviceConfig.findUnique({
      where: {
        organizationId_serviceType: {
          organizationId,
          serviceType,
        },
      },
    });
  }

  private async getAvailableAgents(
    organizationId: string,
    serviceType: ServiceType,
    date: Date,
    specificAgentId?: string
  ) {
    const where: any = {
      organizationId,
      role: { in: ['AGENT', 'MANAGER'] },
      isActive: true,
    };

    if (specificAgentId) {
      where.id = specificAgentId;
    }

    const agents = await this.prisma.user.findMany({ where });

    // TODO: Filtrer par compétences/services autorisés
    // TODO: Vérifier les congés/absences

    return agents;
  }

  private getSchedulingRules(
    serviceType: ServiceType,
    serviceConfig: any
  ): SchedulingRule {
    const defaults = this.defaultRules[serviceType] || {
      duration: 30,
      bufferTime: 5,
      maxConcurrent: 1,
    };

    return {
      serviceType,
      duration: serviceConfig.duration || defaults.duration || 30,
      bufferTime: serviceConfig.bufferTime || defaults.bufferTime || 5,
      maxConcurrent: serviceConfig.maxConcurrent || defaults.maxConcurrent || 1,
      requiresSpecificAgent: serviceConfig.requiresSpecificAgent || false,
      autoAssign: serviceConfig.autoAssign || false,
    };
  }

  private generateTimeSlots(
    workingHours: any,
    slotDuration: number,
    date: Date
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startTime = parseISO(`${format(date, 'yyyy-MM-dd')}T${workingHours.start}:00`);
    const endTime = parseISO(`${format(date, 'yyyy-MM-dd')}T${workingHours.end}:00`);

    let currentTime = startTime;

    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, slotDuration);
      
      if (isAfter(slotEnd, endTime)) break;

      // Vérifier si le créneau n'est pas dans une pause
      let isInBreak = false;
      if (workingHours.breaks) {
        for (const breakPeriod of workingHours.breaks) {
          const breakStart = parseISO(`${format(date, 'yyyy-MM-dd')}T${breakPeriod.start}:00`);
          const breakEnd = parseISO(`${format(date, 'yyyy-MM-dd')}T${breakPeriod.end}:00`);
          
          if (isWithinInterval(currentTime, { start: breakStart, end: breakEnd })) {
            isInBreak = true;
            break;
          }
        }
      }

      if (!isInBreak) {
        slots.push({
          start: format(currentTime, 'HH:mm'),
          end: format(slotEnd, 'HH:mm'),
          available: true,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }

  private async checkSlotAvailability(
    slot: TimeSlot,
    date: Date,
    agents: any[],
    rules: SchedulingRule
  ): Promise<any> {
    // Compter les rendez-vous existants pour ce créneau
    const existingAppointments = await this.prisma.appointment.count({
      where: {
        date,
        timeSlot: `${slot.start}-${slot.end}`,
        status: { notIn: ['CANCELLED'] },
      },
    });

    // Vérifier la capacité
    const totalCapacity = agents.length * rules.maxConcurrent;
    const remainingCapacity = totalCapacity - existingAppointments;

    if (remainingCapacity <= 0) {
      return { available: false };
    }

    // Trouver un agent disponible
    for (const agent of agents) {
      const agentAppointments = await this.prisma.appointment.count({
        where: {
          agentId: agent.id,
          date,
          timeSlot: `${slot.start}-${slot.end}`,
          status: { notIn: ['CANCELLED'] },
        },
      });

      if (agentAppointments < rules.maxConcurrent) {
        return {
          available: true,
          agentId: agent.id,
          agentName: `${agent.firstName} ${agent.lastName}`,
          remainingCapacity: rules.maxConcurrent - agentAppointments,
        };
      }
    }

    return { available: false };
  }

  private async isHoliday(organizationId: string, date: Date): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { holidays: true },
    });

    if (!organization || !organization.holidays) return false;

    return organization.holidays.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  }

  private generateAppointmentNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `APT-${timestamp}-${random}`.toUpperCase();
  }
} 