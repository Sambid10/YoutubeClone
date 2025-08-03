import { db } from "@/db";
import { users, videoReactions, videos, videoviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns,gt, or, lt,  ilike ,desc} from "drizzle-orm";
import * as z from "zod";
export const playlistRouter = createTRPCRouter({
  getLikedVideo: protectedProcedure
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
      if(!ctx.user){
        throw new TRPCError({code:"UNAUTHORIZED"})
      }
      const viewerreaction = db
        .$with("viewer_reaction")
        .as(
          db.select({
            viewerReaction:videoReactions.reactiontype,
            videoId:videoReactions.videoId
          }).from(videoReactions).where(eq(videoReactions.userId, userId))
        );
      const data = await db
        .with(viewerreaction)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .innerJoin(viewerreaction, eq(videos.id, viewerreaction.videoId ))
        .where(
          and(
            eq(videos.visibility, "public"),
            eq(viewerreaction.viewerReaction, "like"),
            cursor
              ? or(
                  gt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    gt(videos.id, cursor.id)
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
  getSearchVideo: protectedProcedure
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
      const { id: userId } = ctx.user;

      const viewervideoviews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoviews.videoId,
            updatedAt: videoviews.updatedAt,
          })
          .from(videoviews)
          .where(eq(videoviews.userId, userId))
      );
      const data = await db
        .with(viewervideoviews)
        .select({
          ...getTableColumns(videos),
          user: users,
          updatedAt: viewervideoviews.updatedAt,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .innerJoin(viewervideoviews, eq(videos.id, viewervideoviews.videoId))
        .where(
          and(
            or(
              ilike(videos.title, `%${query}%`),
              ilike(users.name, `%${query}%`)
            ),

            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewervideoviews.updatedAt, cursor.updatedAt),
                  and(
                    eq(viewervideoviews.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewervideoviews.updatedAt), desc(videos.id))
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
  getHistory: protectedProcedure
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
      const viewervideoviews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoviews.videoId,
            updatedAt: videoviews.updatedAt,
          })
          .from(videoviews)
          .where(eq(videoviews.userId, userId))
      );
      const data = await db
        .with(viewervideoviews)
        .select({
          ...getTableColumns(videos),
          user: users,
          updatedAt: viewervideoviews.updatedAt,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .innerJoin(viewervideoviews, eq(videos.id, viewervideoviews.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewervideoviews.updatedAt, cursor.updatedAt),
                  and(
                    eq(viewervideoviews.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewervideoviews.updatedAt), desc(videos.id))
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
