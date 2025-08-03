import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import * as z from "zod";
import { db } from "@/db";
import { and, or, eq, lt, desc, getTableColumns, not } from "drizzle-orm";
import { users, videos, videoviews } from "@/db/schema";
import { TRPCError } from "@trpc/server";
export const SuggestionRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),

            updatedAt: z.date(),
          })
          .nullish(),
        videoId: z.string().uuid(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor, videoId } = input;
      const [existingvideo] = await db
        .select(
        
        )
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!existingvideo) throw new TRPCError({ code: "NOT_FOUND" });
      const data = await db
        .select({
         
          ...getTableColumns(videos),
           user:users,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
      
        .where(
          and(
            not(eq(videos.id,existingvideo.id)),
            eq(videos.visibility,"public"),
            existingvideo.categoryId
              ? eq(videos.categoryId, existingvideo.categoryId)
              : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .innerJoin(users,eq(users.id,videos.userId))
        .limit(limit + 1);
      const hasmore = data.length > limit;
      const items = hasmore ? data.slice(0, -1) : data;
      const lastitems = items[items.length - 1];
      const nextCursor = hasmore
        ? {
            id: lastitems.id,
            updatedAt: lastitems.updatedAt,
          }
        : null;
      return {
        nextCursor,
        items,
      };
    }),
});
