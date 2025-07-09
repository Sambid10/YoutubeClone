export const dynamic = "force-dynamic";
import { HydrateClient, trpc } from '@/trpc/server'
import { getQueryClient } from '@/trpc/server';
import React from 'react'
import StudioView from '@/modules/Studio/view/StudioView';
export default async function page() {
   const queryclient = getQueryClient();
    void queryclient.prefetchInfiniteQuery(
      trpc.stuido.getMany.infiniteQueryOptions({
        limit:5
      })
    );
  return (
    <HydrateClient>
      <StudioView/>
    </HydrateClient>
  )
}
