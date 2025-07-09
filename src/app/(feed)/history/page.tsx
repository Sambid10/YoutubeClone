export const dynamic= "force-dynamic"

import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import HistoryVideoView from "@/modules/Home/views/HistoryVideoView";

interface Props{
    searchParams:Promise<{
        historyquery:string | undefined
    }>
}
export const metadata: Metadata = {
  title: "History",
};
import { Metadata } from "next";
export default async function page({searchParams}:Props) {
    const {historyquery}=await searchParams
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.playlist.getHistory.infiniteQueryOptions({
            limit:9
    },{
        getNextPageParam:(oldpage)=>oldpage.nextCursor
    })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.playlist.getSearchVideo.infiniteQueryOptions({
            limit:9,
            query:historyquery
    },{
        getNextPageParam:(oldpage)=>oldpage.nextCursor
    })
  );
  

  return (
    <HydrateClient>
      <HistoryVideoView query={historyquery}/>
    </HydrateClient>
  );
}
