export const dynamic= "force-dynamic"

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import React from "react";
interface Props {
  params: Promise<{
    videoId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Youtube",
};
import HomeVideoView from "@/modules/videos/views/HomeVideoView";
import { Metadata } from "next";
export default async function page({ params }: Props) {
  const { videoId } = await params;
  const singlevideoId = videoId[0];
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.video.getOne.queryOptions({
      videoId: singlevideoId,
    })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.Comments.getMany.infiniteQueryOptions({
      videoId:singlevideoId,
      limit:5,
    })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.Suggestion.getMany.infiniteQueryOptions({
      videoId:singlevideoId,
      limit:7
    })
  )

  return (
    <HydrateClient>
      <HomeVideoView videoId={singlevideoId} />
    </HydrateClient>
  );
}
