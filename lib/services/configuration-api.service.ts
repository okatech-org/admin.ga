import {
  SystemConfiguration,
  ConfigurationApiResponse,
  ConfigurationExport,
  ConfigurationImportResult
} from '@/lib/types/configuration';
import { ConfigurationValidationService } from './configuration-validation.service';
import { toast } from 'react-hot-toast';

export class ConfigurationApiService {
  private static baseUrl = '/api/trpc';

  /**
   * Charge la configuration système actuelle
   */
  static async loadConfiguration(): Promise<ConfigurationApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/configuration.get`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.result?.data || this.getDefaultConfiguration(),
        message: 'Configuration chargée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      return {
        success: false,
        errors: [{
          field: 'general',
          message: 'Impossible de charger la configuration',
          section: 'general'
        }],
        message: 'Erreur lors du chargement'
      };
    }
  }

  /**
   * Sauvegarde la configuration système
   */
  static async saveConfiguration(config: SystemConfiguration): Promise<ConfigurationApiResponse> {
    try {
      // Validation côté client avant envoi
      const validationErrors = ConfigurationValidationService.validateComplete(config);

      if (validationErrors.length > 0) {
        const criticalErrors = ConfigurationValidationService.getCriticalErrors(validationErrors);
        if (criticalErrors.length > 0) {
          return {
            success: false,
            errors: validationErrors,
            message: 'Erreurs critiques détectées. Veuillez corriger avant de sauvegarder.'
          };
        }
      }

      const response = await fetch(`${this.baseUrl}/configuration.update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configuration: config,
          lastModified: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: config,
        message: 'Configuration sauvegardée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        errors: [{
          field: 'general',
          message: 'Erreur lors de la sauvegarde de la configuration',
          section: 'general'
        }],
        message: 'Échec de la sauvegarde'
      };
    }
  }

  /**
   * Exporte la configuration en fichier JSON
   */
  static async exportConfiguration(config: SystemConfiguration): Promise<void> {
    try {
      const exportData: ConfigurationExport = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        configuration: config,
        metadata: {
          exportedBy: 'Super Admin', // À récupérer depuis la session
          platform: 'Administration.GA',
          checksum: this.generateChecksum(config)
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-ga-config-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success('Configuration exportée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export de la configuration');
      throw error;
    }
  }

  /**
   * Importe une configuration depuis un fichier JSON
   */
  static async importConfiguration(file: File): Promise<ConfigurationImportResult> {
    try {
      const fileContent = await this.readFileAsText(file);
      const importData: ConfigurationExport = JSON.parse(fileContent);

      // Validation du format d'import
      if (!importData.configuration || !importData.version || !importData.metadata) {
        return {
          success: false,
          warnings: ['Format de fichier invalide ou incompatible']
        };
      }

      // Validation de la configuration importée
      const validationErrors = ConfigurationValidationService.validateComplete(importData.configuration);

      if (validationErrors.length > 0) {
        return {
          success: false,
          conflicts: validationErrors,
          warnings: ['La configuration importée contient des erreurs']
        };
      }

      // Vérification de l'intégrité (checksum)
      const calculatedChecksum = this.generateChecksum(importData.configuration);
      if (importData.metadata.checksum !== calculatedChecksum) {
        return {
          success: false,
          warnings: ['Intégrité du fichier compromise. Le fichier pourrait être corrompu.']
        };
      }

      return {
        success: true,
        importedConfig: importData.configuration,
        warnings: []
      };
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return {
        success: false,
        warnings: ['Erreur lors de la lecture du fichier ou format JSON invalide']
      };
    }
  }

  /**
   * Test de connexion pour une configuration donnée
   */
  static async testConfiguration(config: SystemConfiguration): Promise<{
    emailTest: boolean;
    smsTest: boolean;
    databaseTest: boolean;
    errors: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/configuration.test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configuration: config })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.result?.data || {
        emailTest: false,
        smsTest: false,
        databaseTest: false,
        errors: ['Impossible de tester la configuration']
      };
    } catch (error) {
      console.error('Erreur lors du test:', error);
      return {
        emailTest: false,
        smsTest: false,
        databaseTest: false,
        errors: ['Erreur lors du test de la configuration']
      };
    }
  }

  /**
   * Réinitialise la configuration aux valeurs par défaut
   */
  static async resetToDefaults(): Promise<ConfigurationApiResponse> {
    try {
      const defaultConfig = this.getDefaultConfiguration();
      return await this.saveConfiguration(defaultConfig);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      return {
        success: false,
        errors: [{
          field: 'general',
          message: 'Erreur lors de la réinitialisation',
          section: 'general'
        }],
        message: 'Échec de la réinitialisation'
      };
    }
  }

  /**
   * Génère un backup automatique de la configuration
   */
  static async createBackup(config: SystemConfiguration): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/configuration.backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configuration: config,
          backupDate: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la création du backup:', error);
      return false;
    }
  }

  /**
   * Utilitaires privés
   */
  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  }

  private static generateChecksum(config: SystemConfiguration): string {
    // Simple checksum pour vérifier l'intégrité
    const str = JSON.stringify(config);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private static getDefaultConfiguration(): SystemConfiguration {
    return {
      general: {
        siteName: 'Administration.GA',
        siteDescription: 'Plateforme numérique de l\'administration gabonaise',
        maintenanceMode: false,
        allowRegistration: true,
        defaultLanguage: 'fr',
        timezone: 'Africa/Libreville'
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        whatsappEnabled: false,
        defaultEmailTemplate: 'modern',
        smtpHost: 'smtp.administration.ga',
        smtpPort: '587',
        smtpUser: 'noreply@administration.ga',
        smtpPassword: '',
        smsProvider: 'Airtel',
        smsApiKey: ''
      },
      security: {
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireNumbers: true,
        passwordRequireSymbols: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        twoFactorEnabled: false,
        ipWhitelist: [],
        securityHeaders: true
      },
      performance: {
        cacheEnabled: true,
        cacheDuration: 3600,
        compressionEnabled: true,
        cdnEnabled: false,
        cdnUrl: '',
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'jpg', 'png', 'docx'],
        databaseBackupSchedule: 'daily',
        logRetentionDays: 30
      },
      integrations: {
        analyticsEnabled: true,
        analyticsProvider: 'internal',
        paymentGateway: 'airtel_money',
        documentSignature: 'docusign',
        identityVerification: 'gabonese_id',
        mapProvider: 'openstreetmap',
        videoConferencing: 'zoom'
      },
      workflow: {
        autoAssignment: true,
        escalationEnabled: true,
        escalationThreshold: 48,
        reminderSchedule: 24,
        approvalWorkflow: true,
        documentValidation: 'manual',
        qualityControl: true
      }
    };
  }
}
