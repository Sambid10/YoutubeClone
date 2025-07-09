import { getQueryClient, HydrateClient, trpc } from "@/trpc/server"

export const dynamic= "force-dynamic"

interface PageProps{
    searchParams:Promise<{
        query:string | undefined,
        categoryId:string | undefined
    }>
}
import SearchView from "@/modules/Search/ui/view/SearchView"
export default async function page({searchParams}:PageProps) {
    const {categoryId,query}=await searchParams
    const queryClient=getQueryClient()
    void queryClient.prefetchQuery(
      trpc.categories.getMany.queryOptions()
    )
     void queryClient.prefetchInfiniteQuery(
      trpc.search.getMany.infiniteQueryOptions({
        query:query,
        limit:5,
        categoryId:categoryId
      })
    )
     void queryClient.prefetchInfiniteQuery(
      trpc.User.getMany.infiniteQueryOptions({
        query:query,
        limit:5,
      })
    )
  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId}/>
    </HydrateClient>
  )
}
