import { db } from "@/db";
import { CommentReaction, Comments, users, videos } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  sql,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";
export const CommentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        parentId: z.string().uuid().optional().nullable(),
        videoId: z.string().uuid(),
        CommentInfo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("create comment input:", input);
      const { id: userId } = ctx.user;
      const { CommentInfo, videoId, parentId } = input;

      let existingcomment = null;
      if (parentId) {
        [existingcomment] = await db
          .select()
          .from(Comments)
          .where(eq(Comments.id, parentId));
      }

      if (!existingcomment && parentId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingcomment?.parentId && parentId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdComment] = await db
        .insert(Comments)
        .values({
          commentinfo: CommentInfo,
          userId: userId,
          parentId: parentId,
          videoId: videoId,
        })
        .returning();
      return createdComment;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId, videoId } = input;
      await db.delete(CommentReaction).where(eq(CommentReaction.commentId,commentId))
      const [deletecomment] = await db
        .delete(Comments)
        .where(
          and(
            eq(Comments.userId, userId),
            eq(Comments.videoId, videoId),
            eq(Comments.id, commentId)
          )
        )
        .returning();
      if (!deletecomment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return deletecomment;
    }),
  // getMany: baseProcedure
  //   .input(
  //     z.object({
  //       videoId: z.string().uuid(),
  //       cursor: z
  //         .object({
  //           id: z.string().uuid(),
  //           updatedat: z.date(),
  //         })
  //         .nullish(),
  //       limit: z.number().min(1).max(100),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { videoId, limit, cursor } = input;
  //     const { clerkUserId } = ctx;
  //     let userId;

  //     const [user] = await db
  //       .select()
  //       .from(users)
  //       .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));
  //     if (user) {
  //       userId = user.id;
  //     }
  //     const [videoOwner] = await db
  //       .select({
  //         user: users,
  //         ...getTableColumns(videos),
  //       })
  //       .from(videos)
  //       .where(eq(videos.id, videoId))
  //       .innerJoin(users, eq(users.id, videos.userId));
  //     const creatorid = videoOwner.userId;
  //     const creatorimageurl = videoOwner.user.imageUrl;
  //     const viewerReactions = db.$with("viewer_reactions").as(
  //       db
  //         .select({
  //           commentId: CommentReaction.commentId,
  //           reactiontype: CommentReaction.reactionType,
  //         })
  //         .from(CommentReaction)
  //         .where(inArray(CommentReaction.userId, userId ? [userId] : []))
  //     );
  //     const creatorlikes = db.$with("creator_likes").as(
  //       db
  //         .select({ commentId: CommentReaction.commentId })
  //         .from(CommentReaction)
  //         .where(
  //           and(
  //             eq(CommentReaction.userId, creatorid),
  //             eq(CommentReaction.reactionType, "like")
  //           )
  //         )
  //     );
  //     const [totaldata] = await db
  //       .select({
  //         count: count(),
  //       })
  //       .from(Comments)
  //       .where(eq(Comments.videoId, videoId));
  //     const data = await db
  //       .with(viewerReactions, creatorlikes)
  //       .select({
  //         ...getTableColumns(Comments),
  //         user: users,
  //         viewerReactions: viewerReactions.reactiontype,
  //         likedByCreator: creatorlikes.commentId,
  //         likecount: db.$count(
  //           CommentReaction,
  //           and(
  //             eq(CommentReaction.reactionType, "like"),
  //             eq(CommentReaction.commentId, Comments.id)
  //           )
  //         ),
  //         dislikecount: db.$count(
  //           CommentReaction,
  //           and(
  //             eq(CommentReaction.reactionType, "dislike"),
  //             eq(CommentReaction.commentId, Comments.id)
  //           )
  //         ),
  //       })
  //       .from(Comments)
  //       .where(
  //         and(
  //           eq(Comments.videoId, videoId),
  //           cursor
  //             ? or(
  //                 lt(Comments.updatedAt, cursor.updatedat),
  //                 and(
  //                   eq(Comments.updatedAt, cursor.updatedat),
  //                   lt(Comments.id, cursor.id)
  //                 )
  //               )
  //             : undefined
  //         )
  //       )
  //       .innerJoin(users, eq(users.id, Comments.userId))
  //       .leftJoin(viewerReactions, eq(viewerReactions.commentId, Comments.id))
  //       .leftJoin(creatorlikes, eq(creatorlikes.commentId, Comments.id))
  //       .orderBy(desc(Comments.updatedAt), desc(Comments.id))
  //       .limit(limit + 1);

  //     const hasmore = data.length > limit;
  //     const items = hasmore ? data.slice(0, -1) : data;
  //     const lastitem = items[items.length - 1];
  //     const nextcursor = hasmore
  //       ? {
  //           id: lastitem.id,
  //           updatedat: lastitem.updatedAt,
  //         }
  //       : null;
  //     return {
  //       totalcount: totaldata.count,
  //       creatorImageUrl:creatorimageurl,
  //       items,
  //       nextcursor,
  //     };
  //   }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId:z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedat: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { videoId, limit, cursor,parentId } = input;
      const { clerkUserId } = ctx;

      // Run user, videoOwner, and total count queries in parallel
      const [userResult, videoOwnerResult, totalCountResult] =
        await Promise.all([
          db
            .select()
            .from(users)
            .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : [])),
          db
            .select({
              user: users,
              ...getTableColumns(videos),
            })
            .from(videos)
            .where(eq(videos.id, videoId))
            .innerJoin(users, eq(users.id, videos.userId)),
          db
            .select({
              count: count(),
            })
            .from(Comments)
            .where(eq(Comments.videoId, videoId)),
        ]);

      const [user] = userResult;
      const [videoOwner] = videoOwnerResult;
      const [totaldata] = totalCountResult;

      const userId = user?.id;
      const creatorid = videoOwner.userId;
      const creatorimageurl = videoOwner.user.imageUrl;

      // Subquery for viewer's reactions
      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            commentId: CommentReaction.commentId,
            reactiontype: CommentReaction.reactionType,
          })
          .from(CommentReaction)
          .where(inArray(CommentReaction.userId, userId ? [userId] : []))
      );

      // Subquery for creator's likes
      const creatorlikes = db.$with("creator_likes").as(
        db
          .select({ commentId: CommentReaction.commentId })
          .from(CommentReaction)
          .where(
            and(
              eq(CommentReaction.userId, creatorid),
              eq(CommentReaction.reactionType, "like")
            )
          )
      );

      const replies = db.$with("replies").as(
        db
          .select({ parentId: Comments.parentId, count: count(Comments.id).as("count") })
          .from(Comments)
          .where(isNotNull(Comments.parentId))
          .groupBy(Comments.parentId)
      );
      // Final comment data with joins
      const data = await db
        .with(viewerReactions, creatorlikes,replies)
        .select({
          ...getTableColumns(Comments),
          
          user: users,
          viewerReactions: viewerReactions.reactiontype,
          likedByCreator: sql<boolean>`(${creatorlikes.commentId} = ${Comments.id})`.as("likedByCreator"),
          replycount: replies.count,
          likecount: db.$count(
            CommentReaction,
            and(
              eq(CommentReaction.reactionType, "like"),
              eq(CommentReaction.commentId, Comments.id)
            )
          ),
          dislikecount: db.$count(
            CommentReaction,
            and(
              eq(CommentReaction.reactionType, "dislike"),
              eq(CommentReaction.commentId, Comments.id)
            )
          ),
        })
        .from(Comments)
        .where(
          and(
            eq(Comments.videoId, videoId),
            parentId ? eq(Comments.parentId,parentId) : isNull(Comments.parentId),
         
            cursor
              ? or(
                  lt(Comments.updatedAt, cursor.updatedat),
                  and(
                    eq(Comments.updatedAt, cursor.updatedat),
                    lt(Comments.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .innerJoin(users, eq(users.id, Comments.userId))
        .leftJoin(viewerReactions, eq(viewerReactions.commentId, Comments.id))
        .leftJoin(creatorlikes, eq(creatorlikes.commentId, Comments.id))
        .leftJoin(replies,eq(Comments.id,replies.parentId))
        .orderBy(desc(Comments.updatedAt), desc(Comments.id))
        .limit(limit + 1);

      const hasmore = data.length > limit;
      const items = hasmore ? data.slice(0, -1) : data;
      const lastitem = items[items.length - 1];
      const nextcursor = hasmore
        ? {
            id: lastitem.id,
            updatedat: lastitem.updatedAt,
          }
        : null;

      return {
        totalcount: totaldata.count,
        creatorImageUrl: creatorimageurl,
        items,
        nextcursor,
        videoOwner: videoOwnerResult
      };
    }),
});
