/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, agentProcedure, protectedProcedure } from '../server';
import { TRPCError } from '@trpc/server';

export const requestsRouter = createTRPCRouter({
  // Get agent's assigned requests
  getAgentRequests: agentProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const where = {
        organizationId: user.organizationId,
        ...(input.status && { status: input.status as any }),
      };

      const requests = await ctx.prisma.serviceRequest.findMany({
        where,
        include: {
          submittedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          documents: {
            select: {
              id: true,
              name: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' },
        ],
        take: input.limit,
        skip: input.offset,
      });

      return requests;
    }),

  // Assign request to agent
  assignRequest: agentProcedure
    .input(z.object({
      requestId: z.string(),
      agentId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const agentId = input.agentId || user.id;

      const request = await ctx.prisma.serviceRequest.update({
        where: { id: input.requestId },
        data: {
          assignedToId: agentId,
          status: 'ASSIGNED',
          assignedAt: new Date(),
        },
      });

      // Add timeline entry
      await ctx.prisma.requestTimeline.create({
        data: {
          requestId: input.requestId,
          actorId: user.id,
          action: 'ASSIGNED',
          details: {
            assignedTo: agentId,
          },
        },
      });

      return request;
    }),

  // Update request status
  updateRequestStatus: agentProcedure
    .input(z.object({
      requestId: z.string(),
      status: z.enum(['IN_PROGRESS', 'VALIDATED', 'READY', 'COMPLETED', 'REJECTED']),
      notes: z.string().optional(),
      rejectionReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const updateData: any = {
        status: input.status,
        processedById: user.id,
      };

      // Set timestamp based on status
      switch (input.status) {
        case 'IN_PROGRESS':
          updateData.processingStarted = new Date();
          break;
        case 'VALIDATED':
          updateData.validatedAt = new Date();
          break;
        case 'READY':
          updateData.readyAt = new Date();
          break;
        case 'COMPLETED':
          updateData.completedAt = new Date();
          break;
      }

      if (input.notes) {
        updateData.notes = input.notes;
      }

      if (input.rejectionReason) {
        updateData.rejectionReason = input.rejectionReason;
      }

      const request = await ctx.prisma.serviceRequest.update({
        where: { id: input.requestId },
        data: updateData,
      });

      // Add timeline entry
      await ctx.prisma.requestTimeline.create({
        data: {
          requestId: input.requestId,
          actorId: user.id,
          action: input.status,
          details: {
            notes: input.notes,
            rejectionReason: input.rejectionReason,
          },
        },
      });

      return request;
    }),

  // Add comment to request
  addComment: protectedProcedure
    .input(z.object({
      requestId: z.string(),
      content: z.string().min(1),
      isInternal: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const comment = await ctx.prisma.requestComment.create({
        data: {
          requestId: input.requestId,
          authorId: user.id,
          content: input.content,
          isInternal: input.isInternal,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      return comment;
    }),

  // Validate document
  validateDocument: agentProcedure
    .input(z.object({
      documentId: z.string(),
      isValid: z.boolean(),
      rejectionReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const document = await ctx.prisma.document.update({
        where: { id: input.documentId },
        data: {
          isVerified: input.isValid,
          verifiedById: user.id,
          verifiedAt: new Date(),
          rejectionReason: input.rejectionReason,
        },
      });

      return document;
    }),
});