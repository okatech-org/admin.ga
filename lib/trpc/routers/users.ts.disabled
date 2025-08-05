/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure, managerProcedure } from '../server';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

const userCreateSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
  organizationId: z.string(),
  department: z.string().optional(),
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
  department: z.string().optional(),
});

const permissionSchema = z.object({
  userId: z.string(),
  permissionId: z.string(),
  expiresAt: z.date().optional(),
});

export const usersRouter = createTRPCRouter({
  // List users (with filters)
  list: managerProcedure
    .input(z.object({
      organizationId: z.string().optional(),
      role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']).optional(),
      isActive: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;

      const where: any = {};
      
      if (organizationId) {
        where.organizationId = organizationId;
      }
      
      if (input.role) {
        where.role = input.role;
      }
      
      if (input.isActive !== undefined) {
        where.isActive = input.isActive;
      }
      
      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: 'insensitive' } },
          { lastName: { contains: input.search, mode: 'insensitive' } },
          { email: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true,
            lastLoginAt: true,
            createdAt: true,
            profile: {
              select: {
                avatarUrl: true,
                profession: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.user.count({ where }),
      ]);

      return {
        users,
        total,
        hasMore: total > input.offset + input.limit,
      };
    }),

  // Get user details
  get: managerProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          profile: true,
          permissions: {
            include: {
              permission: true,
            },
          },
          submittedRequests: {
            select: {
              id: true,
              status: true,
              type: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          citizenAppointments: {
            select: {
              id: true,
              status: true,
              date: true,
            },
            orderBy: { date: 'desc' },
            take: 5,
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      // Check if manager can access this user
      if (ctx.session.user.role === 'MANAGER' && 
          (user as any).primaryOrganizationId !== ctx.session.user.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Accès non autorisé à cet utilisateur',
        });
      }

      return user;
    }),

  // Create user
  create: adminProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          primaryOrganizationId: input.organizationId,
          isVerified: true, // Admin-created users are pre-verified
        } as any,
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'USER_CREATED',
          resource: 'user',
          resourceId: user.id,
          details: {
            role: input.role,
            organization: input.organizationId,
          },
        },
      });

      return user;
    }),

  // Update user
  update: adminProcedure
    .input(z.object({
      userId: z.string(),
      data: userUpdateSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const oldUser = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!oldUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: input.data,
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'USER_UPDATED',
          resource: 'user',
          resourceId: input.userId,
          oldValues: oldUser,
          newValues: updatedUser,
        },
      });

      return updatedUser;
    }),

  // Update user role
  updateRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      // Prevent changing super admin role
      if (user.role === 'SUPER_ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Impossible de modifier le rôle d\'un super administrateur',
        });
      }

      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'ROLE_CHANGED',
          resource: 'user',
          resourceId: input.userId,
          details: {
            oldRole: user.role,
            newRole: input.role,
          },
        },
      });

      return { success: true };
    }),

  // Grant permission
  grantPermission: adminProcedure
    .input(permissionSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if permission exists
      const permission = await ctx.prisma.permission.findUnique({
        where: { id: input.permissionId },
      });

      if (!permission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Permission non trouvée',
        });
      }

      // Grant permission
      await ctx.prisma.userPermission.create({
        data: {
          userId: input.userId,
          permissionId: input.permissionId,
          grantedBy: ctx.session.user.id,
          expiresAt: input.expiresAt,
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'PERMISSION_GRANTED',
          resource: 'user_permission',
          resourceId: input.userId,
          details: {
            permission: permission.name,
            expiresAt: input.expiresAt,
          },
        },
      });

      return { success: true };
    }),

  // Revoke permission
  revokePermission: adminProcedure
    .input(z.object({
      userId: z.string(),
      permissionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userPermission.delete({
        where: {
          userId_permissionId: {
            userId: input.userId,
            permissionId: input.permissionId,
          },
        },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'PERMISSION_REVOKED',
          resource: 'user_permission',
          resourceId: input.userId,
          details: {
            permissionId: input.permissionId,
          },
        },
      });

      return { success: true };
    }),

  // List permissions
  listPermissions: adminProcedure
    .query(async ({ ctx }) => {
      const permissions = await ctx.prisma.permission.findMany({
        orderBy: { category: 'asc' },
      });

      // Group by category
      const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
      }, {} as Record<string, typeof permissions>);

      return groupedPermissions;
    }),

  // Reset password
  resetPassword: adminProcedure
    .input(z.object({
      userId: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { password: hashedPassword },
      });

      // Create audit log
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'PASSWORD_RESET',
          resource: 'user',
          resourceId: input.userId,
        },
      });

      return { success: true };
    }),

  // Get user activity
  getActivity: managerProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const activities = await ctx.prisma.auditLog.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
      });

      return activities;
    }),
}); 