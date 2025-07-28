/**
 * Configuration centrale de l'application
 * Ce fichier centralise toutes les configurations et paramètres de l'application
 */

export const appConfig = {
  // Informations de base
  app: {
    name: 'Administration GA',
    description: 'Plateforme numérique d\'administration publique du Gabon',
    version: '1.0.0',
    url: process.env.APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },

  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL,
    poolSize: 10,
    timeout: 30000,
  },

  // Configuration d'authentification
  auth: {
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600'),
    extendOnActivity: process.env.SESSION_EXTEND_ON_ACTIVITY === 'true',
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    otpConfig: {
      length: 6,
      expiryMinutes: 5,
      maxAttempts: 3,
    },
  },

  // Configuration des notifications
  notifications: {
    email: {
      enabled: true,
      provider: 'sendgrid',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@administration.ga',
      fromName: process.env.SENDGRID_FROM_NAME || 'Administration GA',
    },
    sms: {
      enabled: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
      provider: 'twilio',
      fromNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    whatsapp: {
      enabled: process.env.ENABLE_WHATSAPP_NOTIFICATIONS === 'true',
      provider: 'whatsapp-business',
    },
    push: {
      enabled: true,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    },
  },

  // Configuration des paiements
  payment: {
    enabled: process.env.ENABLE_PAYMENT_GATEWAY === 'true',
    currency: 'XAF',
    providers: {
      airtelMoney: {
        enabled: true,
        minAmount: 100,
        maxAmount: 5000000,
      },
      moovMoney: {
        enabled: true,
        minAmount: 100,
        maxAmount: 3000000,
      },
    },
  },

  // Configuration du stockage
  storage: {
    provider: 'uploadthing', // 'uploadthing' | 's3' | 'local'
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,doc,docx').split(','),
    documentRetention: {
      temporary: 7, // jours
      permanent: 3650, // 10 ans
    },
  },

  // Configuration des services
  services: {
    types: [
      'ACTE_NAISSANCE',
      'CARTE_IDENTITE',
      'PASSEPORT',
      'CASIER_JUDICIAIRE',
      'CERTIFICAT_NATIONALITE',
      'PERMIS_CONDUIRE',
      'LICENCE_COMMERCE',
      'PERMIS_CONSTRUIRE',
      'CERTIFICAT_RESIDENCE',
      'ATTESTATION_TRAVAIL',
    ],
    defaultProcessingDays: 7,
    urgentProcessingDays: 2,
    urgentProcessingFee: 10000,
  },

  // Configuration des rendez-vous
  appointments: {
    slotDuration: 30, // minutes
    bufferTime: 5, // minutes entre RDV
    workingHours: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
    },
    lunchBreak: { start: '12:00', end: '13:00' },
    advanceBookingDays: 30,
    minNoticeHours: 24,
    reminderHoursBefore: 24,
  },

  // Configuration de localisation
  locale: {
    default: process.env.DEFAULT_LOCALE || 'fr',
    supported: (process.env.SUPPORTED_LOCALES || 'fr,en').split(','),
    timezone: process.env.TIMEZONE || 'Africa/Libreville',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
  },

  // Configuration de sécurité
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    jwtSecret: process.env.JWT_SECRET,
    rateLimiting: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
    cors: {
      allowedOrigins: [
        'http://localhost:3000',
        'https://administration.ga',
        'https://www.administration.ga',
      ],
    },
  },

  // Configuration des intégrations
  integrations: {
    docusign: {
      enabled: process.env.ENABLE_ELECTRONIC_SIGNATURE === 'true',
      baseUrl: process.env.DOCUSIGN_BASE_URL,
    },
    civilRegistry: {
      enabled: true,
      apiUrl: process.env.CIVIL_REGISTRY_API_URL,
    },
    commercialRegistry: {
      enabled: true,
      apiUrl: process.env.COMMERCIAL_REGISTRY_API_URL,
    },
  },

  // Configuration du monitoring
  monitoring: {
    sentry: {
      enabled: !!process.env.SENTRY_DSN,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    analytics: {
      googleAnalytics: {
        enabled: !!process.env.GOOGLE_ANALYTICS_ID,
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
      mixpanel: {
        enabled: !!process.env.MIXPANEL_TOKEN,
        token: process.env.MIXPANEL_TOKEN,
      },
    },
    healthCheck: {
      interval: 300000, // 5 minutes
      endpoints: ['/api/health', '/api/health/db', '/api/health/redis'],
    },
  },

  // Configuration des files d'attente
  queue: {
    redis: {
      url: process.env.QUEUE_REDIS_URL || process.env.REDIS_URL,
    },
    jobs: {
      concurrency: parseInt(process.env.JOB_CONCURRENCY || '5'),
      retryAttempts: 3,
      retryDelay: 5000,
    },
    scheduledJobs: {
      sendReminders: '0 9 * * *', // 9h tous les jours
      cleanupTemp: '0 2 * * *', // 2h du matin
      generateReports: '0 1 * * MON', // 1h lundi
      checkSLA: '*/30 * * * *', // toutes les 30 minutes
    },
  },

  // Configuration de maintenance
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'Le système est en maintenance',
    allowedIPs: ['127.0.0.1', '::1'],
  },

  // Configuration des fonctionnalités
  features: {
    smsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
    whatsappNotifications: process.env.ENABLE_WHATSAPP_NOTIFICATIONS === 'true',
    paymentGateway: process.env.ENABLE_PAYMENT_GATEWAY === 'true',
    documentOCR: process.env.ENABLE_DOCUMENT_OCR === 'true',
    electronicSignature: process.env.ENABLE_ELECTRONIC_SIGNATURE === 'true',
    multiOrganization: true,
    advancedAnalytics: true,
  },

  // Configuration de développement
  development: {
    debugLogging: process.env.ENABLE_DEBUG_LOGGING === 'true',
    apiDocumentation: process.env.ENABLE_API_DOCUMENTATION === 'true',
    mockData: process.env.NODE_ENV === 'development',
    hotReload: process.env.NODE_ENV === 'development',
  },

  // Configuration de sauvegarde
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
    destinations: ['local', 's3'],
  },
};

// Helper pour obtenir une configuration typée
export function getConfig<T extends keyof typeof appConfig>(
  section: T
): typeof appConfig[T] {
  return appConfig[section];
}

// Validation de la configuration au démarrage
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missing.join(', ')}`
    );
  }

  // Validation supplémentaire selon l'environnement
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SENTRY_DSN) {
      console.warn('SENTRY_DSN non configuré en production');
    }
    
    if (!process.env.REDIS_URL) {
      console.warn('REDIS_URL non configuré en production');
    }
  }
}

// Export des types pour TypeScript
export type AppConfig = typeof appConfig;
export type ConfigSection = keyof AppConfig; 