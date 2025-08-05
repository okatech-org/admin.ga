/* @ts-nocheck */
import { PrismaClient, RequestStatus, ServiceRequest } from '@prisma/client';

interface WorkflowTransition {
  from: RequestStatus[];
  to: RequestStatus;
  action: string;
  requiredRole?: string[];
  validation?: (request: ServiceRequest) => boolean;
}

export class WorkflowService {
  private prisma: PrismaClient;
  
  // Définition des transitions autorisées selon l'architecture
  private transitions: WorkflowTransition[] = [
    {
      from: ['DRAFT'],
      to: 'SUBMITTED',
      action: 'SUBMIT',
    },
    {
      from: ['SUBMITTED'],
      to: 'ASSIGNED',
      action: 'ASSIGN',
      requiredRole: ['MANAGER', 'ADMIN'],
    },
    {
      from: ['SUBMITTED', 'ASSIGNED'],
      to: 'REJECTED',
      action: 'REJECT',
      requiredRole: ['AGENT', 'MANAGER', 'ADMIN'],
    },
    {
      from: ['ASSIGNED'],
      to: 'IN_PROGRESS',
      action: 'START_PROCESSING',
      requiredRole: ['AGENT', 'MANAGER'],
    },
    {
      from: ['IN_PROGRESS'],
      to: 'DOCUMENTS_PENDING',
      action: 'REQUEST_DOCUMENTS',
      requiredRole: ['AGENT', 'MANAGER'],
    },
    {
      from: ['DOCUMENTS_PENDING'],
      to: 'IN_PROGRESS',
      action: 'DOCUMENTS_RECEIVED',
      requiredRole: ['AGENT', 'MANAGER'],
      validation: (request) => {
        // Vérifier que tous les documents requis sont présents
        return true; // Simplifié pour l'instant
      },
    },
    {
      from: ['IN_PROGRESS'],
      to: 'VALIDATED',
      action: 'VALIDATE',
      requiredRole: ['AGENT', 'MANAGER'],
    },
    {
      from: ['VALIDATED'],
      to: 'READY',
      action: 'PREPARE',
      requiredRole: ['AGENT', 'MANAGER'],
    },
    {
      from: ['READY'],
      to: 'COMPLETED',
      action: 'DELIVER',
      requiredRole: ['AGENT', 'MANAGER'],
    },
    {
      from: ['IN_PROGRESS', 'DOCUMENTS_PENDING'],
      to: 'REJECTED',
      action: 'REJECT',
      requiredRole: ['AGENT', 'MANAGER', 'ADMIN'],
    },
  ];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Effectuer une transition d'état
   */
  async transition(
    requestId: string,
    action: string,
    userId: string,
    userRole: string,
    metadata?: any
  ): Promise<ServiceRequest> {
    return await this.prisma.$transaction(async (tx) => {
      // Récupérer la demande actuelle
      const request = await tx.serviceRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new Error('Demande non trouvée');
      }

      // Trouver la transition correspondante
      const transition = this.transitions.find(t => 
        t.action === action && t.from.includes(request.status)
      );

      if (!transition) {
        throw new Error(`Transition invalide: ${action} depuis ${request.status}`);
      }

      // Vérifier les permissions
      if (transition.requiredRole && !transition.requiredRole.includes(userRole)) {
        throw new Error(`Rôle insuffisant pour l'action ${action}`);
      }

      // Validation personnalisée
      if (transition.validation && !transition.validation(request)) {
        throw new Error('Validation échouée pour cette transition');
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        status: transition.to,
      };

      // Mettre à jour les timestamps selon l'état
      const now = new Date();
      switch (transition.to) {
        case 'SUBMITTED':
          updateData.submittedAt = now;
          break;
        case 'ASSIGNED':
          updateData.assignedAt = now;
          if (metadata?.assignedToId) {
            updateData.assignedToId = metadata.assignedToId;
          }
          break;
        case 'IN_PROGRESS':
          updateData.processingStarted = now;
          if (metadata?.processedById) {
            updateData.processedById = metadata.processedById;
          }
          break;
        case 'VALIDATED':
          updateData.validatedAt = now;
          updateData.documentsValidated = now;
          break;
        case 'READY':
          updateData.readyAt = now;
          break;
        case 'COMPLETED':
          updateData.completedAt = now;
          updateData.actualProcessingTime = this.calculateProcessingTime(request);
          break;
        case 'REJECTED':
          if (metadata?.rejectionReason) {
            updateData.rejectionReason = metadata.rejectionReason;
          }
          break;
      }

      // Mettre à jour la demande
      const updatedRequest = await tx.serviceRequest.update({
        where: { id: requestId },
        data: updateData,
      });

      // Créer une entrée dans la timeline
      await tx.requestTimeline.create({
        data: {
          requestId,
          actorId: userId,
          action,
          details: metadata || {},
        },
      });

      // Créer un log d'audit
      await tx.auditLog.create({
        data: {
          userId,
          action: `REQUEST_${action}`,
          resource: 'service_request',
          resourceId: requestId,
          details: {
            fromStatus: request.status,
            toStatus: transition.to,
            metadata,
          },
        },
      });

      return updatedRequest;
    });
  }

  /**
   * Obtenir les actions possibles pour une demande
   */
  getPossibleActions(currentStatus: RequestStatus, userRole: string): string[] {
    return this.transitions
      .filter(t => 
        t.from.includes(currentStatus) &&
        (!t.requiredRole || t.requiredRole.includes(userRole))
      )
      .map(t => t.action);
  }

  /**
   * Calculer le temps de traitement
   */
  private calculateProcessingTime(request: ServiceRequest): number {
    if (!request.submittedAt) return 0;
    
    const now = new Date();
    const diffMs = now.getTime() - request.submittedAt.getTime();
    return Math.floor(diffMs / (1000 * 60)); // en minutes
  }

  /**
   * Assigner automatiquement une demande selon les règles
   */
  async autoAssign(requestId: string): Promise<string | null> {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { organization: true },
    });

    if (!request) return null;

    // Trouver un agent disponible dans l'organisation
    const availableAgent = await this.prisma.user.findFirst({
      where: {
        role: 'AGENT',
        isActive: true,
        primaryOrganizationId: request.organizationId,
        // TODO: Ajouter logique de charge de travail
      },
      orderBy: { lastLoginAt: 'desc' },
    });

    return availableAgent?.id || null;
  }

  /**
   * Vérifier les SLAs et envoyer des alertes
   */
  async checkSLAs(): Promise<void> {
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        status: { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] },
        slaDeadline: { lt: new Date() },
      },
      include: {
        submittedBy: true,
        organization: true,
      },
    });

    for (const request of requests) {
      // Créer une notification d'alerte SLA
      await this.prisma.notification.create({
        data: {
          type: 'SYSTEM_ALERT',
          channel: 'IN_APP',
          title: 'SLA dépassé',
          message: `La demande ${request.trackingNumber} a dépassé son SLA`,
          receiverId: request.submittedById,
          data: {
            requestId: request.id,
            trackingNumber: request.trackingNumber,
          },
        },
      });

      // Notifier les managers
      const managers = await this.prisma.user.findMany({
        where: {
          role: { in: ['MANAGER', 'ADMIN'] },
          primaryOrganizationId: request.organizationId,
          isActive: true,
        },
      });

      for (const manager of managers) {
        await this.prisma.notification.create({
          data: {
            type: 'SYSTEM_ALERT',
            channel: 'EMAIL',
            title: 'SLA dépassé - Action requise',
            message: `La demande ${request.trackingNumber} nécessite une attention immédiate`,
            receiverId: manager.id,
            data: {
              requestId: request.id,
              trackingNumber: request.trackingNumber,
              organization: request.organization.name,
            },
          },
        });
      }
    }
  }
} 