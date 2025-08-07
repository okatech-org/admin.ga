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
      // Note: La base de données est actuellement en mode lecture seule pour maintenance.
      // Les requêtes de lecture sont connectées à Prisma.
      // Les mutations (create, update, delete) sont désactivées.

      const where = {
        AND: [
          input.search ? {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { code: { contains: input.search, mode: 'insensitive' } },
            ],
          } : {},
          input.type ? { type: input.type } : {},
          input.isActive !== undefined ? { isActive: input.isActive } : {},
        ],
      };

      const [organizations, total] = await Promise.all([
        ctx.prisma.organization.findMany({
          where,
          take: input.limit,
          skip: input.offset,
          orderBy: { name: 'asc' },
        }),
        ctx.prisma.organization.count({ where }),
      ]);

      return {
        organizations,
        total,
        hasMore: input.offset + organizations.length < total,
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
      const where = {
        AND: [
          {
            OR: [
              { name: { contains: input.query, mode: 'insensitive' } },
              { code: { contains: input.query, mode: 'insensitive' } },
            ],
          },
          input.type ? { type: input.type } : {},
          input.isActive !== undefined ? { isActive: input.isActive } : {},
        ],
      };

      const organizations = await ctx.prisma.organization.findMany({
        where,
        take: input.limit,
        orderBy: { name: 'asc' },
        select: { id: true, name: true, code: true, type: true },
      });

      const total = await ctx.prisma.organization.count({ where });

      return {
        organizations,
        total,
      };
    }),

  // Get organization details
  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.id },
        include: {
          users: {
            select: { id: true, name: true, email: true, role: true },
            take: 10,
            orderBy: { name: 'asc' },
          },
          parent: { select: { id: true, name: true, code: true } },
          children: { select: { id: true, name: true, code: true }, take: 10 },
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Organisme avec ID '${input.id}' non trouvé.`,
        });
      }

      return organization;
    }),

  // Create organization (admin only)
  create: adminProcedure
    .input(organizationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Activer la création après la phase de maintenance
      // return ctx.prisma.organization.create({ data: input });
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Création d\'organismes désactivée - maintenance en cours.',
      });
    }),

  // Update organization (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: organizationSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Activer la mise à jour après la phase de maintenance
      // return ctx.prisma.organization.update({
      //   where: { id: input.id },
      //   data: input.data,
      // });
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Modification d\'organismes désactivée - maintenance en cours.',
      });
    }),

  // Delete organization (admin only)
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Activer la suppression après la phase de maintenance
      // return ctx.prisma.organization.delete({ where: { id: input.id } });
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Suppression d\'organismes désactivée - maintenance en cours.',
      });
    }),

  // Get organization statistics
  getStats: adminProcedure
    .query(async ({ ctx }) => {
      const [total, byType, byStatus, recent] = await Promise.all([
        ctx.prisma.organization.count(),
        ctx.prisma.organization.groupBy({
          by: ['type'],
          _count: { _all: true },
        }),
        ctx.prisma.organization.groupBy({
          by: ['isActive'],
          _count: { _all: true },
        }),
        ctx.prisma.organization.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, createdAt: true },
        }),
      ]);

      const byTypeFormatted = byType.reduce((acc, group) => {
        acc[group.type] = group._count._all;
        return acc;
      }, {} as Record<string, number>);

      const byStatusFormatted = byStatus.reduce((acc, group) => {
        const key = group.isActive ? 'active' : 'inactive';
        acc[key] = group._count._all;
        return acc;
      }, { active: 0, inactive: 0 });

      return {
        total,
        byType: byTypeFormatted,
        byStatus: byStatusFormatted,
        recent,
      };
    }),
});
