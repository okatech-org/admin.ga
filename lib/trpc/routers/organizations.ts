/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../server';
import { TRPCError } from '@trpc/server';
import { OrganizationType } from '@prisma/client';

// Schémas de validation
const organizationCreateSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.nativeEnum(OrganizationType),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20, 'Le code ne peut dépasser 20 caractères'),
  description: z.string().optional(),
  parentId: z.string().optional(),

  // Informations de contact
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),

  // Configuration des heures de travail
  workingHours: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }).optional(),

  // Services proposés
  services: z.array(z.string()).optional(),
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
  workingHours: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }).optional(),
  services: z.array(z.string()).optional(),
});

export const organizationsRouter = createTRPCRouter({
  // Lister toutes les organisations
  list: protectedProcedure
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

      const [organizations, total] = await Promise.all([
        ctx.prisma.organization.findMany({
          where,
          include: {
            parent: true,
            children: true,
            userMemberships: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true, email: true, role: true }
                }
              }
            },
            _count: {
              select: {
                userMemberships: true,
                requests: true,
                appointments: true,
              }
            }
          },
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
    }),

  // Obtenir une organisation par ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.id },
        include: {
          parent: true,
          children: true,
          userMemberships: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true, role: true }
              }
            }
          },
          requests: {
            take: 10,
            orderBy: { submittedAt: 'desc' },
            include: {
              submittedBy: {
                select: { firstName: true, lastName: true, email: true }
              }
            }
          },
          _count: {
            select: {
              userMemberships: true,
              requests: true,
              appointments: true,
            }
          }
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organisation non trouvée',
        });
      }

      return organization;
    }),

  // Créer une nouvelle organisation
  create: adminProcedure
    .input(organizationCreateSchema)
    .mutation(async ({ ctx, input }) => {
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

      // Vérifier l'organisation parent si spécifiée
      if (input.parentId) {
        const parentOrg = await ctx.prisma.organization.findUnique({
          where: { id: input.parentId },
        });

        if (!parentOrg) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organisation parent non trouvée',
          });
        }
      }

      // Créer l'organisation
      const organization = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          type: input.type,
          code: input.code,
          description: input.description,
          parentId: input.parentId,
          address: input.address,
          city: input.city,
          phone: input.phone,
          email: input.email || null,
          website: input.website || null,
          workingHours: input.workingHours || {},
          settings: {
            services: input.services || [],
          },
        },
        include: {
          parent: true,
          children: true,
        },
      });

      // Créer un log d'audit
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'ORGANIZATION_CREATED',
          resource: 'organization',
          resourceId: organization.id,
          details: {
            name: organization.name,
            type: organization.type,
            code: organization.code,
          },
        },
      });

      return organization;
    }),

  // Mettre à jour une organisation
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: organizationUpdateSchema,
    }))
    .mutation(async ({ ctx, input }) => {
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
          workingHours: input.data.workingHours || existingOrg.workingHours,
          settings: input.data.services ? {
            ...(existingOrg.settings as any),
            services: input.data.services,
          } : existingOrg.settings,
        },
        include: {
          parent: true,
          children: true,
        },
      });

      // Créer un log d'audit
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'ORGANIZATION_UPDATED',
          resource: 'organization',
          resourceId: organization.id,
          details: {
            name: organization.name,
            changes: input.data,
          },
        },
      });

      return organization;
    }),

  // Supprimer une organisation
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.id },
        include: {
          children: true,
          userMemberships: true,
          requests: true,
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organisation non trouvée',
        });
      }

      // Vérifier s'il y a des dépendances
      if (organization.children.length > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Impossible de supprimer une organisation ayant des sous-organisations',
        });
      }

      if (organization.userMemberships.length > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Impossible de supprimer une organisation ayant des membres',
        });
      }

      if (organization.requests.length > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Impossible de supprimer une organisation ayant des demandes',
        });
      }

      await ctx.prisma.organization.delete({
        where: { id: input.id },
      });

      // Créer un log d'audit
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'ORGANIZATION_DELETED',
          resource: 'organization',
          resourceId: input.id,
          details: {
            name: organization.name,
            code: organization.code,
          },
        },
      });

      return { success: true };
    }),

  // Obtenir les statistiques d'une organisation
  getStats: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              userMemberships: true,
              requests: true,
              appointments: true,
            }
          }
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organisation non trouvée',
        });
      }

      // Statistiques détaillées
      const [
        requestsByStatus,
        recentRequests,
        usersByRole,
        appointmentsByStatus,
      ] = await Promise.all([
        ctx.prisma.serviceRequest.groupBy({
          by: ['status'],
          where: { organizationId: input.id },
          _count: true,
        }),
        ctx.prisma.serviceRequest.count({
          where: {
            organizationId: input.id,
            submittedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
            },
          },
        }),
        ctx.prisma.userOrganization.groupBy({
          by: ['role'],
          where: { organizationId: input.id, isActive: true },
          _count: true,
        }),
        ctx.prisma.appointment.groupBy({
          by: ['status'],
          where: { organizationId: input.id },
          _count: true,
        }),
      ]);

      return {
        organization,
        stats: {
          totalUsers: organization._count.userMemberships,
          totalRequests: organization._count.requests,
          totalAppointments: organization._count.appointments,
          recentRequests,
          requestsByStatus,
          usersByRole,
          appointmentsByStatus,
        },
      };
    }),

  // Obtenir les organisations disponibles pour hiérarchie (pour select parent)
  getForHierarchy: protectedProcedure
    .query(async ({ ctx }) => {
      const organizations = await ctx.prisma.organization.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          parentId: true,
        },
        orderBy: { name: 'asc' },
      });

      return organizations;
    }),
});
