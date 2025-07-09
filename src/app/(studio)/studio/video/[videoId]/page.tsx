export const dynamic = "force-dynamic";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import VideoView from "@/modules/Studio/view/VideoView";
interface Props {
  params: Promise<{ videoId: string }>;
}
export default async function page({ params }: Props) {
  const { videoId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.stuido.getOne.queryOptions({
      id: videoId,
    })
  );
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
