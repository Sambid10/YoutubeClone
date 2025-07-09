import React from "react";
import Skeleton from "./Skeleton";

function SuggestionSkeleton() {
  return (
    <div className="flex mt-2 lg:flex-row flex-col gap-3">
      <div className="w-full">
        <Skeleton className="aspect-[16/9]" />
      </div>
      <div className="w-full mt-1">
        <div className="flex flex-col gap-2">
          <div>
            <Skeleton className="h-4" />
          </div>
          <div>
            <Skeleton className="h-3" />
          </div>
          <div className="flex gap-2 w-[50%]">
            <div className="w-full">
              <Skeleton className="h-2" />
            </div>
            <div className="w-full">
              <Skeleton className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuggestionSkeletonList() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <SuggestionSkeleton key={index} />
      ))}
    </div>
  );
}
