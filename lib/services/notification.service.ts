/* @ts-nocheck */
import { PrismaClient, Notification, NotificationChannel, NotificationType } from '@prisma/client';
import { SendGridService } from './providers/sendgrid.service';
import { TwilioService } from './providers/twilio.service';
import { WhatsAppService } from './providers/whatsapp.service';
import { PushNotificationService } from './providers/push.service';

interface NotificationPayload {
  type: NotificationType;
  recipientId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: Date;
}

interface NotificationTemplate {
  id: string;
  name: string;
  channels: NotificationChannel[];
  subject?: string;
  content: string;
  variables: string[];
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
  inApp: boolean;
  quietHours?: {
    start: string; // "22:00"
    end: string;   // "08:00"
  };
}

export class NotificationService {
  private prisma: PrismaClient;
  private emailProvider: SendGridService;
  private smsProvider: TwilioService;
  private whatsappProvider: WhatsAppService;
  private pushProvider: PushNotificationService;
  
  // Templates de notification par type
  private templates: Record<NotificationType, NotificationTemplate> = {
    DEMANDE_RECUE: {
      id: 'demande_recue',
      name: 'Demande reçue',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      subject: 'Votre demande a été reçue',
      content: 'Bonjour {{firstName}}, votre demande {{trackingNumber}} a été reçue et sera traitée dans les meilleurs délais.',
      variables: ['firstName', 'trackingNumber'],
    },
    DEMANDE_ASSIGNEE: {
      id: 'demande_assignee',
      name: 'Demande assignée',
      channels: ['EMAIL', 'IN_APP'],
      subject: 'Votre demande a été assignée',
      content: 'Votre demande {{trackingNumber}} a été assignée à un agent pour traitement.',
      variables: ['trackingNumber'],
    },
    DEMANDE_VALIDEE: {
      id: 'demande_validee',
      name: 'Demande validée',
      channels: ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'],
      subject: 'Votre demande a été validée',
      content: 'Félicitations {{firstName}}, votre demande {{trackingNumber}} a été validée.',
      variables: ['firstName', 'trackingNumber'],
    },
    DOCUMENT_MANQUANT: {
      id: 'document_manquant',
      name: 'Document manquant',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      subject: 'Documents manquants pour votre demande',
      content: 'Des documents sont manquants pour votre demande {{trackingNumber}}. Veuillez les fournir: {{documents}}',
      variables: ['trackingNumber', 'documents'],
    },
    DOCUMENT_PRET: {
      id: 'document_pret',
      name: 'Document prêt',
      channels: ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'],
      subject: 'Votre document est prêt',
      content: 'Votre document pour la demande {{trackingNumber}} est prêt. Vous pouvez le récupérer à {{location}}.',
      variables: ['trackingNumber', 'location'],
    },
    RDV_CONFIRME: {
      id: 'rdv_confirme',
      name: 'Rendez-vous confirmé',
      channels: ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'],
      subject: 'Confirmation de votre rendez-vous',
      content: 'Votre rendez-vous est confirmé pour le {{date}} à {{time}} avec {{agentName}}.',
      variables: ['date', 'time', 'agentName'],
    },
    RAPPEL_RDV: {
      id: 'rappel_rdv',
      name: 'Rappel de rendez-vous',
      channels: ['SMS', 'WHATSAPP', 'PUSH'],
      subject: 'Rappel: Rendez-vous demain',
      content: 'Rappel: Vous avez rendez-vous demain {{date}} à {{time}}.',
      variables: ['date', 'time'],
    },
    STATUT_CHANGE: {
      id: 'statut_change',
      name: 'Changement de statut',
      channels: ['EMAIL', 'IN_APP'],
      subject: 'Mise à jour de votre demande',
      content: 'Le statut de votre demande {{trackingNumber}} a changé: {{newStatus}}',
      variables: ['trackingNumber', 'newStatus'],
    },
    SYSTEM_ALERT: {
      id: 'system_alert',
      name: 'Alerte système',
      channels: ['EMAIL', 'IN_APP', 'PUSH'],
      subject: 'Alerte: {{alertType}}',
      content: '{{alertMessage}}',
      variables: ['alertType', 'alertMessage'],
    },
    PAYMENT_RECEIVED: {
      id: 'payment_received',
      name: 'Paiement reçu',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      subject: 'Confirmation de paiement',
      content: 'Nous avons reçu votre paiement de {{amount}} {{currency}} pour la demande {{trackingNumber}}.',
      variables: ['amount', 'currency', 'trackingNumber'],
    },
    SIGNATURE_REQUESTED: {
      id: 'signature_requested',
      name: 'Signature requise',
      channels: ['EMAIL', 'SMS', 'IN_APP'],
      subject: 'Signature électronique requise',
      content: 'Une signature électronique est requise pour votre demande {{trackingNumber}}. Cliquez ici: {{signatureLink}}',
      variables: ['trackingNumber', 'signatureLink'],
    },
  };

