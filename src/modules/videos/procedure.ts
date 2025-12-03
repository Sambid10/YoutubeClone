import { db } from "@/db";
import {
  users,
  UserSubscription,
  videoReactions,
  videos,
  videoUpdateSchema,
  videoviews,
} from "@/db/schema";
import { mux } from "@/lib/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  and,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  or,
  lt,
  desc,
} from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import * as z from "zod";
export const videosRouter = createTRPCRouter({
  getManySubscribed: protectedProcedure
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
      const { id: userId } = ctx.user;
      const { limit, cursor } = input;
      const viewerSubscription = db.$with("viewer_subscription").as(
        db
          .select({
            userId: UserSubscription.creatorId,
          })
          .from(UserSubscription)
          .where(eq(UserSubscription.viewerId, userId))
      );
      const data = await db
        .with(viewerSubscription)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .where(
          and(
            eq(videos.visibility, "public"),
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
        .innerJoin(viewerSubscription, eq(viewerSubscription.userId, users.id))
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
  getTrending: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewCount: z.number(),
          })
          .nullish(),

        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;
      const viewcountSubquery = db.$count(
        videoviews,
        eq(videoviews.videoId, videos.id)
      );

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewcount: viewcountSubquery,
        })
        .from(videos)
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewcountSubquery, cursor.viewCount),
                  and(
                    eq(viewcountSubquery, cursor.viewCount),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewcountSubquery), desc(videos.id))
        .innerJoin(users, eq(users.id, videos.userId))
        .limit(limit + 1);
      const hasmore = data.length > limit;
      const items = hasmore ? data.slice(0, -1) : data;
      const lastitems = items[items.length - 1];
      const nextCursor = hasmore
        ? {
            id: lastitems.id,
            viewCount: lastitems.viewcount,
          }
        : null;
      return {
        nextCursor,
        items,
      };
    }),
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
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;
      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewcount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
        })
        .from(videos)
        .where(
          and(
            eq(videos.visibility, "public"),
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
  getOne: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clerkUserId } = ctx;
      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));
      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.reactiontype,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : []))
      );

      const viewerSubscriptions = db.$with("viewer_subscription").as(
        db
          .select()
          .from(UserSubscription)
          .where(inArray(UserSubscription.viewerId, userId ? [userId] : []))
      );

      const [existingVideo] = await db
        .with(viewerReactions, viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: {
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
          },
          viewerReaction: viewerReactions.type,
          videocount: db.$count(videoviews, eq(videoviews.videoId, videos.id)),
          likecount: db.$count(
            videoReactions,
            and(
              eq(videos.id, videoReactions.videoId),
              eq(videoReactions.reactiontype, "like")
            )
          ),
          dislikecount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.reactiontype, "dislike"),
              eq(videoReactions.videoId, videos.id)
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        )
        .where(eq(videos.id, input.videoId));
      // .groupBy(
      //   videos.id,
      //   users.id,
      //   viewerReactions.type
      // )
      if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" });
      return existingVideo;
    }),
  revalidate: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      if (!input.videoId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const [existingvideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));
      if (!existingvideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!existingvideo.muxUploadId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const directUpload = await mux.video.uploads.retrieve(
        existingvideo.muxUploadId
      );
      if (!directUpload || !directUpload.asset_id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const asset = await mux.video.assets.retrieve(directUpload.asset_id);
      if (!asset) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const videopreviewUrl = `https://image.mux.com/${asset.playback_ids?.[0].id}/animated.gif`;
      const thumbnailUrl = `https://image.mux.com/${asset.playback_ids?.[0].id}/thumbnail.jpg`;
      const [updatedVideo] = await db
        .update(videos)
        .set({
          muxStatus: asset.status,
          muxPlaybackId: asset.playback_ids?.[0].id,
          muxAssetId: asset.id,
          vidduration: asset.duration ? Math.round(asset.duration * 1000) : 0,
          previewvideoUrl:videopreviewUrl,
          thumbnailUrl:thumbnailUrl
        })
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
  restoreThumbnail: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.videoId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const [existingvideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));
      if (!existingvideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingvideo.thumbnailkey) {
        const utpai = new UTApi();
        await utpai.deleteFiles(existingvideo.thumbnailkey);
        await db
          .update(videos)
          .set({
            thumbnailkey: null,
            thumbnailUrl: null,
          })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));
      }
      if (!existingvideo.muxPlaybackId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const restoredthumbnailUrl = `https://image.mux.com/${existingvideo.muxPlaybackId}/thumbnail.jpg`;
      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailUrl: restoredthumbnailUrl,
        })
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)))
        .returning();
      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.videoId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const removevid = await db
        .delete(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)))
        .returning();
      if (!removevid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return removevid;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (!userId) {
        return new TRPCError({ code: "UNAUTHORIZED" });
      }
      const updatedvid = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedvid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return updatedvid;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const upload = await mux.video.uploads.create({
      cors_origin: "*", //prod ma set url
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
    });
    const [data] = await db
      .insert(videos)
      .values({
        userId,
        title: "untitled",
        muxStatus: upload.status,
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: data,
      url: upload.url,
    };
  }),
});
