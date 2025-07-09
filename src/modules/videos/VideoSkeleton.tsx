import React from "react";
import Skeleton from "../Skeleton";
export default function VideoSkeleton() {
  return (
    <div className="flex flex-col gap-2.75 w-[100%]">
      <Skeleton className="aspect-[16/9]" />
      <div className="flex flex-col gap-2.75">
        <div>
          <Skeleton className="h-7 w-[60%]" />
        </div>
        <div>
          <div className="flex flex-col gap-2.75 lg:flex-row justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2.75">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-32 " />
                    <Skeleton className="h-3 w-24 " />
                  </div>
                  <div>
                     <Skeleton className="h-10 w-32 rounded-full " />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div>
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 w-[100%]">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
