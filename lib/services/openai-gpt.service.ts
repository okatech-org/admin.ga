// Service stub pour éviter les erreurs de références manquantes
// Ce fichier devrait être remplacé par une vraie implémentation ou supprimé si non nécessaire

export class OpenAIGPTService {
  private static instance: OpenAIGPTService;
  
  static getInstance(): OpenAIGPTService {
    if (!this.instance) {
      this.instance = new OpenAIGPTService();
    }
    return this.instance;
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    console.warn('OpenAIGPTService.testConnection() - Service non configuré');
    
    // Retourner une erreur silencieuse pour éviter le crash
    return {
      success: false,
      error: 'Service OpenAI GPT non configuré. Veuillez configurer votre clé API.'
    };
  }

  async generateCompletion(prompt: string): Promise<string> {
    console.warn('OpenAIGPTService.generateCompletion() - Service non configuré');
    throw new Error('Service OpenAI GPT non configuré');
  }

  isConfigured(): boolean {
    // Vérifier si la clé API est configurée
    return false;
  }
}

export default OpenAIGPTService;