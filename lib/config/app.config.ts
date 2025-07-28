/* @ts-nocheck */
import { z } from 'zod';

// Schema de validation des variables d'environnement
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // Application
  APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@admin.ga'),
  
  // SMS
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  // WhatsApp
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  
  // Payment Providers
  AIRTEL_MONEY_API_URL: z.string().url().optional(),
  AIRTEL_MONEY_CLIENT_ID: z.string().optional(),
  AIRTEL_MONEY_CLIENT_SECRET: z.string().optional(),
  
  MOOV_MONEY_API_URL: z.string().url().optional(),
  MOOV_MONEY_API_KEY: z.string().optional(),
  MOOV_MONEY_SECRET_KEY: z.string().optional(),
  
  // Storage
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  
  // Redis
  REDIS_URL: z.string().optional(),
  
  // Feature Flags
  ENABLE_SMS_NOTIFICATIONS: z.string().transform(v => v === 'true').default('false'),
  ENABLE_WHATSAPP_NOTIFICATIONS: z.string().transform(v => v === 'true').default('false'),
  ENABLE_PAYMENT_GATEWAY: z.string().transform(v => v === 'true').default('false'),
  ENABLE_OCR_PROCESSING: z.string().transform(v => v === 'true').default('false'),
  ENABLE_ESIGNATURE: z.string().transform(v => v === 'true').default('false'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Security
  ENCRYPTION_KEY: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
});

// Valider et parser les variables d'environnement
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

// Configuration exportée
export const config = parseEnv();

// Configuration de l'application
export const appConfig = {
  name: 'Admin.ga',
  description: 'Plateforme numérique administrative du Gabon',
  version: '1.0.0',
  
  // URLs
  baseUrl: config.APP_URL,
  apiUrl: `${config.APP_URL}/api`,
  
  // Environnement
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',
  
  // Feature flags
  features: {
    smsNotifications: config.ENABLE_SMS_NOTIFICATIONS,
    whatsappNotifications: config.ENABLE_WHATSAPP_NOTIFICATIONS,
    paymentGateway: config.ENABLE_PAYMENT_GATEWAY,
    ocrProcessing: config.ENABLE_OCR_PROCESSING,
    eSignature: config.ENABLE_ESIGNATURE,
  },
  
  // Limites
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerUpload: 5,
    maxRequestsPerDay: 100,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // Timeouts
  timeouts: {
    api: 30000, // 30 secondes
    upload: 5 * 60 * 1000, // 5 minutes
    payment: 10 * 60 * 1000, // 10 minutes
  },
  
  // Services externes
  services: {
    email: {
      enabled: !!config.RESEND_API_KEY,
      from: config.EMAIL_FROM,
    },
    sms: {
      enabled: !!config.TWILIO_ACCOUNT_SID && config.ENABLE_SMS_NOTIFICATIONS,
    },
    whatsapp: {
      enabled: !!config.WHATSAPP_API_TOKEN && config.ENABLE_WHATSAPP_NOTIFICATIONS,
    },
    payment: {
      enabled: config.ENABLE_PAYMENT_GATEWAY,
      providers: {
        airtelMoney: !!config.AIRTEL_MONEY_CLIENT_ID,
        moovMoney: !!config.MOOV_MONEY_API_KEY,
      },
    },
    storage: {
      enabled: !!config.S3_ACCESS_KEY_ID,
      bucket: config.S3_BUCKET_NAME || 'admin-ga-documents',
    },
  },
  
  // Sécurité
  security: {
    corsOrigin: config.CORS_ORIGIN,
    rateLimiting: {
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    otpPolicy: {
      length: 6,
      expiresIn: 5 * 60, // 5 minutes
      maxAttempts: 3,
    },
  },
  
  // Logging
  logging: {
    level: config.LOG_LEVEL,
    format: config.LOG_FORMAT,
  },
};

// Types d'export
export type AppConfig = typeof appConfig;
export type Config = typeof config;

// Helpers pour accéder à la configuration
export const getConfig = () => config;
export const getAppConfig = () => appConfig;

// Validation des configurations critiques au démarrage
export const validateConfig = () => {
  const criticalConfigs = [
    { name: 'DATABASE_URL', value: config.DATABASE_URL },
    { name: 'NEXTAUTH_SECRET', value: config.NEXTAUTH_SECRET },
  ];
  
  const missing = criticalConfigs.filter(c => !c.value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing critical environment variables: ${missing.map(c => c.name).join(', ')}`
    );
  }
  
  console.log('✅ Configuration validated successfully');
}; 