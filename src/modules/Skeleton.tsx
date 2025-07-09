import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
export function SkeletonCard() {
  return (
    <>
      <div className="flex items-center justify-between h-[69.5px] border-b border-b-gray-400 w-full px-6">
        <div className="flex flex-col items-center space-y-3  ">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-3 w-[160px]" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5  ">
        <div className="space-y-5 lg:col-span-3 px-6 py-4">
          {[...Array(3)].map((_, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <Skeleton className="w-[80px] h-[15px] rounded-sm" />
              <Skeleton className="w-full h-10" />
            </div>
          ))}
           <Skeleton className="w-full aspect-[16/9] max-w-sm" />
        </div>
        <div className="w-full lg:col-span-2 pr-6 pl-6 mt-6">
            <Skeleton className="w-full h-[62vh]" />
        </div>
      </div>
    </>
  );
}

export default Skeleton;
