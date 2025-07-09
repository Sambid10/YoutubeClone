"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}
import { useSidebarStore } from "@/zustand/useIconSidebar";
import SearchCards from "../Components/SearchCard";
import UserSearchCards from "../Components/UserSearchCards";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";
import SearchLoader from "@/modules/SearchLoader";
import { Loader2 } from "lucide-react";
export const ResultSection = ({ categoryId, query }: PageProps) => {
  const { openSideBar } = useSidebarStore();
  return (
    <Suspense fallback={<SearchLoader/>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <div
          className={cn(
            `mb-4 w-full  pt-2 flex flex-col gap-y-6 relative justify-center`,
            {
              "lg:w-[80%] ": openSideBar === "main",
              "w-[100%]": openSideBar === "icon",
            }
          )}
        >
          <ResultSectionSuspense categoryId={categoryId} query={query} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
const ResultSectionSuspense = ({ categoryId, query }: PageProps) => {
  const { openSideBar } = useSidebarStore();
  const trpc = useTRPC();
  const searchquery = useSuspenseInfiniteQuery(
    trpc.search.getMany.infiniteQueryOptions(
      {
        limit: 5,
        categoryId: categoryId,
        query: query,
      },
      {
        getNextPageParam: (oldpage) => oldpage.nextCursor,
      }
    )
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = searchquery;
  const usersearchquery = useSuspenseInfiniteQuery(
    trpc.User.getMany.infiniteQueryOptions(
      {
        limit: 5,
        query: query,
      },
      {
        getNextPageParam: (oldpage) => oldpage.nextCursor,
      }
    )
  );
const { data:usersearchdata,fetchNextPage:userfetchNextPage,hasNextPage:userhasNextPage,isFetchingNextPage:userisFetchingNextPage} = usersearchquery
  return (
    <div
      className={cn("px-4 ", {
        "lg:ml-28 ": openSideBar === "icon",
      })}
    >
     {usersearchdata.pages.flatMap((page) =>
        page.items.map((userdata,i) => (
           <div key={i}>
      <UserSearchCards data={userdata}/>
    </div>
        ))
      )}
      {userhasNextPage && 
       <InfiniteScroll
        fetchNextPage={userfetchNextPage}
        hasNextPage={userhasNextPage}
        isFetchingNextPage={userisFetchingNextPage}
        isManual={true}
        message="You have reached the end of the list.."
      />
      }
       
      {data.pages.flatMap((page) =>
        page.items.map((data) => (
          <div key={data.id} className="">
            <SearchCards data={data} />
          </div>
        ))
      )}
      <InfiniteScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isManual={false}
        message="You have reached the end of the list.."
      />
    </div>
  );
};
