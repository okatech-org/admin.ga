/* @ts-nocheck */
import { MailService } from '@sendgrid/mail';

interface EmailPayload {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  data?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SendGridService {
  private client: MailService;
  private fromEmail: string;
  private fromName: string;
  
  constructor(apiKey: string, fromEmail: string, fromName: string = 'Administration GA') {
    this.client = new MailService();
    this.client.setApiKey(apiKey);
    this.fromEmail = fromEmail;
    this.fromName = fromName;
  }

  /**
   * Envoyer un email
   */
  async send(payload: EmailPayload): Promise<EmailResult> {
    try {
      const msg = {
        to: payload.to,
        from: {
          email: payload.from || this.fromEmail,
          name: this.fromName,
        },
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        templateId: payload.templateId,
        dynamicTemplateData: payload.data,
        attachments: payload.attachments,
      };

      const [response] = await this.client.send(msg);
      
      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
      };
    } catch (error: any) {
      console.error('SendGrid error:', error);
      
      return {
        success: false,
        error: error.message || 'Erreur envoi email',
      };
    }
  }

  /**
   * Envoyer un email en masse
   */
  async sendBulk(recipients: string[], payload: Omit<EmailPayload, 'to'>): Promise<void> {
    // SendGrid permet jusqu'à 1000 destinataires par requête
    const batchSize = 1000;
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      await this.send({
        ...payload,
        to: batch,
      });
      
      // Pause entre les batches pour éviter rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Vérifier le statut d'un email
   */
  async checkStatus(messageId: string): Promise<any> {
    // TODO: Implémenter via SendGrid API
    return { status: 'delivered' };
  }

  /**
   * Créer un template
   */
  async createTemplate(name: string, subject: string, content: string): Promise<string> {
    // TODO: Implémenter la création de templates
    return `template-${Date.now()}`;
  }
} 