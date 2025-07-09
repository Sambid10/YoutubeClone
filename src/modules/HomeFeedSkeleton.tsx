import React from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import Skeleton from "./Skeleton";

export default function HomeFeedSkeleton() {
  const { openSideBar } = useSidebarStore();

  return (
    <div
      className={cn(
        `mb-4 w-full px-4 pt-2 flex  flex-col gap-y-6  relative justify-center`,
        {
          "lg:w-[80%]": openSideBar === "main",
          "w-[100%] ": openSideBar === "icon",
        }
      )}
    >
      <div className="grid  sm:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-5 w-full">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-full w-full flex flex-col gap-2">
              <Skeleton className="aspect-video" />

              <div className="flex gap-2 h-full">
                <div className="min-w-fit">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex flex-col h-full w-full gap-1">
                  <Skeleton className="h-3 mt-1 w-[80%]" />
                  <Skeleton className="h-2 mt-[5px] w-[40%]" />
                  <div className="flex gap-1">
                    <Skeleton className="h-1.5 w-[10%]" />
                    <Skeleton className="h-1.5 w-[20%]" />
                  </div>
                </div>
              </div>

              <div></div>
            </div>
          ))}
      </div>
    </div>
  );
}
