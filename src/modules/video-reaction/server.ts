import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, sql } from "drizzle-orm";
import * as z from "zod";
import { eq } from "drizzle-orm";
export const videoReactionRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const videoId = input.videoId;

      const [existingVideoReactionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.reactiontype, "like")
          )
        );
      if (existingVideoReactionLike) {
        const [deletedVideoReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();
        return deletedVideoReaction;
      }
      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({
          userId: userId,
          videoId: videoId,
          reactiontype: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            reactiontype: "like",
          },
        })
        .returning();
      return createdVideoReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const videoId = input.videoId;

      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.reactiontype, "dislike")
          )
        );
      if (existingVideoReactionDislike) {
        const [deletedVideoReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();
        return deletedVideoReaction;
      }
      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({
          userId: userId,
          videoId: videoId,
          reactiontype: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: {
            reactiontype: "dislike",
          },
        })
        .returning();
      return createdVideoReaction;
    }),
  getLikeInfo: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      // Get user's reaction (if any)
      const userReaction = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, input.videoId),
            eq(videoReactions.userId, userId)
          )
        );

      // Efficiently count likes
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, input.videoId),
            eq(videoReactions.reactiontype, "like")
          )
        );

      return {
        likes: Number(count),
        isLikedByUser: userReaction[0]?.reactiontype === "like",
      };
    }),
});
