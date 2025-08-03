"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";
import LikeDesignComponent from "../Components/LikeDesignComponent";
import SearchCards from "@/modules/Search/Components/SearchCard";
import SearchLoader from "@/modules/SearchLoader";
import { X } from "lucide-react";

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
  const [hidden, sethidden] = useState(false);
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
  const lengthofdata=flatteddata.length
  return (
    <div
      className={cn("px-4 sm:px-6 md:px-18  lg:px-4", {
        "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
      })}
    >
      <div className="flex xl:flex-row flex-col relative gap-6 lg:gap-6 ">
        <div className="w-[100%] xl:h-[80vh] xl:sticky xl:top-[72px] xl:z-[100] h-fit md:w-[100%] xl:w-[30%]  lg:order-1 order-1">
            <LikeDesignComponent
             totallikedvideos={lengthofdata}
              key={flatteddata[0].id}
              data={flatteddata[0]}
            />
        </div>
        <div className="grid grid-cols-1 order-1 lg:order-2 w-[100%] lg:w-[70%] ">
          <div className="flex flex-col">
            {!hidden && (
              <div className="h-fit flex justify-between shadow-sm bg-gray-100 w-full p-3 rounded-xl mb-2">
                <h1 className="text-sm tracking-wide ">
                  Unavailable videos are hidden
                </h1>
                <button onClick={() => sethidden((prev) => !prev)}>
                  <X className="size-4" />
                </button>
              </div>
            )}

            {flatteddata.map((data) => (
              <div key={data.id} className="h-fit ">
                <SearchCards key={data.id} data={data} />
              </div>
            ))}
          </div>
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
