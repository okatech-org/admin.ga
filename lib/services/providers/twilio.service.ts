/* @ts-nocheck */
interface SmsPayload {
  to: string;
  message: string;
  mediaUrl?: string;
}

interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  
  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  /**
   * Envoyer un SMS
   */
  async send(payload: SmsPayload): Promise<SmsResult> {
    try {
      // TODO: Implémenter l'envoi réel via Twilio API
      // Pour l'instant, simuler l'envoi
      console.log(`SMS to ${payload.to}: ${payload.message}`);
      
      return {
        success: true,
        messageId: `sms-${Date.now()}`,
      };
    } catch (error: any) {
      console.error('Twilio error:', error);
      
      return {
        success: false,
        error: error.message || 'Erreur envoi SMS',
      };
    }
  }

  /**
   * Envoyer un SMS en masse
   */
  async sendBulk(recipients: string[], message: string): Promise<void> {
    // Twilio recommande de limiter les envois simultanés
    const batchSize = 10;
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(to => this.send({ to, message }))
      );
      
      // Pause entre les batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Vérifier le statut d'un SMS
   */
  async checkStatus(messageId: string): Promise<any> {
    // TODO: Implémenter via Twilio API
    return { status: 'delivered' };
  }

  /**
   * Valider un numéro de téléphone
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Format gabonais: +241 XX XX XX XX
    const gabonRegex = /^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
    return gabonRegex.test(phoneNumber);
  }

  /**
   * Formater un numéro de téléphone
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Retirer tous les espaces et tirets
    let cleaned = phoneNumber.replace(/[\s-]/g, '');
    
    // Ajouter le code pays si manquant
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      cleaned = '+241' + cleaned;
    }
    
    return cleaned;
  }
} 