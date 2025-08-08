// /* @ts-nocheck */ // This will be removed after cleaning up types
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../server';
import { TRPCError } from '@trpc/server';

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  // password: z.string().min(8), // Password is handled by NextAuth
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  organizationCode: z.string().optional(), // This will be used to link to an organization
});

export const authRouter = createTRPCRouter({
  // Get all users (for super-admin page)
  getAllUsers: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session?.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.session.user.role)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Accès refusé - droits administrateur requis',
        });
      }

      const users = await ctx.prisma.user.findMany({
        include: {
          primaryOrganization: {
            select: {
              name: true,
              code: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        users,
      };
    }),

  // User registration
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { email: input.email },
            ...(input.phone ? [{ phone: input.phone }] : []),
          ],
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un utilisateur avec cet email ou téléphone existe déjà',
        });
      }

      let organizationId: string | undefined;
      if (input.organizationCode) {
        const organization = await ctx.prisma.organization.findUnique({
          where: { code: input.organizationCode },
        });

        if (!organization) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Code organisation invalide',
          });
        }
        organizationId = organization.id;
      }

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          firstName: input.firstName,
          lastName: input.lastName,
          primaryOrganizationId: organizationId,
        },
      });

      return {
        success: true,
        userId: user.id,
        message: 'Compte créé avec succès. Vous pouvez maintenant vous connecter.',
      };
    }),

  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        primaryOrganization: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Utilisateur non trouvé',
      });
    }

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      jobTitle: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const dataToUpdate: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        jobTitle?: string;
      } = {};

      if (input.firstName) dataToUpdate.firstName = input.firstName;
      if (input.lastName) dataToUpdate.lastName = input.lastName;
      if (input.phone) dataToUpdate.phone = input.phone;
      if (input.jobTitle) dataToUpdate.jobTitle = input.jobTitle;

      await ctx.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return { success: true };
    }),
});
