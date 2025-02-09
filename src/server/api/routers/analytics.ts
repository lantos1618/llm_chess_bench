import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc';

export const analyticsRouter = createTRPCRouter({
  leaderboard: publicProcedure
    .input(z.object({
      format: z.string().optional(),
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.persona.findMany({
        where: input.format ? {
          ratings: {
            some: {
              format: input.format,
            },
          },
        } : undefined,
        take: input.limit,
        orderBy: {
          elo: 'desc',
        },
        include: {
          ratings: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  personaStats: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const persona = await ctx.prisma.persona.findUnique({
        where: { id: input },
        include: {
          ratings: true,
          battles1: {
            where: {
              endedAt: { not: null },
            },
          },
          battles2: {
            where: {
              endedAt: { not: null },
            },
          },
        },
      });

      if (!persona) {
        return null;
      }

      const battles = [...persona.battles1, ...persona.battles2];
      const wins = battles.filter(b => b.winnerId === persona.id).length;
      const total = battles.length;

      return {
        persona,
        stats: {
          totalBattles: total,
          wins,
          losses: total - wins,
          winRate: total > 0 ? (wins / total) * 100 : 0,
        },
      };
    }),

  activityGraph: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(365).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const battles = await ctx.prisma.battle.groupBy({
        by: ['startedAt'],
        where: {
          startedAt: {
            gte: startDate,
          },
        },
        _count: {
          id: true,
        },
      });

      return battles.map(day => ({
        date: day.startedAt,
        battles: day._count.id,
      }));
    }),
}); 