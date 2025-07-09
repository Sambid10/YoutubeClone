"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";
import LikeDesignComponent from "../Components/LikeDesignComponent";
import SearchCards from "@/modules/Search/Components/SearchCard";
import SearchLoader from "@/modules/SearchLoader";

export const LikeVideoSection = () => {
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
          <LikeVideoSectionSuspense />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
const LikeVideoSectionSuspense = () => {
  const { openSideBar } = useSidebarStore();
  const trpc = useTRPC();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.playlist.getLikedVideo.infiniteQueryOptions(
        {
          limit: 9,
        },
        {
          getNextPageParam: (oldpage) => oldpage.nextCursor,
        }
      )
    );
  const flatteddata = data.pages.flatMap((page) => page.items);

  return (
    <div
      className={cn("pl-4 sm:pl-10 md:pl-16 lg:px-4", {
        "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
      })}
    >
      <div className="flex xl:flex-row flex-col  gap-6 lg:gap-6 ">
        <div className="w-[100%] md:w-[90%] xl:w-[30%]  lg:order-1 order-1">
          <LikeDesignComponent/>
        </div>
        <div className="grid grid-cols-1 order-1 lg:order-2 gap-2 w-[100%] sm:w-[90%] lg:w-[70%]">
          {flatteddata.map((data) => (
            <SearchCards key={data.id} data={data} />
          ))}
        </div>
      </div>

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
