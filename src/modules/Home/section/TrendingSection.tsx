"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";
import HomeFeedGrid from "../Components/HomeFeedGrid";
import HomeFeedSkeleton from "@/modules/HomeFeedSkeleton";
import { ImFire } from "react-icons/im";

export const TrendingSection = () => {
  const { openSideBar } = useSidebarStore();
  return (
    <Suspense fallback={<HomeFeedSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <div
          className={cn(
            `mb-4 w-full  pt-2 flex flex-col gap-y-6 relative justify-center`,
            {
              "lg:w-[80%] ": openSideBar === "main",
              "w-[100%] ": openSideBar === "icon",
            }
          )}
        >
          <div className={cn("px-4", {
              "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
            })}>
            <h1 className="text-4xl font-semibold ">Trending </h1>
            <p className="text-md mt-2 text-gray-600">
             Most popular videos..
            </p>
          </div>
          <TrendingSectionSuspense />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
const TrendingSectionSuspense = () => {
  const { openSideBar } = useSidebarStore();
  const trpc = useTRPC();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.video.getTrending.infiniteQueryOptions(
        {
          limit: 10,
        },
        {
          getNextPageParam: (oldpage) => oldpage.nextCursor,
        }
      )
    );
  const flatteddata = data.pages.flatMap((page) => page.items);
  return (
    <div
      className={cn("px-4 ", {
        "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
      })}
    >
      <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-5  w-full">
        {flatteddata.map((data) => (
          <HomeFeedGrid key={data.id} data={data} />
        ))}
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
