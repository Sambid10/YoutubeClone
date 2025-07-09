import { db } from "@/db";
import { CommentReaction } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import * as z from "zod";
export const CommentReactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
     
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;
      const [existingcommentreaction] = await db
        .select()
        .from(CommentReaction)
        .where(
          and(
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.commentId, commentId),
            eq(CommentReaction.reactionType, "like")
          )
        );
      if (existingcommentreaction) {
        const [deletedviewerreaction] = await db
          .delete(CommentReaction)
          .where(
            and(
              eq(CommentReaction.userId, userId),
              eq(CommentReaction.commentId, commentId)
            )
          )
          .returning();
        return deletedviewerreaction;
      }
      const [createdCommentReaction] = await db
        .insert(CommentReaction)
        .values({
          userId: userId,
          commentId: commentId,
         
          reactionType: "like",
        })
        .onConflictDoUpdate({
          target: [CommentReaction.userId, CommentReaction.commentId],
          set: {
            reactionType: "like",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingcommentreaction] = await db
        .select()
        .from(CommentReaction)
        .where(
          and(
            eq(CommentReaction.commentId, commentId),
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.reactionType, "dislike")
          )
        );
      if (existingcommentreaction) {
        const [deleteCommentReaction] = await db
          .delete(CommentReaction)
          .where(
            and(
              eq(CommentReaction.commentId, commentId),
              eq(CommentReaction.userId, userId)
            )
          )
          .returning();
        return deleteCommentReaction;
      }
      const [createdCommentReaction] = await db
        .insert(CommentReaction)
        .values({
          commentId: commentId,
          userId: userId,
        
          reactionType: "dislike",
        })
        .onConflictDoUpdate({
          target: [CommentReaction.commentId, CommentReaction.userId],
          set: {
            reactionType: "dislike",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
});
