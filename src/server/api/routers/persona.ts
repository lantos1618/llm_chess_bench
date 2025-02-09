import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const personaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      model: z.string().min(1),
      configuration: z.record(z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.persona.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.persona.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        ratings: true,
      },
    });
  }),

  byId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const persona = await ctx.prisma.persona.findUnique({
        where: { id: input },
        include: {
          ratings: true,
          battles1: true,
          battles2: true,
        },
      });

      if (!persona) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found',
        });
      }

      if (persona.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view this persona',
        });
      }

      return persona;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).max(100).optional(),
        model: z.string().min(1).optional(),
        configuration: z.record(z.any()).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const persona = await ctx.prisma.persona.findUnique({
        where: { id: input.id },
      });

      if (!persona) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found',
        });
      }

      if (persona.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this persona',
        });
      }

      return ctx.prisma.persona.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const persona = await ctx.prisma.persona.findUnique({
        where: { id: input },
      });

      if (!persona) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found',
        });
      }

      if (persona.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this persona',
        });
      }

      return ctx.prisma.persona.delete({
        where: { id: input },
      });
    }),
}); 