import {
  SystemConfiguration,
  ConfigurationValidationError,
  GeneralConfig,
  NotificationConfig,
  SecurityConfig,
  PerformanceConfig,
  IntegrationsConfig,
  WorkflowConfig
} from '@/lib/types/configuration';

export class ConfigurationValidationService {
  static validateGeneral(config: GeneralConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    if (!config.siteName || config.siteName.trim().length < 3) {
      errors.push({
        field: 'siteName',
        message: 'Le nom du site doit contenir au moins 3 caractères',
        section: 'general'
      });
    }

    if (!config.siteDescription || config.siteDescription.trim().length < 10) {
      errors.push({
        field: 'siteDescription',
        message: 'La description doit contenir au moins 10 caractères',
        section: 'general'
      });
    }

    if (!['fr', 'en'].includes(config.defaultLanguage)) {
      errors.push({
        field: 'defaultLanguage',
        message: 'Langue non supportée',
        section: 'general'
      });
    }

    return errors;
  }

  static validateNotifications(config: NotificationConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    // Validation SMTP si email activé
    if (config.emailEnabled) {
      if (!config.smtpHost || !config.smtpHost.trim()) {
        errors.push({
          field: 'smtpHost',
          message: 'L\'hôte SMTP est requis quand l\'email est activé',
          section: 'notifications'
        });
      }

      const port = parseInt(config.smtpPort);
      if (isNaN(port) || port < 1 || port > 65535) {
        errors.push({
          field: 'smtpPort',
          message: 'Le port SMTP doit être un nombre entre 1 et 65535',
          section: 'notifications'
        });
      }

      if (!config.smtpUser || !config.smtpUser.includes('@')) {
        errors.push({
          field: 'smtpUser',
          message: 'L\'utilisateur SMTP doit être une adresse email valide',
          section: 'notifications'
        });
      }

      if (!config.smtpPassword || config.smtpPassword.length < 8) {
        errors.push({
          field: 'smtpPassword',
          message: 'Le mot de passe SMTP doit contenir au moins 8 caractères',
          section: 'notifications'
        });
      }
    }

    // Validation SMS si activé
    if (config.smsEnabled) {
      if (!['Airtel', 'Moov'].includes(config.smsProvider)) {
        errors.push({
          field: 'smsProvider',
          message: 'Fournisseur SMS non supporté',
          section: 'notifications'
        });
      }

      if (!config.smsApiKey || config.smsApiKey.length < 10) {
        errors.push({
          field: 'smsApiKey',
          message: 'La clé API SMS doit contenir au moins 10 caractères',
          section: 'notifications'
        });
      }
    }

    return errors;
  }

  static validateSecurity(config: SecurityConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    if (config.passwordMinLength < 6 || config.passwordMinLength > 50) {
      errors.push({
        field: 'passwordMinLength',
        message: 'La longueur minimale doit être entre 6 et 50 caractères',
        section: 'security'
      });
    }

    if (config.sessionTimeout < 5 || config.sessionTimeout > 1440) {
      errors.push({
        field: 'sessionTimeout',
        message: 'Le timeout de session doit être entre 5 et 1440 minutes',
        section: 'security'
      });
    }

    if (config.maxLoginAttempts < 3 || config.maxLoginAttempts > 20) {
      errors.push({
        field: 'maxLoginAttempts',
        message: 'Le nombre max de tentatives doit être entre 3 et 20',
        section: 'security'
      });
    }

    if (config.lockoutDuration < 5 || config.lockoutDuration > 120) {
      errors.push({
        field: 'lockoutDuration',
        message: 'La durée de blocage doit être entre 5 et 120 minutes',
        section: 'security'
      });
    }

    // Validation des IPs whitelist
    if (config.ipWhitelist.length > 0) {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      config.ipWhitelist.forEach((ip, index) => {
        if (!ipRegex.test(ip.trim())) {
          errors.push({
            field: `ipWhitelist[${index}]`,
            message: `Adresse IP invalide: ${ip}`,
            section: 'security'
          });
        }
      });
    }

    return errors;
  }

