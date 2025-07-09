"use client";
import React from "react";
import CommentForm from "@/modules/Comments/ui/Comment-Form";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import CommentDeleteDialog from "@/modules/Comments/Dialog/DeleteCommentDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import {
  AiFillDislike,
  AiFillLike,
  AiTwotoneDislike,
  AiTwotoneLike,
} from "react-icons/ai";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import CommentReply from "@/modules/Comments/ui/CommentReply";
import { ChevronDown, ChevronUp, MoreVertical, Trash } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { commentGetManyOutput } from "../types/types";
import { useTRPC } from "@/trpc/client";

export default function CommentItem({
  comment,
  videoId,
  variant = "comment",
  parentId,
  videoOwner,
}: {
  comment: commentGetManyOutput[number];
  videoId: string;
  variant: "comment" | "reply";
  parentId?: string;
  videoOwner?: string;
  videoownerid?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const clerk = useClerk();

  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const [expandedcommentreplyform, setexpandedcommentreplyform] = useState<
    Record<string, boolean>
  >({});

  const [expandedcommentreply, setexpandedcommentreply] = useState<
    Record<string, boolean>
  >({});

  const toggleShowMore = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const isValidReaction = (r: any): r is "like" | "dislike" =>
    r === "like" || r === "dislike";

  const likereaction = useMutation(
    trpc.CommentReaction.create.mutationOptions({
      onMutate: async ({ commentId }) => {
        const queryKey = trpc.Comments.getMany.infiniteQueryOptions({
          videoId,
          limit: 5,
          parentId,
        }).queryKey;
        const prevdata = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (oldData: typeof prevdata) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((comment) => {
                if (comment.id === commentId) {
                  const prevReaction: "like" | "dislike" | null =
                    isValidReaction(comment.viewerReactions)
                      ? comment.viewerReactions
                      : null;

                  const newViewerReaction: "like" | null =
                    prevReaction === "like" ? null : "like";

                  return {
                    ...comment,
                    likecount:
                      comment.viewerReactions === "like"
                        ? comment.likecount - 1
                        : comment.likecount + 1,
                    dislikecount:
                      comment.viewerReactions === "dislike"
                        ? comment.dislikecount - 1
                        : comment.dislikecount,
                    viewerReactions: newViewerReaction,
                    likedByCreator:comment.likedByCreator && true
                  };
                }
                return comment;
              }),
            })),
          };
        });

        return { prevdata, queryKey };
      },
      onSuccess: (error, _vars, ctx) => {
        if (ctx?.prevdata && ctx?.queryKey) {
          queryClient.invalidateQueries(trpc.Comments.getMany.infiniteQueryOptions({
            limit:5,
            videoId:videoId,
          }));
        }
      },
      onError: (error, _vars, ctx) => {
        if (ctx?.prevdata && ctx?.queryKey) {
          queryClient.setQueryData(ctx.queryKey, ctx.prevdata);
        }

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    })
  );

  const dislikereaction = useMutation(
    trpc.CommentReaction.remove.mutationOptions({
      onMutate: async ({ commentId }) => {
        await queryClient.cancelQueries();
        const prevdata = queryClient.getQueryData(
          trpc.Comments.getMany.infiniteQueryOptions({
            limit: 5,
            videoId: videoId,
            parentId,
          }).queryKey
        );
        queryClient.setQueryData(
          trpc.Comments.getMany.infiniteQueryOptions({
            limit: 5,
            videoId: videoId,
            parentId,
          }).queryKey,
          (oldata: typeof prevdata) => {
            if (!oldata) return oldata;
            return {
              ...oldata,
              pages: oldata.pages.map((page) => ({
                ...page,
                items: page.items.map((comment) => {
                  if (comment.id === commentId) {
                    const prevReaction: "like" | "dislike" | null =
                      isValidReaction(comment.viewerReactions)
                        ? comment.viewerReactions
                        : null;
                    const newViewerReaction: "dislike" | null =
                      prevReaction === "dislike" ? null : "dislike";
                    return {
                      ...comment,
                      likecount:
                        comment.viewerReactions === "like"
                          ? comment.likecount - 1
                          : comment.likecount,
                      dislikecount:
                        comment.viewerReactions === "dislike"
                          ? comment.dislikecount - 1
                          : comment.dislikecount + 1,
                      viewerReactions: newViewerReaction,
                      likedByCreator: false,
                    };
                  }
                  return comment;
                }),
              })),
            };
          }
        );
        return { prevdata };
      },
      onError: (error, variables, context) => {
        if (context?.prevdata) {
          queryClient.setQueryData(
            trpc.Comments.getMany.infiniteQueryOptions({
              videoId,
              parentId,
              limit: 5,
            }).queryKey,
            context.prevdata
          );
        }
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    })
  );

  const handleExpandReplyForm = (commentid: string) => {
    setexpandedcommentreplyform((prev) => ({
      ...prev,
      [commentid]: !prev[commentid],
    }));
  };
  const handleExpandReply = (commentid: string) => {
    setexpandedcommentreply((prev) => ({
      ...prev,
      [commentid]: !prev[commentid],
    }));
  };
  const isExpanded = expandedComments[comment.id];
  const commentText = comment.commentinfo;
  const ShowMoreButton = commentText.length > 200;
  return (
    <div
      key={comment.id}
      className={`flex flex-col w-full gap-4 text-gray-900 ${
        variant === "comment" && "pt-4"
      } pt-2`}
    >
      <div className="flex flex-row w-full group gap-4">
        <div
          className={`${variant === "comment" && "h-10 w-10"} w-8 h-8 shrink-0`}
        >
          <UserAvatar
            className="border-none"
            imageUrl={comment.user.imageUrl}
          />
        </div>
        <div className="flex flex-col  w-full gap-[3.2px] justify-start">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-[500] -mt-[1px] text-black">
              {comment.user.name}
            </h1>
            <h1 className="text-[12px] font-normal text-gray-600">
              •{" "}
              {formatDistanceToNowStrict(comment.createdAt, {
                addSuffix: true,
              })}
            </h1>
          </div>
          <span className="text-sm font-[450] ">
            <h1 className="tracking-normal whitespace-pre-line">
              {isExpanded ? commentText : commentText.slice(0, 200)}
            </h1>
            {ShowMoreButton && (
              <button
                className="text-blue-500 mt-2 cursor-pointer text-[13px] font-semibold"
                onClick={() => toggleShowMore(comment.id)}
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? "Show less" : "Read more..."}
              </button>
            )}

            <div className="flex items-center gap-3 mt-[3px]">
              <Button
                // disabled={likereaction.isPending || dislikereaction.isPending}
                onClick={() => likereaction.mutate({ commentId: comment.id })}
                className="hover:bg-gray-200 bg-transparent  gap-1 cursor-pointer -ml-1 h-8 w-8 flex items-center justify-center rounded-full"
                title="like"
              >
                {comment.viewerReactions === "like" ? (
                  <AiFillLike color="#121212" className="size-5" />
                ) : (
                  <AiTwotoneLike color="black" className="size-5" />
                )}
              </Button>
              <h1 className="-ml-3.5 text-[13px]">{comment.likecount}</h1>
              <Button
                // disabled={
                //   likereaction.isPending || dislikereaction.isPending
                // }
                onClick={() =>
                  dislikereaction.mutate({ commentId: comment.id })
                }
                title="dislike"
                className="hover:bg-gray-200 gap-1 bg-transparent cursor-pointer -ml-1 h-8 w-8 flex items-center justify-center rounded-full"
              >
                {comment.viewerReactions === "dislike" ? (
                  <AiFillDislike color="#121212" className="size-5" />
                ) : (
                  <AiTwotoneDislike color="black" className="size-5" />
                )}
              </Button>
              <h1 className="text-[13px] -ml-3.5">{comment.dislikecount}</h1>

              {comment.likedByCreator && (
                <AllTooltip
                  className="opacity-95"
                  content={`\u2665  by the creator `}
                >
                  <div className="h-[29px] w-[29px] ml-0  border-b border-b-black border-t p-[1px] border-t-gray-300 border-r border-gray-400 border-l border-l-gray-500 rounded-full">
                    <UserAvatar
                      imageUrl={videoOwner!}
                      className="border-none"
                      showHeart
                    />
                  </div>
                </AllTooltip>
              )}

              <button
                onClick={() => handleExpandReplyForm(comment.id)}
                className={`${
                  variant === "comment" ? "block" : "hidden"
                } hover:bg-gray-200 rounded-xl px-3 py-1 cursor-pointer text-center flex items-center`}
                title="reply"
              >
                <h1 className="text-black  text-[13px] font-semibold">Reply</h1>
              </button>
            </div>
          </span>
          <div className="w-full">
            {expandedcommentreplyform[comment.id] && (
              <div className="w-[100%]">
                <CommentForm
                  parentId={comment.id}
                  videoId={comment.videoId}
                  variant="reply"
                />
              </div>
            )}
          </div>
          <div>
            {comment.replycount > 0 && (
              <button
                onClick={() => handleExpandReply(comment.id)}
                className="text-blue-600 ease-in duration-100 transition-colors hover:bg-blue-50 rounded-full py-1.5 -mt-1 pl-2 pr-4 flex items-center gap-2 text-[14px] cursor-pointer"
              >
                {expandedcommentreply[comment.id] ? (
                  <ChevronUp className="size-5" />
                ) : (
                  <ChevronDown className="size-5" />
                )}
                {comment.replycount}{" "}
                {comment.replycount === 1 ? "reply" : "replies"}
              </button>
            )}
            {expandedcommentreply[comment.id] && (
              <CommentReply parentId={comment.id} videoId={comment.videoId} />
            )}
          </div>
        </div>

        <div className="ml-auto hover:bg-gray-200 rounded-full h-fit p-1.5">
          {userId === comment.user.clerkId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="size-5 text-gray-800" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <CommentDeleteDialog
                  parentId={parentId}
                  commentId={comment.id}
                  videoId={comment.videoId}
                >
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault(); // prevent Dropdown from closing
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <h1>
                        <Trash className="size-4 text-red-500" />
                      </h1>
                      <h1>Delete</h1>
                    </div>
                  </DropdownMenuItem>
                </CommentDeleteDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
