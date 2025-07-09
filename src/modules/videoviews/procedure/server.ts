import { db } from "@/db";
import { videos, videoviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import * as z from "zod";
export const videoviewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      console.log(videoId);
      const [existingvideoviews] = await db
        .select()
        .from(videoviews)
        .where(
          and(eq(videoviews.userId, userId), eq(videoviews.videoId, videoId))
        );

      if (existingvideoviews) {
        const [updatedVideoView] = await db
          .update(videoviews)
          .set({
              userId: userId,
              videoId: videoId,
              updatedAt:new Date()
          })
          .where(
            and(eq(videoviews.userId, userId), eq(videoviews.videoId, videoId))
          )
          .returning();
          return updatedVideoView
      }

      const [createdvideoview] = await db
        .insert(videoviews)
        .values({
          userId: userId,
          videoId: videoId,
        })
        .returning();
      return createdvideoview;
    }),
});