  static validatePerformance(config: PerformanceConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    if (config.cacheDuration < 60 || config.cacheDuration > 86400) {
      errors.push({
        field: 'cacheDuration',
        message: 'La durée de cache doit être entre 60 et 86400 secondes',
        section: 'performance'
      });
    }

    if (config.maxFileSize < 1 || config.maxFileSize > 100) {
      errors.push({
        field: 'maxFileSize',
        message: 'La taille max de fichier doit être entre 1 et 100 MB',
        section: 'performance'
      });
    }

    if (config.logRetentionDays < 1 || config.logRetentionDays > 365) {
      errors.push({
        field: 'logRetentionDays',
        message: 'La rétention des logs doit être entre 1 et 365 jours',
        section: 'performance'
      });
    }

    if (config.allowedFileTypes.length === 0) {
      errors.push({
        field: 'allowedFileTypes',
        message: 'Au moins un type de fichier doit être autorisé',
        section: 'performance'
      });
    }

    // Validation CDN URL si activé
    if (config.cdnEnabled) {
      if (!config.cdnUrl || !config.cdnUrl.startsWith('http')) {
        errors.push({
          field: 'cdnUrl',
          message: 'L\'URL CDN doit être une URL valide (http/https)',
          section: 'performance'
        });
      }
    }

    return errors;
  }

  static validateIntegrations(config: IntegrationsConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    const validAnalyticsProviders = ['internal', 'google_analytics', 'matomo'];
    if (!validAnalyticsProviders.includes(config.analyticsProvider)) {
      errors.push({
        field: 'analyticsProvider',
        message: 'Fournisseur d\'analytics non supporté',
        section: 'integrations'
      });
    }

    const validPaymentGateways = ['airtel_money', 'moov_money', 'stripe'];
    if (!validPaymentGateways.includes(config.paymentGateway)) {
      errors.push({
        field: 'paymentGateway',
        message: 'Passerelle de paiement non supportée',
        section: 'integrations'
      });
    }

    const validDocumentSignatures = ['docusign', 'adobe_sign', 'internal'];
    if (!validDocumentSignatures.includes(config.documentSignature)) {
      errors.push({
        field: 'documentSignature',
        message: 'Service de signature électronique non supporté',
        section: 'integrations'
      });
    }

    const validIdentityVerifications = ['gabonese_id', 'biometric', 'manual'];
    if (!validIdentityVerifications.includes(config.identityVerification)) {
      errors.push({
        field: 'identityVerification',
        message: 'Méthode de vérification d\'identité non supportée',
        section: 'integrations'
      });
    }

    const validMapProviders = ['openstreetmap', 'google_maps', 'mapbox'];
    if (!validMapProviders.includes(config.mapProvider)) {
      errors.push({
        field: 'mapProvider',
        message: 'Fournisseur de cartes non supporté',
        section: 'integrations'
      });
    }

    return errors;
  }

  static validateWorkflow(config: WorkflowConfig): ConfigurationValidationError[] {
    const errors: ConfigurationValidationError[] = [];

    if (config.escalationThreshold < 1 || config.escalationThreshold > 168) {
      errors.push({
        field: 'escalationThreshold',
        message: 'Le seuil d\'escalade doit être entre 1 et 168 heures',
        section: 'workflow'
      });
    }

    if (config.reminderSchedule < 1 || config.reminderSchedule > 72) {
      errors.push({
        field: 'reminderSchedule',
        message: 'La fréquence de rappel doit être entre 1 et 72 heures',
        section: 'workflow'
      });
    }

    const validDocumentValidations = ['manual', 'automatic', 'hybrid'];
    if (!validDocumentValidations.includes(config.documentValidation)) {
      errors.push({
        field: 'documentValidation',
        message: 'Type de validation de document non supporté',
        section: 'workflow'
      });
    }

    return errors;
  }

  static validateComplete(configuration: SystemConfiguration): ConfigurationValidationError[] {
    const allErrors: ConfigurationValidationError[] = [];

    allErrors.push(...this.validateGeneral(configuration.general));
    allErrors.push(...this.validateNotifications(configuration.notifications));
    allErrors.push(...this.validateSecurity(configuration.security));
    allErrors.push(...this.validatePerformance(configuration.performance));
    allErrors.push(...this.validateIntegrations(configuration.integrations));
    allErrors.push(...this.validateWorkflow(configuration.workflow));

    return allErrors;
  }

  static hasErrors(configuration: SystemConfiguration): boolean {
    return this.validateComplete(configuration).length > 0;
  }

  static getCriticalErrors(errors: ConfigurationValidationError[]): ConfigurationValidationError[] {
    const criticalFields = [
      'siteName', 'smtpHost', 'smtpPort', 'passwordMinLength',
      'sessionTimeout', 'maxLoginAttempts', 'cacheDuration'
    ];

    return errors.filter(error => criticalFields.includes(error.field));
  }

  static getErrorsBySection(errors: ConfigurationValidationError[], section: keyof SystemConfiguration): ConfigurationValidationError[] {
    return errors.filter(error => error.section === section);
  }
}
