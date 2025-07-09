"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";
import HistoryInput from "../Components/HistoryInput";
import SearchCards from "@/modules/Search/Components/SearchCard";
import SearchLoader from "@/modules/SearchLoader";

export const HistorySection = ({ query }: { query: string | undefined }) => {
  const { openSideBar } = useSidebarStore();
  return (
    <Suspense fallback={<SearchLoader />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <div
          className={cn(
            `mb-4 w-full  pt-2 flex flex-col gap-y-6 relative justify-center `,
            {
              "lg:w-[80%] ": openSideBar === "main",
              "w-[100%]": openSideBar === "icon",
            }
          )}
        >
         
          <HistorySectionSuspense query={query} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
const HistorySectionSuspense = ({ query }: { query: string | undefined }) => {
  const { openSideBar } = useSidebarStore();
  const trpc = useTRPC();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.playlist.getHistory.infiniteQueryOptions(
        {
          limit: 9,
        },
        {
          getNextPageParam: (oldpage) => oldpage.nextCursor,
        }
      )
    );
  const flatteddata = data.pages.flatMap((page) => page.items);

  const {
    data: searcheddata,
    fetchNextPage: searchfetchNextPage,
    isFetchingNextPage: searchisFetchingNextPage,
    hasNextPage: searchhasNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.playlist.getSearchVideo.infiniteQueryOptions(
      {
        limit: 9,
        query: query,
      },
      {
        getNextPageParam: (oldpage) => oldpage.nextCursor,
      }
    )
  );
  const searchedflatteddata = searcheddata.pages.flatMap((page) => page.items);
  return (
    <div
      className={cn("pl-4 sm:pl-10  md:pl-16 lg:px-4", {
        "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
      })}
    >
        
      <div className="flex lg:flex-row flex-col  gap-6 lg:gap-2 ">
         <div className="w-[50%] lg:w-[30%]  lg:order-2 order-1">
          <HistoryInput />
        </div>
        {!query && (
          <div className="grid grid-cols-1 order-2 lg:order-1 gap-2 w-[100%] sm:w-[90%] lg:w-[70%]">
            {flatteddata.map((data) => (
              <SearchCards key={data.id} data={data} />
            ))}
          </div>
        )}{" "}
        {query && (
          <div className="grid grid-cols-1 lg:order-1 gap-2 order-2 w-[70%]">
            {searchedflatteddata.map((data) => (
              <SearchCards key={data.id} data={data} />
            ))}
          </div>
        )}
       
      </div>
    {!query && 
       <InfiniteScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isManual={false}
        message="You have reached the end of the list.."
      />
    }
   
      {query && 
       <InfiniteScroll
        fetchNextPage={searchfetchNextPage}
        hasNextPage={searchhasNextPage}
        isFetchingNextPage={searchisFetchingNextPage}
        isManual={false}
        message="You have reached the end of the list.."
      />}
      
    </div>
  );
};
