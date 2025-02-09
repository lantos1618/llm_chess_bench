import { createTRPCRouter } from '../trpc';
import { personaRouter } from './routers/persona';
import { battleRouter } from './routers/battle';
import { analyticsRouter } from './routers/analytics';

export const appRouter = createTRPCRouter({
  persona: personaRouter,
  battle: battleRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter; 