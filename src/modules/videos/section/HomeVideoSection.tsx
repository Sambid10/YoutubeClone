"use client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../ui/VideoPlayer";
import VideoTopRow from "../components/VideoTopRow";
import { useAuth } from "@clerk/nextjs";
import VideoSkeleton from "../VideoSkeleton";
export const HomeVideoSection = ({ videoId }: { videoId: string }) => {
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <ErrorBoundary fallback={<p>ERRor</p>}>
        <HomeVideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const HomeVideoSectionSuspense = ({ videoId }: { videoId: string }) => {
  const queryclient = useQueryClient();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.video.getOne.queryOptions({
      videoId: videoId,
    })
  );
  const createview = useMutation(
    trpc.videoviews.create.mutationOptions({
      onSuccess: () => {
        queryclient.invalidateQueries(
          trpc.video.getOne.queryOptions({
            videoId: videoId,
          })
        );
        queryclient.invalidateQueries(
          trpc.playlist.getHistory.infiniteQueryOptions({
            limit: 10,
          })
        );
      },
    })
  );
  const { isSignedIn } = useAuth();

  const handlePlay = () => {
    if (!isSignedIn) return;
    createview.mutate({ videoId: videoId });
  };
  return (
    <div className="">
      <div
        className={cn(
          "aspect-[16/9]  relative rounded-lg bg-black overflow-hidden  flex items-center justify-center",
          data.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoplay={true}
          onPlay={handlePlay}
          playbackId={data.muxPlaybackId}
          thumbnailUrl={data.thumbnailUrl}
        />
      </div>
      <VideoTopRow video={data} />
    </div>
  );
};
