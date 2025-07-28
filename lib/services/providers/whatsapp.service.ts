/* @ts-nocheck */
interface WhatsAppPayload {
  to: string;
  message: string;
  mediaUrl?: string;
  templateName?: string;
  templateParams?: Record<string, any>;
}

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  
  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.apiUrl = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  }

  /**
   * Envoyer un message WhatsApp
   */
  async send(payload: WhatsAppPayload): Promise<WhatsAppResult> {
    try {
      // TODO: Implémenter l'envoi réel via WhatsApp Business API
      // Pour l'instant, simuler l'envoi
      console.log(`WhatsApp to ${payload.to}: ${payload.message}`);
      
      return {
        success: true,
        messageId: `wa-${Date.now()}`,
      };
    } catch (error: any) {
      console.error('WhatsApp error:', error);
      
      return {
        success: false,
        error: error.message || 'Erreur envoi WhatsApp',
      };
    }
  }

  /**
   * Envoyer un message template
   */
  async sendTemplate(
    to: string,
    templateName: string,
    templateParams: Record<string, any>
  ): Promise<WhatsAppResult> {
    return this.send({
      to,
      message: '', // Non utilisé pour les templates
      templateName,
      templateParams,
    });
  }

  /**
   * Envoyer un message avec média
   */
  async sendMedia(
    to: string,
    message: string,
    mediaUrl: string,
    mediaType: 'image' | 'document' | 'audio' | 'video'
  ): Promise<WhatsAppResult> {
    return this.send({
      to,
      message,
      mediaUrl,
    });
  }

  /**
   * Marquer un message comme lu
   */
  async markAsRead(messageId: string): Promise<void> {
    // TODO: Implémenter via WhatsApp Business API
    console.log(`Marking message ${messageId} as read`);
  }

  /**
   * Vérifier si un numéro est sur WhatsApp
   */
  async checkContact(phoneNumber: string): Promise<boolean> {
    // TODO: Implémenter la vérification via API
    return true;
  }

  /**
   * Créer un lien de conversation
   */
  createChatLink(phoneNumber: string, message?: string): string {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    let url = `https://wa.me/${cleanNumber}`;
    
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    
    return url;
  }
} 