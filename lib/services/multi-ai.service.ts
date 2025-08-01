// Service stub pour éviter les erreurs de références manquantes
// Ce fichier devrait être remplacé par une vraie implémentation ou supprimé si non nécessaire

import { OpenAIGPTService } from './openai-gpt.service';

export class MultiAIService {
  private static instance: MultiAIService;
  
  static getInstance(): MultiAIService {
    if (!this.instance) {
      this.instance = new MultiAIService();
    }
    return this.instance;
  }

  async testAllProviders(): Promise<{
    providers: {
      name: string;
      status: 'available' | 'unavailable' | 'error';
      error?: string;
    }[]
  }> {
    console.warn('MultiAIService.testAllProviders() - Service non configuré');
    
    // Tester les providers disponibles
    const providers = [];
    
    // Test OpenAI GPT (actuellement non configuré)
    try {
      const openAIService = OpenAIGPTService.getInstance();
      const result = await openAIService.testConnection();
      
      providers.push({
        name: 'OpenAI GPT',
        status: result.success ? 'available' : 'unavailable',
        error: result.error
      });
    } catch (error) {
      providers.push({
        name: 'OpenAI GPT',
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Ajouter d'autres providers ici si nécessaire
    
    return { providers };
  }

  async generateResponse(prompt: string, provider?: string): Promise<string> {
    console.warn('MultiAIService.generateResponse() - Service non configuré');
    throw new Error('Aucun service IA n\'est configuré');
  }

  getAvailableProviders(): string[] {
    return [];
  }

  isAnyProviderConfigured(): boolean {
    return false;
  }
}

export default MultiAIService;