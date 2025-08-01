/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../server';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  organizationCode: z.string().optional(),
});

const otpSchema = z.object({
  identifier: z.string(), // email or phone
  type: z.enum(['EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'LOGIN', 'PASSWORD_RESET']),
  channel: z.enum(['EMAIL', 'SMS']),
});

const verifyOtpSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  type: z.string(),
});

export const authRouter = createTRPCRouter({
  // User registration
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
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

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Find organization if code provided
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

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });

      // Create organization membership if organization provided
      if (organizationId) {
        await (ctx.prisma as any).userOrganization.create({
          data: {
            userId: user.id,
            organizationId,
            role: 'USER',
          },
        });
        
        // Update primary organization
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { primaryOrganizationId: organizationId } as any,
        });
      }

      // Generate OTP token for verification
      const token = Math.random().toString().slice(2, 8);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await (ctx.prisma as any).oTPToken.create({
        data: {
          userId: user.id,
          token,
          type: 'EMAIL_VERIFICATION',
          channel: 'EMAIL',
          expiresAt,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          resource: 'user',
          resourceId: user.id,
          details: {
            email: input.email,
            organizationCode: input.organizationCode,
          },
        },
      });

      return {
        success: true,
        userId: user.id,
        message: 'Compte créé avec succès. Vérifiez votre email.',
      };
    }),

  // Send OTP
  sendOtp: publicProcedure
    .input(otpSchema)
    .mutation(async ({ ctx, input }) => {
      // Find user
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { email: input.identifier },
            { phone: input.identifier },
          ],
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      // Generate OTP
      const token = Math.random().toString().slice(2, 8);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Save OTP
      await (ctx.prisma as any).oTPToken.create({
        data: {
          userId: user.id,
          token,
          type: input.type,
          channel: input.channel,
          expiresAt,
        },
      });

      return { success: true, message: 'Code OTP envoyé' };
    }),

  // Verify OTP
  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ ctx, input }) => {
      const otpToken = await (ctx.prisma as any).oTPToken.findFirst({
        where: {
          token: input.token,
          type: 'PASSWORD_RESET',
          expiresAt: { gte: new Date() },
          usedAt: null,
        },
      });

      if (!otpToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Code OTP invalide ou expiré',
        });
      }

      // Check attempts
      if (otpToken.attempts >= otpToken.maxAttempts) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Trop de tentatives. Demandez un nouveau code.',
        });
      }

      // Verify token (simple string comparison for now)
      if (otpToken.token !== input.token) {
        // Increment attempts
        await (ctx.prisma as any).oTPToken.update({
          where: { id: otpToken.id },
          data: { attempts: { increment: 1 } },
        });

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Code OTP incorrect',
        });
      }

      // Mark as used
      await (ctx.prisma as any).oTPToken.update({
        where: { id: otpToken.id },
        data: { usedAt: new Date() },
      });

      // Update user verification status
      const updateData: any = {};
      if (input.type === 'EMAIL_VERIFICATION') {
        updateData.emailVerified = new Date();
        updateData.isVerified = true;
      }

      if (Object.keys(updateData).length > 0) {
        await ctx.prisma.user.update({
          where: { id: otpToken.userId },
          data: updateData,
        });
      }

      return {
        success: true,
        message: 'Vérification réussie',
        userId: otpToken.userId,
      };
    }),

  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        profile: true,
        primaryOrganization: true,
        permissions: {
          include: {
            permission: true,
          },
        },
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
      profile: z.object({
        dateOfBirth: z.date().optional(),
        gender: z.enum(['MASCULIN', 'FEMININ', 'AUTRE']).optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        province: z.enum(['ESTUAIRE', 'HAUT_OGOOUE', 'MOYEN_OGOOUE', 'NGOUNIE', 'NYANGA', 'OGOOUE_IVINDO', 'OGOOUE_LOLO', 'OGOOUE_MARITIME', 'WOLEU_NTEM']).optional(),
        profession: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Update user basic info
      const userUpdate: any = {};
      if (input.firstName) userUpdate.firstName = input.firstName;
      if (input.lastName) userUpdate.lastName = input.lastName;
      if (input.phone) userUpdate.phone = input.phone;

      if (Object.keys(userUpdate).length > 0) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: userUpdate,
        });
      }

      // Update profile
      if (input.profile) {
        await ctx.prisma.profile.upsert({
          where: { userId },
          create: {
            userId,
            ...input.profile,
          },
          update: input.profile,
        });
      }

      return { success: true };
    }),

  // Change password
  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mot de passe actuel incorrect',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      // Update password
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_CHANGED',
          resource: 'user',
          resourceId: user.id,
        },
      });

      return { success: true };
    }),
}); 