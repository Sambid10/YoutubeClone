export const dynamic= "force-dynamic"

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import LikeVideoView from "@/modules/Home/views/LikeVideoView";
import React from "react";
export const metadata: Metadata = {
  title: "Liked Videos",
};
import { Metadata } from "next";
export default async function page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.playlist.getLikedVideo.infiniteQueryOptions({
            limit:10
    },{
        getNextPageParam:(oldpage)=>oldpage.nextCursor
    })
  );
  

  return (
    <HydrateClient>
      <LikeVideoView />
    </HydrateClient>
  );
}
