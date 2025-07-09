export const dynamic= "force-dynamic"

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import SubscriptionVideoView from "@/modules/Home/views/SubscriptionVideoView";
export const metadata: Metadata = {
  title: "Youtube",
};
import { Metadata } from "next";
export default async function page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.video.getManySubscribed.infiniteQueryOptions({
            limit:10
    },{
        getNextPageParam:(oldpage)=>oldpage.nextCursor
    })
  );
  

  return (
    <HydrateClient>
      <SubscriptionVideoView />
    </HydrateClient>
  );
}