  constructor(
    prisma: PrismaClient,
    emailProvider: SendGridService,
    smsProvider: TwilioService,
    whatsappProvider: WhatsAppService,
    pushProvider: PushNotificationService
  ) {
    this.prisma = prisma;
    this.emailProvider = emailProvider;
    this.smsProvider = smsProvider;
    this.whatsappProvider = whatsappProvider;
    this.pushProvider = pushProvider;
  }

  /**
   * Envoyer une notification
   */
  async send(payload: NotificationPayload): Promise<Notification[]> {
    // 1. Récupérer les informations du destinataire
    const recipient = await this.prisma.user.findUnique({
      where: { id: payload.recipientId },
      include: {
        notificationPreferences: true,
      },
    });

    if (!recipient) {
      throw new Error('Destinataire non trouvé');
    }

    // 2. Déterminer les canaux à utiliser
    const channels = payload.channels || this.getDefaultChannels(payload.type);
    const activeChannels = await this.filterActiveChannels(
      channels,
      recipient.notificationPreferences?.[0]?.preferences as any
    );

    // 3. Vérifier les heures calmes
    if (this.isQuietHours(recipient.notificationPreferences?.[0]?.preferences as any)) {
      // Reporter les notifications non urgentes
      if (payload.priority !== 'urgent') {
        const scheduledFor = this.getNextAvailableTime(
          recipient.notificationPreferences?.[0]?.preferences as any
        );
        payload.scheduledFor = scheduledFor;
      }
    }

    // 4. Préparer le contenu à partir du template
    const template = this.templates[payload.type];
    const content = this.renderTemplate(template, {
      firstName: recipient.firstName,
      ...payload.data,
    });

    // 5. Créer les notifications dans la base
    const notifications: Notification[] = [];
    
    for (const channel of activeChannels) {
      const notification = await this.prisma.notification.create({
        data: {
          type: payload.type,
          channel,
          title: payload.title,
          message: content,
          data: payload.data || {},
          receiverId: payload.recipientId,
        },
      });
      
      notifications.push(notification);

      // 6. Envoyer via le canal approprié
      if (!payload.scheduledFor || payload.scheduledFor <= new Date()) {
        await this.sendViaChannel(notification, recipient);
      }
    }

    return notifications;
  }

