/* @ts-nocheck */
import { createTRPCRouter } from './server';
import { servicesRouter } from './routers/services';
import { requestsRouter } from './routers/requests';
import { authRouter } from './routers/auth';
import { notificationsRouter } from './routers/notifications';
import { appointmentsRouter } from './routers/appointments';
import { analyticsRouter } from './routers/analytics';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  services: servicesRouter,
  requests: requestsRouter,
  notifications: notificationsRouter,
  appointments: appointmentsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;