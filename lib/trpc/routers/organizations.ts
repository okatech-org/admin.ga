/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../server';
import { TRPCError } from '@trpc/server';

const organizationSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  type: z.enum(['MINISTERE', 'PREFECTURE', 'MAIRIE', 'ORGANISME_PUBLIC', 'ORGANISME_PARAPUBLIC']),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
});

export const organizationsRouter = createTRPCRouter({
  // List organizations (with search and filtering)
  list: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      type: z.enum(['MINISTERE', 'PREFECTURE', 'MAIRIE', 'ORGANISME_PUBLIC', 'ORGANISME_PARAPUBLIC']).optional(),
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      console.log('🧹 Base de données vide - retour de 0 organismes');

      return {
        organizations: [],
        total: 0,
        hasMore: false,
      };
    }),

  // Search organizations with advanced filtering
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      type: z.enum(['MINISTERE', 'PREFECTURE', 'MAIRIE', 'ORGANISME_PUBLIC', 'ORGANISME_PARAPUBLIC']).optional(),
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ ctx, input }) => {
      console.log('🧹 Base de données vide - retour de 0 résultats de recherche');

      return {
        organizations: [],
        total: 0,
      };
    }),

  // Get organization details
  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Aucun organisme trouvé - base de données vide',
      });
    }),

  // Create organization (admin only)
  create: adminProcedure
    .input(organizationSchema)
    .mutation(async ({ ctx, input }) => {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Création d\'organismes désactivée - base de données en mode nettoyage',
      });
    }),

  // Update organization (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: organizationSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Aucun organisme à modifier - base de données vide',
      });
    }),

  // Delete organization (admin only)
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Aucun organisme à supprimer - base de données déjà vide',
      });
    }),

  // Get organization statistics
  getStats: adminProcedure
    .query(async ({ ctx }) => {
      console.log('🧹 Base de données vide - retour de statistiques vides');

      return {
        total: 0,
        byType: {
          MINISTERE: 0,
          PREFECTURE: 0,
          MAIRIE: 0,
          ORGANISME_PUBLIC: 0,
          ORGANISME_PARAPUBLIC: 0,
        },
        byStatus: {
          active: 0,
          inactive: 0,
        },
        recent: [],
      };
    }),
});
