import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const battleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      format: z.string(),
      persona1Id: z.string(),
      persona2Id: z.string(),
      parameters: z.record(z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify personas exist and user owns at least one of them
      const [persona1, persona2] = await Promise.all([
        ctx.prisma.persona.findUnique({ where: { id: input.persona1Id } }),
        ctx.prisma.persona.findUnique({ where: { id: input.persona2Id } }),
      ]);

      if (!persona1 || !persona2) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'One or both personas not found',
        });
      }

      if (persona1.userId !== ctx.session.user.id && persona2.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must own at least one of the personas to initiate a battle',
        });
      }

      return ctx.prisma.battle.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          moves: [], // Initialize with empty moves array
        },
      });
    }),

  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.battle.findMany({
        take: input.limit + 1,
        where: {
          OR: [
            { persona1: { userId: ctx.session.user.id } },
            { persona2: { userId: ctx.session.user.id } },
          ],
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { startedAt: 'desc' },
        include: {
          persona1: true,
          persona2: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  byId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const battle = await ctx.prisma.battle.findUnique({
        where: { id: input },
        include: {
          persona1: true,
          persona2: true,
        },
      });

      if (!battle) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Battle not found',
        });
      }

      if (battle.persona1.userId !== ctx.session.user.id && battle.persona2.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view this battle',
        });
      }

      return battle;
    }),

  updateResult: protectedProcedure
    .input(z.object({
      id: z.string(),
      winnerId: z.string(),
      moves: z.array(z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      const battle = await ctx.prisma.battle.findUnique({
        where: { id: input.id },
        include: {
          persona1: true,
          persona2: true,
        },
      });

      if (!battle) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Battle not found',
        });
      }

      if (battle.endedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Battle has already ended',
        });
      }

      if (battle.persona1.userId !== ctx.session.user.id && battle.persona2.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this battle',
        });
      }

      return ctx.prisma.battle.update({
        where: { id: input.id },
        data: {
          winnerId: input.winnerId,
          moves: input.moves,
          endedAt: new Date(),
        },
      });
    }),
}); 