"use client";
import CommentForm from "@/modules/Comments/ui/Comment-Form";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Loader2,
} from "lucide-react";

import InfinteSroll from "@/components/InfinteSrcoll/InfinteSroll";
import CommentItem from "./CommentItem";
export const CommentsSection = ({ videoId }: { videoId: string }) => {
  if (!videoId) return null;
  return (
    <div>
      <Suspense
        fallback={
          <span>
            <Loader2 className="animate-spin mx-auto mt-2  size-5 text-[#ff0000] " />
          </span>
        }
      >
        <ErrorBoundary fallback={<p>Error</p>}>
          <CommentsSuspense videoId={videoId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

const CommentsSuspense = ({ videoId }: { videoId: string }) => {
  const trpc = useTRPC();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.Comments.getMany.infiniteQueryOptions(
        {
          limit: 5,
          videoId: videoId,
        },
        {
          getNextPageParam: (lastpage) => lastpage.nextcursor,
        }
      )
    );
 const querykey=trpc.Comments.getMany.queryKey()
const owner = data.pages[0].videoOwner[0]?.user;
const videoOwnerImg = owner?.imageUrl;  
const videoOwnerId  = owner?.id;        
    console.log("From main",querykey)
    {isFetchingNextPage && <Loader2 className="text-[#ff0000] animate-spin"/>}
  return (
    <div className="w-full lg:w-[98%] xl:w-[96%]">
      <h1>{data.pages[0].totalcount} Comments</h1>
      <div>
        <CommentForm
          variant={"comment"}
          videoId={videoId}
        />
      </div>
      {data.pages.flatMap((page) =>
        page.items.map((comment) => 
          <CommentItem  variant="comment" videoId={videoId} videoOwner={videoOwnerImg} videoownerid={videoOwnerId} comment={comment} key={comment.id}/>
        )
      )}

      <InfinteSroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isManual={false}
        message="No more comments..."
      />
    </div>
  );
};
