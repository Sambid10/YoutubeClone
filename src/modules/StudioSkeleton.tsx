import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StudioSkeleton() {
  return (
    <div className="w-full space-y-4 -mx-2">
      <div className="h-10 border-b px-4 border-gray-400 gap-4 grid grid-cols-[8fr_1fr_1fr_1fr_1fr] items-center">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-8 w-full" />
        ))}
      </div>

      {[...Array(5)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid px-4 grid-cols-[8fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center border-b  border-gray-300 pb-4"
        >
          <div className="h-[74px] gap-4 w-full flex items-center">
            <Skeleton className="h-[74px] w-38" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-2 w-24" />
            </div>
          </div>

          {[...Array(6)].map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
