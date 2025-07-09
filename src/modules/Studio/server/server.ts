import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, or, lt, desc } from "drizzle-orm";
import * as z from "zod";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;
      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));
      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return video;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;
      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
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
