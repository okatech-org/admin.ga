/* @ts-nocheck */
import { PrismaClient, Appointment, ServiceType } from '@prisma/client';
import { addMinutes, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  agentId?: string;
  agentName?: string;
  capacity?: number;
  booked?: number;
}

interface ScheduleConfig {
  workingHours: {
    [day: string]: {
      start: string;
      end: string;
      breaks?: Array<{ start: string; end: string }>;
    };
  };
  slotDuration: number; // en minutes
  bufferTime?: number; // temps entre RDV
  maxConcurrentAppointments?: number;
  advanceBookingDays?: number;
  minNoticeHours?: number;
}

interface AvailabilityQuery {
  serviceType: ServiceType;
  organizationId: string;
  date: Date;
  duration?: number;
  agentId?: string;
  preferredTime?: string;
}

interface OptimizationOptions {
  balanceLoad?: boolean;
  preferSameAgent?: boolean;
  minimizeWaitTime?: boolean;
  groupBySimilarService?: boolean;
}

export class SchedulerService {
  private prisma: PrismaClient;
  private defaultConfig: ScheduleConfig = {
    workingHours: {
      monday: { start: '08:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      tuesday: { start: '08:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      wednesday: { start: '08:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      thursday: { start: '08:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      friday: { start: '08:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
    },
    slotDuration: 30,
    bufferTime: 5,
    maxConcurrentAppointments: 1,
    advanceBookingDays: 30,
    minNoticeHours: 24,
  };
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Trouver les créneaux disponibles
   */
  async findAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    // 1. Obtenir la configuration de l'organisation
    const config = await this.getOrganizationConfig(query.organizationId);
    
    // 2. Vérifier que la date est valide
    if (!this.isValidBookingDate(query.date, config)) {
      return [];
    }

    // 3. Obtenir les agents disponibles
    const agents = await this.getAvailableAgents(
      query.organizationId,
      query.serviceType,
      query.agentId
    );

    if (agents.length === 0) {
      return [];
    }

    // 4. Générer les créneaux de base
    const baseSlots = this.generateBaseSlots(query.date, config);

    // 5. Obtenir les rendez-vous existants
    const existingAppointments = await this.getExistingAppointments(
      query.organizationId,
      query.date,
      agents.map(a => a.id)
    );

    // 6. Calculer la disponibilité
    const availableSlots = this.calculateAvailability(
      baseSlots,
      existingAppointments,
      agents,
      config
    );

    // 7. Filtrer selon la durée demandée
    if (query.duration && query.duration > config.slotDuration) {
      return this.filterSlotsForDuration(availableSlots, query.duration, config);
    }

    return availableSlots;
  }

  /**
   * Réserver un créneau
   */
  async bookSlot(
    slot: TimeSlot,
    userId: string,
    serviceType: ServiceType,
    organizationId: string,
    notes?: string
  ): Promise<Appointment> {
    // Vérifier la disponibilité une dernière fois
    const isAvailable = await this.checkSlotAvailability(slot, organizationId);
    if (!isAvailable) {
      throw new Error('Ce créneau n\'est plus disponible');
    }

    // Créer le rendez-vous
    const appointment = await this.prisma.appointment.create({
      data: {
        date: slot.start,
        timeSlot: this.formatTimeSlot(slot),
        duration: this.getSlotDuration(slot),
        status: 'SCHEDULED',
        citizenId: userId,
        agentId: slot.agentId!,
        organizationId,
        serviceType,
        notes,
        appointmentNumber: this.generateAppointmentNumber(),
      },
    });

    // Envoyer les notifications
    await this.sendBookingNotifications(appointment);

    return appointment;
  }

  /**
   * Reprogrammer un rendez-vous
   */
  async rescheduleAppointment(
    appointmentId: string,
    newSlot: TimeSlot
  ): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    if (appointment.status !== 'SCHEDULED' && appointment.status !== 'CONFIRMED') {
      throw new Error('Ce rendez-vous ne peut pas être reprogrammé');
    }

    // Vérifier la disponibilité du nouveau créneau
    const isAvailable = await this.checkSlotAvailability(
      newSlot,
      appointment.organizationId
    );

    if (!isAvailable) {
      throw new Error('Le nouveau créneau n\'est pas disponible');
    }

    // Mettre à jour le rendez-vous
    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: newSlot.start,
        timeSlot: this.formatTimeSlot(newSlot),
        agentId: newSlot.agentId || appointment.agentId,
      },
    });

    // Envoyer les notifications de changement
    await this.sendRescheduleNotifications(updated);

    return updated;
  }

  /**
   * Optimiser le planning d'une journée
   */
  async optimizeSchedule(
    organizationId: string,
    date: Date,
    options: OptimizationOptions = {}
  ): Promise<any> {
    // 1. Obtenir tous les rendez-vous de la journée
    const appointments = await this.prisma.appointment.findMany({
      where: {
        organizationId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      include: {
        citizen: true,
        agent: true,
      },
    });

    // 2. Obtenir les agents disponibles
    const agents = await this.getAvailableAgents(organizationId);

    // 3. Appliquer les stratégies d'optimisation
    let optimizedSchedule = [...appointments];

    if (options.balanceLoad) {
      optimizedSchedule = this.balanceAgentLoad(optimizedSchedule, agents);
    }

    if (options.minimizeWaitTime) {
      optimizedSchedule = this.minimizeWaitingTime(optimizedSchedule);
    }

    if (options.groupBySimilarService) {
      optimizedSchedule = this.groupByService(optimizedSchedule);
    }

    // 4. Calculer les changements nécessaires
    const changes = this.calculateScheduleChanges(appointments, optimizedSchedule);

    return {
      original: appointments,
      optimized: optimizedSchedule,
      changes,
      metrics: this.calculateScheduleMetrics(optimizedSchedule),
    };
  }

  /**
   * Gérer les rappels automatiques
   */
  async sendReminders(): Promise<void> {
    // Rendez-vous de demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay(tomorrow),
          lte: endOfDay(tomorrow),
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        reminderSent: false,
      },
      include: {
        citizen: true,
        organization: true,
      },
    });

    for (const appointment of appointments) {
      await this.sendReminderNotification(appointment);
      
      await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: { reminderSent: true },
      });
    }
  }

  /**
   * Obtenir les statistiques de planning
   */
  async getScheduleStats(
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
    });

    const stats = {
      total: appointments.length,
      byStatus: {} as Record<string, number>,
      byAgent: {} as Record<string, number>,
      byService: {} as Record<string, number>,
      utilizationRate: 0,
      noShowRate: 0,
      averageWaitTime: 0,
    };

    // Calculer les statistiques
    appointments.forEach(apt => {
      // Par statut
      stats.byStatus[apt.status] = (stats.byStatus[apt.status] || 0) + 1;
      
      // Par agent
      stats.byAgent[apt.agentId] = (stats.byAgent[apt.agentId] || 0) + 1;
      
      // Par service
      stats.byService[apt.serviceType] = (stats.byService[apt.serviceType] || 0) + 1;
    });

    // Taux de no-show
    stats.noShowRate = stats.total > 0 
      ? (stats.byStatus.NO_SHOW || 0) / stats.total * 100 
      : 0;

    // Taux d'utilisation (simplifiée)
    const config = await this.getOrganizationConfig(organizationId);
    const totalSlots = this.calculateTotalSlots(startDate, endDate, config);
    stats.utilizationRate = totalSlots > 0 
      ? (stats.byStatus.COMPLETED || 0) / totalSlots * 100 
      : 0;

    return stats;
  }

  /**
   * Gérer les listes d'attente
   */
  async addToWaitlist(
    userId: string,
    serviceType: ServiceType,
    organizationId: string,
    preferredDates: Date[],
    notes?: string
  ): Promise<any> {
    // TODO: Implémenter la gestion de liste d'attente
    return {
      id: `WAIT-${Date.now()}`,
      userId,
      serviceType,
      organizationId,
      preferredDates,
      position: 1,
      estimatedWait: '2-3 jours',
    };
  }

  // Méthodes privées

  private async getOrganizationConfig(organizationId: string): Promise<ScheduleConfig> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org || !org.workingHours) {
      return this.defaultConfig;
    }

    // Fusionner avec la config par défaut
    return {
      ...this.defaultConfig,
      workingHours: org.workingHours as any,
    };
  }

  private async getAvailableAgents(
    organizationId: string,
    serviceType?: ServiceType,
    agentId?: string
  ): Promise<any[]> {
    const where: any = {
      primaryOrganizationId: organizationId,
      role: { in: ['AGENT', 'MANAGER'] },
      isActive: true,
    };

    if (agentId) {
      where.id = agentId;
    }

    // TODO: Filtrer par compétence de service
    
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  private async getExistingAppointments(
    organizationId: string,
    date: Date,
    agentIds: string[]
  ): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: {
        organizationId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        agentId: { in: agentIds },
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });
  }

  private generateBaseSlots(date: Date, config: ScheduleConfig): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dayName = format(date, 'EEEE', { locale: fr }).toLowerCase();
    const dayConfig = config.workingHours[dayName];

    if (!dayConfig) {
      return slots;
    }

    const startTime = this.parseTime(dayConfig.start, date);
    const endTime = this.parseTime(dayConfig.end, date);
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, config.slotDuration);
      
      // Vérifier si le créneau n'est pas dans une pause
      const isBreak = dayConfig.breaks?.some(breakTime => {
        const breakStart = this.parseTime(breakTime.start, date);
        const breakEnd = this.parseTime(breakTime.end, date);
        return isWithinInterval(currentTime, { start: breakStart, end: breakEnd });
      });

      if (!isBreak && slotEnd <= endTime) {
        slots.push({
          start: new Date(currentTime),
          end: slotEnd,
          available: true,
        });
      }

      currentTime = addMinutes(currentTime, config.slotDuration + (config.bufferTime || 0));
    }

    return slots;
  }

  private calculateAvailability(
    baseSlots: TimeSlot[],
    appointments: Appointment[],
    agents: any[],
    config: ScheduleConfig
  ): TimeSlot[] {
    const availableSlots: TimeSlot[] = [];

    baseSlots.forEach(slot => {
      agents.forEach(agent => {
        // Compter les RDV de cet agent sur ce créneau
        const concurrentAppointments = appointments.filter(apt => 
          apt.agentId === agent.id &&
          this.isOverlapping(slot, apt)
        ).length;

        if (concurrentAppointments < (config.maxConcurrentAppointments || 1)) {
          availableSlots.push({
            ...slot,
            agentId: agent.id,
            agentName: `${agent.firstName} ${agent.lastName}`,
            capacity: config.maxConcurrentAppointments || 1,
            booked: concurrentAppointments,
          });
        }
      });
    });

    return availableSlots;
  }

  private filterSlotsForDuration(
    slots: TimeSlot[],
    duration: number,
    config: ScheduleConfig
  ): TimeSlot[] {
    const slotsNeeded = Math.ceil(duration / config.slotDuration);
    const filtered: TimeSlot[] = [];

    for (let i = 0; i < slots.length - slotsNeeded + 1; i++) {
      let canBook = true;
      
      // Vérifier que les créneaux consécutifs sont disponibles
      for (let j = 0; j < slotsNeeded; j++) {
        if (!slots[i + j]?.available || 
            slots[i + j]?.agentId !== slots[i]?.agentId) {
          canBook = false;
          break;
        }
      }

      if (canBook) {
        filtered.push({
          ...slots[i],
          end: slots[i + slotsNeeded - 1].end,
        });
      }
    }

    return filtered;
  }

  private async checkSlotAvailability(
    slot: TimeSlot,
    organizationId: string
  ): Promise<boolean> {
    const overlapping = await this.prisma.appointment.count({
      where: {
        organizationId,
        agentId: slot.agentId,
        date: {
          gte: slot.start,
          lt: slot.end,
        },
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });

    return overlapping === 0;
  }

  private isValidBookingDate(date: Date, config: ScheduleConfig): boolean {
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + (config.minNoticeHours || 24) * 60 * 60 * 1000);
    const maxBookingTime = new Date(now.getTime() + (config.advanceBookingDays || 30) * 24 * 60 * 60 * 1000);

    return date >= minBookingTime && date <= maxBookingTime;
  }

  private formatTimeSlot(slot: TimeSlot): string {
    const start = format(slot.start, 'HH:mm');
    const end = format(slot.end, 'HH:mm');
    return `${start}-${end}`;
  }

  private getSlotDuration(slot: TimeSlot): number {
    return Math.floor((slot.end.getTime() - slot.start.getTime()) / (1000 * 60));
  }

  private generateAppointmentNumber(): string {
    const date = format(new Date(), 'yyyyMMdd');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RDV-${date}-${random}`;
  }

  private parseTime(timeStr: string, date: Date): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private isOverlapping(slot: TimeSlot, appointment: Appointment): boolean {
    const aptStart = new Date(appointment.date);
    const aptEnd = addMinutes(aptStart, appointment.duration);
    
    return (
      (slot.start >= aptStart && slot.start < aptEnd) ||
      (slot.end > aptStart && slot.end <= aptEnd) ||
      (slot.start <= aptStart && slot.end >= aptEnd)
    );
  }

  private async sendBookingNotifications(appointment: any): Promise<void> {
    // TODO: Implémenter l'envoi de notifications
    console.log('Sending booking notifications for:', appointment.id);
  }

  private async sendRescheduleNotifications(appointment: any): Promise<void> {
    // TODO: Implémenter l'envoi de notifications
    console.log('Sending reschedule notifications for:', appointment.id);
  }

  private async sendReminderNotification(appointment: any): Promise<void> {
    // TODO: Implémenter l'envoi de notifications
    console.log('Sending reminder for:', appointment.id);
  }

  private balanceAgentLoad(appointments: any[], agents: any[]): any[] {
    // TODO: Implémenter l'équilibrage de charge
    return appointments;
  }

  private minimizeWaitingTime(appointments: any[]): any[] {
    // TODO: Implémenter la minimisation du temps d'attente
    return appointments;
  }

  private groupByService(appointments: any[]): any[] {
    // TODO: Implémenter le regroupement par service
    return appointments.sort((a, b) => 
      a.serviceType.localeCompare(b.serviceType)
    );
  }

  private calculateScheduleChanges(original: any[], optimized: any[]): any[] {
    // TODO: Calculer les changements nécessaires
    return [];
  }

  private calculateScheduleMetrics(schedule: any[]): any {
    return {
      totalAppointments: schedule.length,
      averageUtilization: 0,
      peakHours: [],
      idleTime: 0,
    };
  }

  private calculateTotalSlots(
    startDate: Date,
    endDate: Date,
    config: ScheduleConfig
  ): number {
    // TODO: Calculer le nombre total de créneaux disponibles
    return 100; // Valeur simulée
  }
} 