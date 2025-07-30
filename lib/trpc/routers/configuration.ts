import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/server';
import { SystemConfiguration } from '@/lib/types/configuration';
import { ConfigurationValidationService } from '@/lib/services/configuration-validation.service';
import { TRPCError } from '@trpc/server';

// Schéma de validation pour la configuration système
const SystemConfigurationSchema = z.object({
  general: z.object({
    siteName: z.string().min(3),
    siteDescription: z.string().min(10),
    maintenanceMode: z.boolean(),
    allowRegistration: z.boolean(),
    defaultLanguage: z.enum(['fr', 'en']),
    timezone: z.string().min(1)
  }),
  notifications: z.object({
    emailEnabled: z.boolean(),
    smsEnabled: z.boolean(),
    pushEnabled: z.boolean(),
    whatsappEnabled: z.boolean(),
    defaultEmailTemplate: z.string(),
    smtpHost: z.string(),
    smtpPort: z.string(),
    smtpUser: z.string(),
    smtpPassword: z.string(),
    smsProvider: z.enum(['Airtel', 'Moov']),
    smsApiKey: z.string()
  }),
  security: z.object({
    passwordMinLength: z.number().min(6).max(50),
    passwordRequireUppercase: z.boolean(),
    passwordRequireNumbers: z.boolean(),
    passwordRequireSymbols: z.boolean(),
    sessionTimeout: z.number().min(5).max(1440),
    maxLoginAttempts: z.number().min(3).max(20),
    lockoutDuration: z.number().min(5).max(120),
    twoFactorEnabled: z.boolean(),
    ipWhitelist: z.array(z.string()),
    securityHeaders: z.boolean()
  }),
  performance: z.object({
    cacheEnabled: z.boolean(),
    cacheDuration: z.number().min(60).max(86400),
    compressionEnabled: z.boolean(),
    cdnEnabled: z.boolean(),
    cdnUrl: z.string(),
    maxFileSize: z.number().min(1).max(100),
    allowedFileTypes: z.array(z.string()),
    databaseBackupSchedule: z.enum(['hourly', 'daily', 'weekly']),
    logRetentionDays: z.number().min(1).max(365)
  }),
  integrations: z.object({
    analyticsEnabled: z.boolean(),
    analyticsProvider: z.enum(['internal', 'google_analytics', 'matomo']),
    paymentGateway: z.enum(['airtel_money', 'moov_money', 'stripe']),
    documentSignature: z.enum(['docusign', 'adobe_sign', 'internal']),
    identityVerification: z.enum(['gabonese_id', 'biometric', 'manual']),
    mapProvider: z.enum(['openstreetmap', 'google_maps', 'mapbox']),
    videoConferencing: z.enum(['zoom', 'teams', 'internal'])
  }),
  workflow: z.object({
    autoAssignment: z.boolean(),
    escalationEnabled: z.boolean(),
    escalationThreshold: z.number().min(1).max(168),
    reminderSchedule: z.number().min(1).max(72),
    approvalWorkflow: z.boolean(),
    documentValidation: z.enum(['manual', 'automatic', 'hybrid']),
    qualityControl: z.boolean()
  })
});

export const configurationRouter = createTRPCRouter({
  // Récupérer la configuration actuelle
  get: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Vérifier que l'utilisateur est super admin
        if (ctx.session?.user?.role !== 'SUPER_ADMIN') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Accès refusé. Rôle super admin requis.'
          });
        }

        // TODO: Récupérer depuis la base de données
        // Pour l'instant, retourner la configuration par défaut
        const defaultConfig: SystemConfiguration = {
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
            smtpHost: 'smtp.admin.ga',
            smtpPort: '587',
            smtpUser: 'noreply@admin.ga',
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

        return defaultConfig;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération de la configuration'
        });
      }
    }),

  // Mettre à jour la configuration
  update: protectedProcedure
    .input(z.object({
      configuration: SystemConfigurationSchema,
      lastModified: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Vérifier que l'utilisateur est super admin
        if (ctx.session?.user?.role !== 'SUPER_ADMIN') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Accès refusé. Rôle super admin requis.'
          });
        }

        // Validation métier
        const validationErrors = ConfigurationValidationService.validateComplete(input.configuration as SystemConfiguration);
        const criticalErrors = ConfigurationValidationService.getCriticalErrors(validationErrors);

        if (criticalErrors.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Erreurs critiques dans la configuration',
            cause: criticalErrors
          });
        }

        // TODO: Sauvegarder en base de données
        // TODO: Appliquer les modifications au système
        // TODO: Invalider les caches si nécessaire
        // TODO: Redémarrer les services si nécessaire

        console.log('Configuration mise à jour:', input.configuration);
        console.log('Utilisateur:', ctx.session?.user?.email);
        console.log('Date:', input.lastModified);

        return {
          success: true,
          message: 'Configuration mise à jour avec succès'
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour de la configuration'
        });
      }
    }),

  // Tester la configuration
  test: protectedProcedure
    .input(z.object({
      configuration: SystemConfigurationSchema
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Vérifier que l'utilisateur est super admin
        if (ctx.user.role !== 'SUPER_ADMIN') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Accès refusé. Rôle super admin requis.'
          });
        }

        const results = {
          emailTest: false,
          smsTest: false,
          databaseTest: true, // Toujours OK pour le moment
          errors: [] as string[]
        };

        // Test de configuration email
        if (input.configuration.notifications.emailEnabled) {
          try {
            // TODO: Tester la connexion SMTP
            // Pour l'instant, simuler un test réussi
            results.emailTest = true;
          } catch (error) {
            results.errors.push('Impossible de se connecter au serveur SMTP');
          }
        }

        // Test de configuration SMS
        if (input.configuration.notifications.smsEnabled) {
          try {
            // TODO: Tester l'API SMS
            // Pour l'instant, simuler un test réussi
            results.smsTest = true;
          } catch (error) {
            results.errors.push('Impossible de se connecter au fournisseur SMS');
          }
        }

        return results;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors du test de la configuration'
        });
      }
    }),

  // Créer un backup de la configuration
  backup: protectedProcedure
    .input(z.object({
      configuration: SystemConfigurationSchema,
      backupDate: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Vérifier que l'utilisateur est super admin
        if (ctx.user.role !== 'SUPER_ADMIN') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Accès refusé. Rôle super admin requis.'
          });
        }

        // TODO: Sauvegarder le backup en base de données
        console.log('Backup créé:', {
          date: input.backupDate,
          user: ctx.user.email,
          config: input.configuration
        });

        return {
          success: true,
          message: 'Backup créé avec succès'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la création du backup'
        });
      }
    }),

  // Récupérer l'historique des configurations
  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Vérifier que l'utilisateur est super admin
        if (ctx.user.role !== 'SUPER_ADMIN') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Accès refusé. Rôle super admin requis.'
          });
        }

        // TODO: Récupérer l'historique depuis la base de données
        return {
          history: [],
          total: 0
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération de l\'historique'
        });
      }
    })
});
