/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../server';
import { TRPCError } from '@trpc/server';

export const servicesRouter = createTRPCRouter({
  // Get all available services
  getAvailableServices: publicProcedure.query(async ({ ctx }) => {
    const organizations = await ctx.prisma.organization.findMany({
      where: { isActive: true },
      include: {
        serviceConfigs: {
          where: { isActive: true },
        },
      },
    });

    return organizations.map(org => ({
      id: org.id,
      name: org.name,
      type: org.type,
      services: org.serviceConfigs,
    }));
  }),

  // Get service details
  getServiceDetails: publicProcedure
    .input(z.object({
      organizationId: z.string(),
      serviceType: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.prisma.serviceConfig.findUnique({
        where: {
          organizationId_serviceType: {
            organizationId: input.organizationId,
            serviceType: input.serviceType as any,
          },
        },
        include: {
          organization: true,
        },
      });

      if (!service) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Service non trouvé',
        });
      }

      return service;
    }),

  // Submit service request
  submitRequest: protectedProcedure
    .input(z.object({
      serviceType: z.string(),
      organizationId: z.string(),
      formData: z.record(z.any()),
      documents: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // Create service request
      const request = await ctx.prisma.serviceRequest.create({
        data: {
          type: input.serviceType as any,
          status: 'SUBMITTED',
          submittedById: user.id,
          organizationId: input.organizationId,
          formData: input.formData,
          submittedAt: new Date(),
          trackingNumber: `GA-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        },
      });

      // Create timeline entry
      await ctx.prisma.requestTimeline.create({
        data: {
          requestId: request.id,
          actorId: user.id,
          action: 'SUBMITTED',
          details: {
            serviceType: input.serviceType,
            organization: input.organizationId,
          },
        },
      });

      // Upload documents if provided
      if (input.documents && input.documents.length > 0) {
        await Promise.all(
          input.documents.map(doc =>
            ctx.prisma.document.create({
              data: {
                name: doc.name,
                originalName: doc.name,
                type: doc.type,
                size: doc.size,
                url: doc.url,
                uploadedById: user.id,
                requestId: request.id,
                isRequired: true,
              },
            })
          )
        );
      }

      return request;
    }),

  // Get user's requests
  getUserRequests: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const where = {
        submittedById: user.id,
        ...(input.status && { status: input.status as any }),
      };

      const [requests, total] = await Promise.all([
        ctx.prisma.serviceRequest.findMany({
          where,
          include: {
            organization: true,
            assignedTo: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            documents: true,
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.serviceRequest.count({ where }),
      ]);

      return {
        requests,
        total,
        hasMore: total > input.offset + input.limit,
      };
    }),

  // Get request details
  getRequestDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const request = await ctx.prisma.serviceRequest.findFirst({
        where: {
          id: input.id,
          OR: [
            { submittedById: user.id },
            { assignedToId: user.id },
            // Allow access for agents in same organization
            ...(user.organizationId ? [{
              organizationId: user.organizationId,
            }] : []),
          ],
        },
        include: {
          organization: true,
          submittedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          documents: true,
          comments: {
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
            orderBy: { createdAt: 'asc' },
          },
          timeline: {
            include: {
              actor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!request) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Demande non trouvée',
        });
      }

      return request;
    }),
});