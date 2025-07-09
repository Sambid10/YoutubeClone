export const dynamic= "force-dynamic"

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import TrendingVideoView from "@/modules/Home/views/TrendingVideoView";
export const metadata: Metadata = {
  title: "Trending",
};
import { Metadata } from "next";
export default async function page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.video.getTrending.infiniteQueryOptions({
            limit:10
    },{
        getNextPageParam:(oldpage)=>oldpage.nextCursor
    })
  );
  

  return (
    <HydrateClient>
      <TrendingVideoView />
    </HydrateClient>
  );
}
