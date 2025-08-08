/* @ts-nocheck */
import { createTRPCRouter } from './server';
import { organizationsRouter } from './routers/organizations';
import { configurationRouter } from './routers/configuration';

export const appRouter = createTRPCRouter({
  organizations: organizationsRouter,
  configuration: configurationRouter,
});

export type AppRouter = typeof appRouter;
