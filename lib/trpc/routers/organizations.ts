/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from '../server';
import { TRPCError } from '@trpc/server';

// Types pour les organisations
enum OrganizationType {
  MINISTRY = 'MINISTRY',
  PREFECTURE = 'PREFECTURE',
  MUNICIPALITY = 'MUNICIPALITY',
  AGENCY = 'AGENCY',
  DEPARTMENT = 'DEPARTMENT',
  PUBLIC_INSTITUTION = 'PUBLIC_INSTITUTION',
  SOCIAL_ORGANIZATION = 'SOCIAL_ORGANIZATION'
}

// Schémas de validation
const organizationCreateSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.nativeEnum(OrganizationType),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20, 'Le code ne peut dépasser 20 caractères'),
  description: z.string().optional(),

  // Informations de contact
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

const organizationUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.nativeEnum(OrganizationType).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

export const organizationsRouter = createTRPCRouter({
  // Obtenir toutes les organisations (alias pour list avec paramètres par défaut)
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(1000).default(1000),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      console.log('🔍 Debug organizations.getAll - ctx:', !!ctx, 'prisma:', !!ctx?.prisma, 'input:', input);

      if (!ctx?.prisma) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Prisma context not available',
        });
      }

      try {
        const [organizations, total] = await Promise.all([
          ctx.prisma.organization.findMany({
            skip: input.offset,
            take: input.limit,
            orderBy: { name: 'asc' },
          }),
          ctx.prisma.organization.count(),
        ]);

        return {
          organizations,
          total,
          hasMore: input.offset + organizations.length < total,
        };
      } catch (error) {
        console.error('Erreur lors de la récupération des organisations:', error);
        // Retourner des données de fallback si la table n'existe pas
        return {
          organizations: [],
          total: 0,
          hasMore: false,
        };
      }
    }),

  // Lister toutes les organisations
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      type: z.nativeEnum(OrganizationType).optional(),
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: 'insensitive' } },
          { code: { contains: input.search, mode: 'insensitive' } },
          { description: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      if (input.type) {
        where.type = input.type;
      }

      if (input.isActive !== undefined) {
        where.isActive = input.isActive;
      }

      try {
        const [organizations, total] = await Promise.all([
          ctx.prisma.organization.findMany({
            where,
            skip: input.offset,
            take: input.limit,
            orderBy: { name: 'asc' },
          }),
          ctx.prisma.organization.count({ where }),
        ]);

        return {
          organizations,
          total,
          hasMore: input.offset + input.limit < total,
        };
      } catch (error) {
        console.error('Erreur lors de la récupération des organisations:', error);
        return {
          organizations: [],
          total: 0,
          hasMore: false,
        };
      }
    }),

  // Obtenir une organisation par ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const organization = await ctx.prisma.organization.findUnique({
          where: { id: input.id },
        });

        if (!organization) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organisation non trouvée',
          });
        }

        return organization;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'organisation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération de l\'organisation',
        });
      }
    }),

  // Créer une nouvelle organisation
  create: adminProcedure
    .input(organizationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Vérifier si le code existe déjà
        const existingOrg = await ctx.prisma.organization.findUnique({
          where: { code: input.code },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Une organisation avec ce code existe déjà',
          });
        }

        // Créer l'organisation
        const organization = await ctx.prisma.organization.create({
          data: {
            name: input.name,
            type: input.type,
            code: input.code,
            description: input.description,
            address: input.address,
            city: input.city,
            phone: input.phone,
            email: input.email || null,
            website: input.website || null,
          },
        });

        return organization;
      } catch (error) {
        console.error('Erreur lors de la création de l\'organisation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la création de l\'organisation',
        });
      }
    }),

  // Mettre à jour une organisation
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: organizationUpdateSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingOrg = await ctx.prisma.organization.findUnique({
          where: { id: input.id },
        });

        if (!existingOrg) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organisation non trouvée',
          });
        }

        const organization = await ctx.prisma.organization.update({
          where: { id: input.id },
          data: {
            ...input.data,
            email: input.data.email || null,
            website: input.data.website || null,
          },
        });

        return organization;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'organisation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour de l\'organisation',
        });
      }
    }),

  // Supprimer une organisation
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const organization = await ctx.prisma.organization.findUnique({
          where: { id: input.id },
        });

        if (!organization) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organisation non trouvée',
          });
        }

        await ctx.prisma.organization.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'organisation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la suppression de l\'organisation',
        });
      }
    }),

  // Obtenir les organisations disponibles pour hiérarchie (pour select parent)
  getForHierarchy: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const organizations = await ctx.prisma.organization.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
          },
          orderBy: { name: 'asc' },
        });

        return organizations;
      } catch (error) {
        console.error('Erreur lors de la récupération des organisations pour hiérarchie:', error);
        return [];
      }
    }),
});