  /**
   * Envoyer une notification via un canal spécifique
   */
  private async sendViaChannel(notification: Notification, recipient: any): Promise<void> {
    try {
      let result: any;
      
      switch (notification.channel) {
        case 'EMAIL':
          result = await this.emailProvider.send({
            to: recipient.email,
            subject: notification.title,
            html: notification.message,
            data: notification.data as any,
          });
          break;
          
        case 'SMS':
          if (!recipient.phone) {
            throw new Error('Numéro de téléphone manquant');
          }
          result = await this.smsProvider.send({
            to: recipient.phone,
            message: notification.message,
          });
          break;
          
        case 'WHATSAPP':
          if (!recipient.phone) {
            throw new Error('Numéro de téléphone manquant');
          }
          result = await this.whatsappProvider.send({
            to: recipient.phone,
            message: notification.message,
            mediaUrl: (notification.data as any)?.mediaUrl as string,
          });
          break;
          
        case 'PUSH':
          result = await this.pushProvider.send({
            userId: recipient.id,
            title: notification.title,
            body: notification.message,
            data: notification.data as any,
          });
          break;
          
        case 'IN_APP':
          // Les notifications in-app sont déjà en base, rien à faire
          result = { success: true };
          break;
      }

      // Mettre à jour le statut
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          sentAt: new Date(),
          deliveredAt: new Date(),
          externalId: result?.messageId,
        },
      });
    } catch (error: any) {
      // En cas d'erreur, mettre à jour le statut
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          failedAt: new Date(),
          errorMessage: error.message,
          retryCount: { increment: 1 },
        },
      });
      
      // Re-lancer l'erreur pour gestion en amont
      throw error;
    }
  }

  /**
   * Envoyer une notification en masse
   */
  async sendBulk(
    recipientIds: string[],
    payload: Omit<NotificationPayload, 'recipientId'>
  ): Promise<void> {
    // Traiter par batch pour éviter la surcharge
    const batchSize = 100;
    
    for (let i = 0; i < recipientIds.length; i += batchSize) {
      const batch = recipientIds.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(recipientId =>
          this.send({ ...payload, recipientId }).catch(error => {
            console.error(`Erreur envoi notification à ${recipientId}:`, error);
          })
        )
      );
      
      // Pause entre les batches
      if (i + batchSize < recipientIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Renvoyer les notifications échouées
   */
  async retryFailed(): Promise<void> {
    const failedNotifications = await this.prisma.notification.findMany({
      where: {
        failedAt: { not: null },
        retryCount: { lt: 3 },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dernières 24h
        },
      },
      include: {
        receiver: true,
      },
    });

    for (const notification of failedNotifications) {
      try {
        await this.sendViaChannel(notification, notification.receiver);
      } catch (error) {
        console.error(`Échec retry notification ${notification.id}:`, error);
      }
    }
  }

  /**
   * Obtenir les statistiques de notifications
   */
  async getStats(startDate: Date, endDate: Date): Promise<any> {
    const stats = await this.prisma.notification.groupBy({
      by: ['type', 'channel'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
      _sum: {
        retryCount: true,
      },
    });

    const delivered = await this.prisma.notification.count({
      where: {
        deliveredAt: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const failed = await this.prisma.notification.count({
      where: {
        failedAt: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      byTypeAndChannel: stats,
      summary: {
        total: stats.reduce((sum, s) => sum + s._count, 0),
        delivered,
        failed,
        deliveryRate: delivered / (delivered + failed) * 100,
      },
    };
  }

  /**
   * Nettoyer les anciennes notifications
   */
  async cleanup(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true,
      },
    });

    return result.count;
  }

  // Méthodes utilitaires privées

  private getDefaultChannels(type: NotificationType): NotificationChannel[] {
    return this.templates[type]?.channels || ['IN_APP'];
  }

  private async filterActiveChannels(
    channels: NotificationChannel[],
    preferences: any
  ): Promise<NotificationChannel[]> {
    if (!preferences) return channels;

    return channels.filter(channel => {
      switch (channel) {
        case 'EMAIL':
          return preferences.email !== false;
        case 'SMS':
          return preferences.sms !== false;
        case 'WHATSAPP':
          return preferences.whatsapp !== false;
        case 'PUSH':
          return preferences.push !== false;
        case 'IN_APP':
          return preferences.inApp !== false;
        default:
          return true;
      }
    });
  }

  private isQuietHours(preferences: any): boolean {
    if (!preferences?.quietHours) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Heures calmes traversent minuit
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  private getNextAvailableTime(preferences: any): Date {
    if (!preferences?.quietHours) return new Date();

    const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
    const nextAvailable = new Date();
    
    nextAvailable.setHours(endHour, endMinute, 0, 0);
    
    if (nextAvailable <= new Date()) {
      nextAvailable.setDate(nextAvailable.getDate() + 1);
    }

    return nextAvailable;
  }

  private renderTemplate(template: NotificationTemplate, data: Record<string, any>): string {
    let content = template.content;
    
    template.variables.forEach(variable => {
      const value = data[variable] || '';
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    return content;
  }
} 