import { db } from "@/db";
import { UserSubscription } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
export const SubscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const [createdsubscription] = await db
        .insert(UserSubscription)
        .values({
         viewerId:ctx.user.id,
         creatorId:userId
        })
        .returning();
      return createdsubscription;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const [removedsubscription] = await db
        .delete(UserSubscription)
        .where(
          and(
            eq(UserSubscription.viewerId, ctx.user.id),
            eq(UserSubscription.creatorId, userId)
          )
        )
        .returning();
        return removedsubscription
    }),
});
