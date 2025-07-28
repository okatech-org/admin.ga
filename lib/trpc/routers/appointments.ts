/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, agentProcedure } from '../server';
import { TRPCError } from '@trpc/server';

export const appointmentsRouter = createTRPCRouter({
  // Get available time slots
  getAvailableSlots: protectedProcedure
    .input(z.object({
      serviceType: z.string(),
      organizationId: z.string(),
      date: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Get organization working hours
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organisation non trouvée',
        });
      }

      // Get agents for this service
      const agents = await ctx.prisma.user.findMany({
        where: {
          role: { in: ['AGENT', 'MANAGER'] },
          isActive: true,
          primaryOrganizationId: input.organizationId,
        } as any,
      });

      // Get existing appointments for the date
      const existingAppointments = await ctx.prisma.appointment.findMany({
        where: {
          organizationId: input.organizationId,
          date: {
            gte: new Date(input.date.setHours(0, 0, 0, 0)),
            lt: new Date(input.date.setHours(23, 59, 59, 999)),
          },
        },
      });

      // Generate available slots (simplified logic)
      const slots = [];
      const startHour = 8; // 8 AM
      const endHour = 17; // 5 PM
      const slotDuration = 30; // 30 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}:${(minute + slotDuration).toString().padStart(2, '0')}`;
          
          // Check if slot is available (simplified)
          const isBooked = existingAppointments.some(
            apt => apt.timeSlot === timeSlot
          );

          if (!isBooked && agents.length > 0) {
            slots.push({
              timeSlot,
              agentId: agents[0].id, // Simplified assignment
              agentName: `${agents[0].firstName} ${agents[0].lastName}`,
            });
          }
        }
      }

      return slots;
    }),

  // Book appointment
  bookAppointment: protectedProcedure
    .input(z.object({
      serviceType: z.string(),
      organizationId: z.string(),
      agentId: z.string(),
      date: z.date(),
      timeSlot: z.string(),
      purpose: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if slot is still available
      const conflictingAppointments = await ctx.prisma.appointment.findMany({
        where: {
          agentId: input.agentId,
          date: input.date,
          timeSlot: input.timeSlot,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        } as any,
      });

      if (conflictingAppointments.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ce créneau n\'est plus disponible',
        });
      }

      // Create appointment
      const appointment = await ctx.prisma.appointment.create({
        data: {
          date: input.date,
          timeSlot: input.timeSlot,
          duration: input.duration || 30,
          status: 'SCHEDULED',
          citizenId: ctx.session.user.id,
          agentId: input.agentId,
          organizationId: input.organizationId,
          serviceType: input.serviceType,
          purpose: input.purpose,
          notes: input.notes,
          location: input.location,
        } as any,
      });

      return appointment;
    }),

  // Get my appointments (citizen view)
  getMyAppointments: protectedProcedure
    .input(z.object({
      status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        citizenId: ctx.session.user.id,
      };

      if (input.status) {
        where.status = input.status;
      }

      const appointments = await ctx.prisma.appointment.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              code: true,
              address: true,
            } as any,
          },
        },
        orderBy: { date: 'asc' },
        take: input.limit,
        skip: input.offset,
      });

      return appointments;
    }),

  // Get agent appointments
  getAgentAppointments: agentProcedure
    .input(z.object({
      date: z.date().optional(),
      status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        agentId: ctx.session.user.id,
      };

      if (input.date) {
        where.date = {
          gte: new Date(input.date.setHours(0, 0, 0, 0)),
          lt: new Date(input.date.setHours(23, 59, 59, 999)),
        };
      }

      if (input.status) {
        where.status = input.status;
      }

      const appointments = await ctx.prisma.appointment.findMany({
        where,
        include: {
          citizen: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              code: true,
              address: true,
            } as any,
          },
        },
        orderBy: { date: 'asc' },
        take: input.limit,
        skip: input.offset,
      });

      return appointments;
    }),

  // Update appointment status
  updateStatus: agentProcedure
    .input(z.object({
      appointmentId: z.string(),
      status: z.enum(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,
          agentId: ctx.session.user.id,
        },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rendez-vous non trouvé',
        });
      }

      const updateData: any = {
        status: input.status,
      };

      if (input.notes) {
        updateData.notes = input.notes;
      }

      if (input.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      } else if (input.status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
      }

      await ctx.prisma.appointment.update({
        where: { id: input.appointmentId },
        data: updateData,
      });

      return { success: true };
    }),

  // Cancel appointment (citizen)
  cancelAppointment: protectedProcedure
    .input(z.object({
      appointmentId: z.string(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,
          citizenId: ctx.session.user.id,
        },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rendez-vous non trouvé',
        });
      }

      if (appointment.status !== 'SCHEDULED' && appointment.status !== 'CONFIRMED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ce rendez-vous ne peut plus être annulé',
        });
      }

      await ctx.prisma.appointment.update({
        where: { id: input.appointmentId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: input.reason,
        } as any,
      });

      return { success: true };
    }),

  // Get appointment details
  getAppointment: protectedProcedure
    .input(z.object({
      appointmentId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findUnique({
        where: { id: input.appointmentId },
        include: {
          citizen: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          agent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              code: true,
              address: true,
              phone: true,
            } as any,
          },
          request: true,
        },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rendez-vous non trouvé',
        });
      }

      // Check if user has access to this appointment
      const isOwner = appointment.citizenId === ctx.session.user.id;
      const isAgent = appointment.agentId === ctx.session.user.id;
      const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(ctx.session.user.role);

      if (!isOwner && !isAgent && !isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Accès non autorisé',
        });
      }

      return appointment;
    }),
}); 