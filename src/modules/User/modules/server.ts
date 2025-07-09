import { db } from "@/db";
import { users, UserSubscription, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, and, or, lt, desc, ilike, getTableColumns } from "drizzle-orm";
import { isNotNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import * as z from "zod";
export const UserRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
        query: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, query } = input;
      const { clerkUserId } = ctx;
      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));
      if (user) {
        userId = user.id;
      }

      const viewerSubscriptions = db.$with("viewer_subscription").as(
        db
          .select()
          .from(UserSubscription)
          .where(inArray(UserSubscription.viewerId, userId ? [userId] : []))
      );

      const data = await db
      .with(viewerSubscriptions)
        .select({
          ...getTableColumns(users),
          subscriberCount: sql<number>`
                (
                  select count(*) 
                  from ${UserSubscription} 
                  where ${UserSubscription.creatorId} = ${users.id}
                )
              `.mapWith(Number),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
            Boolean
          ),
        })
        .from(users)

        .where(
          and(
            ilike(users.name, `%${query}%`),
            cursor
              ? or(
                  lt(users.updatedAt, cursor.updatedAt),
                  and(
                    eq(users.updatedAt, cursor.updatedAt),
                    lt(users.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(users.updatedAt), desc(users.id))
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        )
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
