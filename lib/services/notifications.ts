/* @ts-nocheck */
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { NotificationType, NotificationChannel } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotificationData {
  type: NotificationType;
  receiverId: string;
  senderId?: string;
  title: string;
  message: string;
  data?: any;
  channels?: NotificationChannel[];
}

export class NotificationService {
  
  // Service centralisé pour envoyer des notifications
  static async send(notificationData: NotificationData) {
    const { receiverId, channels = ['IN_APP', 'EMAIL'] } = notificationData;
    
    // Récupérer les préférences utilisateur
    const user = await prisma.user.findUnique({
      where: { id: receiverId },
      include: { 
        notificationPreferences: true 
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const results = [];

    // Envoyer selon les canaux demandés
    for (const channel of channels) {
      try {
        switch (channel) {
          case 'IN_APP':
            await this.sendInApp(notificationData);
            break;
          case 'EMAIL':
            if (this.shouldSendEmail(notificationData.type, user)) {
              await this.sendEmail(notificationData, user);
            }
            break;
          case 'SMS':
            if (this.shouldSendSMS(notificationData.type, user)) {
              await this.sendSMS(notificationData, user);
            }
            break;
        }
        results.push({ channel, success: true });
      } catch (error) {
        console.error(`Erreur notification ${channel}:`, error);
        results.push({ channel, success: false, error });
      }
    }

    return results;
  }

  // Notification in-app
  private static async sendInApp(data: NotificationData) {
    return prisma.notification.create({
      data: {
        type: data.type,
        channel: 'IN_APP',
        title: data.title,
        message: data.message,
        data: data.data,
        senderId: data.senderId,
        receiverId: data.receiverId,
      }
    });
  }

  // Email avec Resend
  private static async sendEmail(data: NotificationData, user: any) {
    const template = this.getEmailTemplate(data.type, data);
    
    const result = await resend.emails.send({
      from: 'Admin.ga <noreply@admin.ga>',
      to: [user.email],
      subject: template.subject,
      html: template.html,
    });

    // Enregistrer la notification
    await prisma.notification.create({
      data: {
        type: data.type,
        channel: 'EMAIL',
        title: data.title,
        message: data.message,
        data: { ...data.data, emailId: result.data?.id },
        senderId: data.senderId,
        receiverId: data.receiverId,
        deliveredAt: result.data ? new Date() : undefined,
        failedAt: result.error ? new Date() : undefined,
        errorMessage: result.error?.message,
      }
    });

    return result;
  }

  // SMS (mockée en développement)
  private static async sendSMS(data: NotificationData, user: any) {
    const smsText = this.getSMSTemplate(data.type, data);
    
    // En développement, on log juste
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS MOCKÉE vers ${user.phone}:`);
      console.log(`Message: ${smsText}`);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      // En production, utiliser Twilio
      // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      // await twilio.messages.create({
      //   body: smsText,
      //   from: process.env.TWILIO_PHONE,
      //   to: user.phone
      // });
    }

    // Enregistrer la notification
    await prisma.notification.create({
      data: {
        type: data.type,
        channel: 'SMS',
        title: data.title,
        message: smsText,
        data: data.data,
        senderId: data.senderId,
        receiverId: data.receiverId,
        deliveredAt: new Date(), // Mockée comme envoyée
      }
    });
  }

  // Vérifier les préférences email
  private static shouldSendEmail(type: NotificationType, user: any): boolean {
    const prefs = user.notificationPreferences;
    if (!prefs) return true; // Par défaut, activer

    switch (type) {
      case 'DEMANDE_RECUE': return prefs.email_demande_recue ?? true;
      case 'DEMANDE_VALIDEE': return prefs.email_demande_validee ?? true;
      case 'RDV_CONFIRME': return prefs.email_rdv_confirme ?? true;
      case 'RAPPEL_RDV': return prefs.email_rappel_rdv ?? true;
      case 'DOCUMENT_PRET': return prefs.email_document_pret ?? true;
      default: return true;
    }
  }

  // Vérifier les préférences SMS
  private static shouldSendSMS(type: NotificationType, user: any): boolean {
    const prefs = user.notificationPreferences;
    if (!prefs) return false; // Par défaut, désactiver SMS

    switch (type) {
      case 'DEMANDE_RECUE': return prefs.sms_demande_recue ?? false;
      case 'DEMANDE_VALIDEE': return prefs.sms_demande_validee ?? true;
      case 'RDV_CONFIRME': return prefs.sms_rdv_confirme ?? true;
      case 'RAPPEL_RDV': return prefs.sms_rappel_rdv ?? true;
      case 'DOCUMENT_PRET': return prefs.sms_document_pret ?? true;
      default: return false;
    }
  }

  // Templates email
  private static getEmailTemplate(type: NotificationType, data: NotificationData) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    switch (type) {
      case 'DEMANDE_RECUE':
        return {
          subject: '✅ Demande reçue - Admin.ga',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #009639;">Demande reçue avec succès</h2>
              <p>Bonjour,</p>
              <p>Votre demande a été reçue et est en cours de traitement.</p>
              <p><strong>Numéro de suivi:</strong> ${data.data?.trackingNumber}</p>
              <p><strong>Type de service:</strong> ${data.data?.serviceType}</p>
              <p>Vous pouvez suivre l'évolution sur votre tableau de bord.</p>
              <a href="${baseUrl}/citoyen/dashboard" style="background: #009639; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir ma demande</a>
            </div>
          `
        };
      
      case 'DEMANDE_VALIDEE':
        return {
          subject: '🎉 Demande validée - Admin.ga',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #009639;">Demande validée</h2>
              <p>Excellente nouvelle ! Votre demande a été validée.</p>
              <p><strong>Numéro:</strong> ${data.data?.trackingNumber}</p>
              <p>Votre document sera bientôt prêt pour récupération.</p>
              <a href="${baseUrl}/citoyen/dashboard" style="background: #009639; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir les détails</a>
            </div>
          `
        };

      case 'RDV_CONFIRME':
        return {
          subject: '📅 Rendez-vous confirmé - Admin.ga',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #009639;">Rendez-vous confirmé</h2>
              <p>Votre rendez-vous a été confirmé.</p>
              <p><strong>Date:</strong> ${data.data?.appointmentDate}</p>
              <p><strong>Heure:</strong> ${data.data?.appointmentTime}</p>
              <p><strong>Lieu:</strong> ${data.data?.location}</p>
              <p>Merci d'être présent(e) à l'heure.</p>
            </div>
          `
        };

      default:
        return {
          subject: data.title,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #009639;">${data.title}</h2>
              <p>${data.message}</p>
            </div>
          `
        };
    }
  }

  // Templates SMS
  private static getSMSTemplate(type: NotificationType, data: NotificationData): string {
    switch (type) {
      case 'DEMANDE_RECUE':
        return `Admin.ga: Demande reçue (${data.data?.trackingNumber}). Suivi sur admin.ga`;
      
      case 'DEMANDE_VALIDEE':
        return `Admin.ga: Demande validée (${data.data?.trackingNumber}). Document bientôt prêt.`;
      
      case 'RDV_CONFIRME':
        return `Admin.ga: RDV confirmé le ${data.data?.appointmentDate} à ${data.data?.appointmentTime}`;
      
      case 'RAPPEL_RDV':
        return `Admin.ga: Rappel RDV demain ${data.data?.appointmentTime} - ${data.data?.location}`;
      
      case 'DOCUMENT_PRET':
        return `Admin.ga: Document prêt (${data.data?.trackingNumber}). Récupération possible.`;
      
      default:
        return data.message;
    }
  }

  // Méthodes utilitaires pour événements courants
  static async notifyNewRequest(requestId: string, userId: string) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { submittedBy: true, organization: true }
    });

    if (!request) return;

    await this.send({
      type: 'DEMANDE_RECUE',
      receiverId: userId,
      title: 'Demande reçue',
      message: `Votre demande de ${request.type} a été reçue et sera traitée dans les plus brefs délais.`,
      data: {
        requestId,
        trackingNumber: request.trackingNumber,
        serviceType: request.type,
        organization: request.organization.name
      },
      channels: ['IN_APP', 'EMAIL']
    });
  }

  static async notifyRequestValidated(requestId: string) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { submittedBy: true }
    });

    if (!request) return;

    await this.send({
      type: 'DEMANDE_VALIDEE',
      receiverId: request.submittedById,
      title: 'Demande validée',
      message: 'Votre demande a été validée avec succès.',
      data: {
        requestId,
        trackingNumber: request.trackingNumber
      },
      channels: ['IN_APP', 'EMAIL', 'SMS']
    });
  }

  static async notifyAppointmentConfirmed(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { citizen: true, organization: true }
    });

    if (!appointment) return;

    await this.send({
      type: 'RDV_CONFIRME',
      receiverId: appointment.citizenId,
      title: 'Rendez-vous confirmé',
      message: `Votre rendez-vous a été confirmé pour le ${appointment.date.toLocaleDateString('fr-FR')}.`,
      data: {
        appointmentId,
        appointmentDate: appointment.date.toLocaleDateString('fr-FR'),
        appointmentTime: appointment.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        location: appointment.location,
        organization: appointment.organization.name
      },
      channels: ['IN_APP', 'EMAIL', 'SMS']
    });
  }
}