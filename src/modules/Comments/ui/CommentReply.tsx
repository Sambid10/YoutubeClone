"use client";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { Loader2 } from "lucide-react";

import InfinteSroll from "@/components/InfinteSrcoll/InfinteSroll";

import CommentItem from "@/modules/videos/section/CommentItem";
export default function CommentReply({
  parentId,
  videoId,
}: {
  parentId?: string;
  videoId: string;
}) {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      trpc.Comments.getMany.infiniteQueryOptions(
        {
          limit: 5,
          videoId: videoId,
          parentId: parentId,
        },
        {
          getNextPageParam: (lastpage) => lastpage.nextcursor,
        }
      )
    );
  return (
    <>
      <div className="">
        {isLoading && (
          <div>
            <Loader2 className="animate-spin text-[#ff0000]  mx-auto  size-5" />
          </div>
        )}
      </div>
      {!isLoading &&
        data?.pages.flatMap((page) =>
          page.items.map((comment) => (
            <CommentItem
            parentId={parentId}
              key={comment.id}
              variant="reply"
              comment={comment}
              videoId={videoId}
            />
          ))
        )}

      <InfinteSroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        message=""
        isManual={true}
      />
    </>
  );
}
