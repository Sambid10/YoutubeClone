/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { users, UserSubscription, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import {
  eq,
  and,
  or,
  lt,
  desc,
  ilike,
  getTableColumns,
  inArray,
  sql,
  isNotNull,
} from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { use } from "react";
import { UTApi } from "uploadthing/server";
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

      let userId: string | undefined;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) userId = user.id;

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
          subscriberCount: sql<number>`(
            select count(*)
            from ${UserSubscription}
            where ${UserSubscription.creatorId} = ${users.id}
          )`.mapWith(Number),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
        })
        .from(users)
        .where(
          and(
            ilike(users.name, `%${query ?? ""}%`),
            cursor
              ? or(
                  lt(users.updatedAt, cursor.updatedAt),
                  and(eq(users.updatedAt, cursor.updatedAt), lt(users.id, cursor.id))
                )
              : undefined
          )
        )
        .orderBy(desc(users.updatedAt), desc(users.id))
        .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return {
        nextCursor,
        items,
      };
    }),

  getOne: baseProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clerkUserId } = ctx;

      let viewerId: string | undefined;

      const [viewer] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (viewer) viewerId = viewer.id;

      const viewerSubscriptions = db.$with("viewer_subscription").as(
        db
          .select()
          .from(UserSubscription)
          .where(
            and(
              eq(UserSubscription.viewerId, viewerId!),
              eq(UserSubscription.creatorId, input.userId)
            )
          )
      );

      const userVideos = db.$with("user_videos").as(
        db
          .select()
          .from(videos)
          .where(eq(videos.userId, input.userId))
      );

      const [result] = await db
        .with(viewerSubscriptions, userVideos)
        .select({
          ...getTableColumns(users),
          subscriberCount: sql<number>`(
            select count(*) from ${UserSubscription}
            where ${UserSubscription.creatorId} = ${users.id}
          )`.mapWith(Number),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
          videos: sql<any[]>`(
            select json_agg(${userVideos}.*) from ${userVideos}
          )`,
        })
        .from(users)
        .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
        .where(eq(users.id, input.userId));

      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      return result;
    }),
    deleteBanner:protectedProcedure.input(z.object({
      userId:z.string()
    })).mutation(async({ctx,input})=>{
      if (!input.userId) return
      const [user]=await db.select().from(users).where(eq(users.clerkId,input.userId))
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      const utapi=new UTApi()
      if (!user.bannerKey) throw new TRPCError({code:"BAD_REQUEST"})
      await utapi.deleteFiles(user.bannerKey)
      await db.update(users).set({bannerKey:null,bannerUrl:null}).where(eq(users.clerkId,input.userId))
    })
});
