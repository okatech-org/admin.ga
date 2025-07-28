/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, agentProcedure } from '../server';
import { TRPCError } from '@trpc/server';

export const notificationsRouter = createTRPCRouter({
  // Get user notifications
  getMyNotifications: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
      unreadOnly: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        receiverId: ctx.session.user.id,
      };

      if (input.unreadOnly) {
        where.isRead = false;
      }

      const notifications = await ctx.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      const totalCount = await ctx.prisma.notification.count({ where });

      return {
        notifications,
        totalCount,
        hasMore: totalCount > input.offset + input.limit,
      };
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({
      notificationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.findFirst({
        where: {
          id: input.notificationId,
          receiverId: ctx.session.user.id,
        },
      });

      if (!notification) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification non trouvée',
        });
      }

      await ctx.prisma.notification.update({
        where: { id: input.notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.notification.updateMany({
        where: {
          receiverId: ctx.session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return { success: true };
    }),

  // Get unread count
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await ctx.prisma.notification.count({
        where: {
          receiverId: ctx.session.user.id,
          isRead: false,
        },
      });

      return { count };
    }),

  // Send notification (admin/agent only)
  sendNotification: agentProcedure
    .input(z.object({
      receiverId: z.string(),
      type: z.enum([
        'DEMANDE_RECUE',
        'DEMANDE_ASSIGNEE',
        'DEMANDE_VALIDEE',
        'DOCUMENT_MANQUANT',
        'DOCUMENT_PRET',
        'RDV_CONFIRME',
        'RAPPEL_RDV',
        'STATUT_CHANGE',
        'SYSTEM_ALERT',
        'PAYMENT_RECEIVED',
        'SIGNATURE_REQUESTED'
      ]),
      channel: z.enum(['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP', 'PUSH']),
      title: z.string(),
      message: z.string(),
      data: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.create({
        data: {
          type: input.type,
          channel: input.channel,
          title: input.title,
          message: input.message,
          data: input.data || {},
          senderId: ctx.session.user.id,
          receiverId: input.receiverId,
        },
      });

      // TODO: Implement actual sending logic based on channel
      // For now, just mark as sent for IN_APP notifications
      if (input.channel === 'IN_APP') {
        await ctx.prisma.notification.update({
          where: { id: notification.id },
          data: {
            sentAt: new Date(),
            deliveredAt: new Date(),
          },
        });
      }

      return notification;
    }),

  // Update notification preferences
  updatePreferences: protectedProcedure
    .input(z.object({
      preferences: z.record(z.boolean()),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userNotificationPreference.upsert({
        where: { userId: ctx.session.user.id },
        create: {
          userId: ctx.session.user.id,
          preferences: input.preferences,
        },
        update: {
          preferences: input.preferences,
        },
      });

      return { success: true };
    }),

  // Get notification preferences
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const preferences = await ctx.prisma.userNotificationPreference.findUnique({
        where: { userId: ctx.session.user.id },
      });

      return preferences?.preferences || {};
    }),
}); 