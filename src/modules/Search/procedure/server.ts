import { db } from "@/db";
import { users, videos } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, or, lt, desc, ilike } from "drizzle-orm";
import * as z from "zod";
import { videoviews } from "@/db/schema";
import { getTableColumns } from "drizzle-orm";
export const SearchRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        query: z.string().nullish(),
        categoryId: z.string().uuid().nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, query, categoryId } = input;
      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .where(
          and(
            query? or(
              ilike(videos.title,`%${query}%`),
               ilike(users.name,`%${query}%`)
            ) : undefined,
           
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            eq(videos.visibility,"public"),
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
        .innerJoin(users, eq(users.id, videos.userId))
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
