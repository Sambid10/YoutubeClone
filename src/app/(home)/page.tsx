export const dynamic="force-dynamic"
import HomeView from "@/modules/Home/views/HomeView";
import { getQueryClient, HydrateClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";

interface SearchParmas{
  searchParams:Promise<{
    categoryId?:string
  }>
}
export default async function Home({searchParams}:SearchParmas) {
  const {categoryId}=await searchParams
  const queryclient = getQueryClient();
  void queryclient.prefetchQuery(
    trpc.categories.getMany.queryOptions()
  );
  void queryclient.prefetchInfiniteQuery(
    trpc.video.getMany.infiniteQueryOptions({
      limit:10
    })
  )
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
