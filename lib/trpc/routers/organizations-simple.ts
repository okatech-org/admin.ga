/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from '../server';
import { TRPCError } from '@trpc/server';

export const organizationsRouter = createTRPCRouter({
  // Lister toutes les organisations - version simplifiée
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      type: z.string().optional(),
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

  // Obtenir une organisation par ID - version simplifiée
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
    }),
});
