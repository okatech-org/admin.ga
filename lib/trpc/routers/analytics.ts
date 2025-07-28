/* @ts-nocheck */
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure, managerProcedure } from '../server';
import { TRPCError } from '@trpc/server';
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  organizationId: z.string().optional(),
});

const metricsSchema = z.object({
  period: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY']),
  metric: z.string(),
  dimension: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
});

export const analyticsRouter = createTRPCRouter({
  // Dashboard metrics for managers/admins
  getDashboardMetrics: managerProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;
      
      // Parallel queries for performance
      const [
        requestMetrics,
        appointmentMetrics,
        userMetrics,
        performanceMetrics,
      ] = await Promise.all([
        // Request metrics
        ctx.prisma.serviceRequest.groupBy({
          by: ['status'],
          where: {
            organizationId,
            createdAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          },
          _count: true,
        }),
        
        // Appointment metrics
        ctx.prisma.appointment.groupBy({
          by: ['status'],
          where: {
            organizationId,
            date: {
              gte: input.startDate,
              lte: input.endDate,
            },
          },
          _count: true,
        }),
        
        // Active users
        ctx.prisma.user.count({
          where: {
            primaryOrganizationId: organizationId,
            lastLoginAt: {
              gte: input.startDate,
            },
          } as any,
        }),
        
        // Average processing time
        ctx.prisma.serviceRequest.aggregate({
          where: {
            organizationId,
            status: 'COMPLETED',
            completedAt: {
              gte: input.startDate,
              lte: input.endDate,
            },
          },
          _avg: {
            actualProcessingTime: true,
          },
        }),
      ]);

      // Calculate completion rate
      const totalRequests = requestMetrics.reduce((sum, m) => sum + m._count, 0);
      const completedRequests = requestMetrics.find(m => m.status === 'COMPLETED')?._count || 0;
      const completionRate = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;

      return {
        overview: {
          totalRequests,
          completedRequests,
          completionRate,
          activeUsers: userMetrics,
          avgProcessingTime: performanceMetrics._avg.actualProcessingTime || 0,
        },
        requests: {
          byStatus: requestMetrics.reduce((acc, m) => {
            acc[m.status] = m._count;
            return acc;
          }, {} as Record<string, number>),
        },
        appointments: {
          byStatus: appointmentMetrics.reduce((acc, m) => {
            acc[m.status] = m._count;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    }),

  // Daily activity metrics for charts
  getDailyActivity: managerProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;

      const createdRequests = await ctx.prisma.serviceRequest.groupBy({
        by: ['createdAt'],
        where: {
          organizationId,
          createdAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        _count: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      const completedRequests = await ctx.prisma.serviceRequest.groupBy({
        by: ['completedAt'],
        where: {
          organizationId,
          status: 'COMPLETED',
          completedAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        _count: { completedAt: true },
        orderBy: { completedAt: 'asc' },
      });

      // Format data for charting
      type DailyData = { date: string; created: number; completed: number };
      const activityData: Record<string, DailyData> = {};

      createdRequests.forEach(item => {
        const date = item.createdAt.toISOString().split('T')[0];
        if (!activityData[date]) activityData[date] = { date, created: 0, completed: 0 };
        activityData[date].created += item._count.createdAt;
      });

      completedRequests.forEach(item => {
        const date = item.completedAt.toISOString().split('T')[0];
        if (!activityData[date]) activityData[date] = { date, created: 0, completed: 0 };
        activityData[date].completed += item._count.completedAt;
      });
      
      const sortedData: DailyData[] = Object.values(activityData);
      
      return sortedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }),

  // Service performance metrics
  getServiceMetrics: managerProcedure
    .input(z.object({
      ...dateRangeSchema.shape,
      serviceType: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;

      const metrics = await ctx.prisma.serviceRequest.groupBy({
        by: ['type', 'status'],
        where: {
          organizationId,
          ...(input.serviceType && { type: input.serviceType as any }),
          createdAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        _count: true,
        _avg: {
          actualProcessingTime: true,
        },
      });

      // Group by service type
      const serviceMetrics = metrics.reduce((acc, m) => {
        if (!acc[m.type]) {
          acc[m.type] = {
            total: 0,
            byStatus: {},
            avgProcessingTime: 0,
          };
        }
        
        acc[m.type].total += m._count;
        acc[m.type].byStatus[m.status] = m._count;
        if (m._avg.actualProcessingTime) {
          acc[m.type].avgProcessingTime = m._avg.actualProcessingTime;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return serviceMetrics;
    }),

  // Agent performance metrics
  getAgentMetrics: managerProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;

      const agentMetrics = await ctx.prisma.serviceRequest.groupBy({
        by: ['processedById', 'status'],
        where: {
          organizationId,
          processedById: { not: null },
          processingStarted: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        _count: true,
        _avg: {
          actualProcessingTime: true,
        },
      });

      // Get agent details
      const agentIds = Array.from(new Set(agentMetrics.map(m => m.processedById).filter(Boolean)));
      const agents = await ctx.prisma.user.findMany({
        where: { id: { in: agentIds as string[] } },
        select: { id: true, firstName: true, lastName: true },
      });

      const agentMap = agents.reduce((acc, agent) => ({
        ...acc,
        [agent.id]: `${agent.firstName} ${agent.lastName}`,
      }), {} as Record<string, string>);

      // Group metrics by agent
      const agentPerformance = agentMetrics.reduce((acc, m) => {
        const agentId = m.processedById!;
        if (!acc[agentId]) {
          acc[agentId] = {
            name: agentMap[agentId] || 'Unknown',
            total: 0,
            completed: 0,
            avgProcessingTime: 0,
          };
        }
        
        acc[agentId].total += m._count;
        if (m.status === 'COMPLETED') {
          acc[agentId].completed = m._count;
        }
        if (m._avg.actualProcessingTime) {
          acc[agentId].avgProcessingTime = m._avg.actualProcessingTime;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(agentPerformance);
    }),

  // Real-time metrics
  getRealTimeMetrics: protectedProcedure
    .query(async ({ ctx }) => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const [
        recentRequests,
        activeAppointments,
        onlineUsers,
      ] = await Promise.all([
        // Recent requests
        ctx.prisma.serviceRequest.count({
          where: {
            createdAt: { gte: oneHourAgo },
          },
        }),
        
        // Active appointments
        ctx.prisma.appointment.count({
          where: {
            status: 'IN_PROGRESS',
            date: {
              gte: startOfDay(now),
              lte: endOfDay(now),
            },
          },
        }),
        
        // Online users (last 5 minutes)
        ctx.prisma.user.count({
          where: {
            lastLoginAt: {
              gte: new Date(now.getTime() - 5 * 60 * 1000),
            },
          },
        }),
      ]);

      return {
        timestamp: now,
        metrics: {
          requestsLastHour: recentRequests,
          activeAppointments,
          onlineUsers,
        },
      };
    }),

  // Store custom metric
  recordMetric: protectedProcedure
    .input(z.object({
      metric: z.string(),
      value: z.number(),
      dimension: z.string().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await (ctx.prisma as any).analytics.create({
        data: {
          metric: input.metric,
          value: input.value,
          dimension: input.dimension,
          timestamp: new Date(),
          period: 'HOURLY',
          metadata: input.metadata || {},
        },
      });

      return { success: true };
    }),

  // Get custom metrics
  getCustomMetrics: managerProcedure
    .input(metricsSchema)
    .query(async ({ ctx, input }) => {
      const metrics = await (ctx.prisma as any).analytics.findMany({
        where: {
          metric: input.metric,
          ...(input.dimension && { dimension: input.dimension }),
          period: input.period,
        },
        orderBy: { timestamp: 'desc' },
        take: input.limit,
      });

      return metrics;
    }),

  // Generate report
  generateReport: adminProcedure
    .input(z.object({
      type: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM']),
      startDate: z.date(),
      endDate: z.date(),
      organizationId: z.string().optional(),
      format: z.enum(['PDF', 'EXCEL', 'JSON']).default('PDF'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Collect all necessary data
      const reportData = {
        requests: [],
        appointments: [],
        users: [],
        performance: {},
      };
      
      // Generate report ID
      const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store report metadata
      await ctx.prisma.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          action: 'REPORT_GENERATED',
          resource: 'report',
          resourceId: reportId,
          details: {
            type: input.type,
            dateRange: { start: input.startDate, end: input.endDate },
            format: input.format,
          },
        },
      });

      // TODO: Implement actual report generation
      return {
        reportId,
        status: 'PROCESSING',
        estimatedTime: 30, // seconds
        message: 'Rapport en cours de génération',
      };
    }),

  // SLA compliance metrics
  getSLAMetrics: managerProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationId || ctx.session.user.organizationId;

      // Get all completed requests in period
      const completedRequests = await ctx.prisma.serviceRequest.findMany({
        where: {
          organizationId,
          status: 'COMPLETED',
          completedAt: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          organization: {
            include: {
              serviceConfigs: true,
            },
          },
        },
      });

      // Calculate SLA compliance
      let totalRequests = 0;
      let slaCompliant = 0;
      const slaByService: Record<string, any> = {};

      completedRequests.forEach(request => {
        totalRequests++;
        
        // Get SLA for this service type
        const serviceConfig = request.organization.serviceConfigs.find(
          sc => sc.serviceType === request.type
        );
        const slaDays = serviceConfig?.processingDays || 7;
        
        // Calculate actual processing days
        if (request.submittedAt && request.completedAt) {
          const actualDays = Math.floor(
            (request.completedAt.getTime() - request.submittedAt.getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          
          const isCompliant = actualDays <= slaDays;
          if (isCompliant) slaCompliant++;
          
          // Track by service
          if (!slaByService[request.type]) {
            slaByService[request.type] = {
              total: 0,
              compliant: 0,
              avgProcessingDays: 0,
            };
          }
          
          slaByService[request.type].total++;
          if (isCompliant) slaByService[request.type].compliant++;
          slaByService[request.type].avgProcessingDays += actualDays;
        }
      });

      // Calculate averages
      Object.keys(slaByService).forEach(service => {
        slaByService[service].avgProcessingDays /= slaByService[service].total;
        slaByService[service].complianceRate = 
          (slaByService[service].compliant / slaByService[service].total) * 100;
      });

      return {
        overall: {
          totalRequests,
          slaCompliant,
          complianceRate: totalRequests > 0 ? (slaCompliant / totalRequests) * 100 : 0,
        },
        byService: slaByService,
      };
    }),

}); 