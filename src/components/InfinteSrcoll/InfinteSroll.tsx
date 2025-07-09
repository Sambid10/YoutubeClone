"use client";

import React, { useEffect } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { Button } from "../ui/button";
import { ArrowDown, Loader2 } from "lucide-react";

interface Props {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  message: string;
}

export default function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  message,
  isManual = false,
}: Props) {
  const { targetRef, isintersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  // auto-load on intersection
  useEffect(() => {
    if (isintersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [isintersecting, hasNextPage, isFetchingNextPage, isManual, fetchNextPage]);

  return (
    <div className="flex flex-col -mt-6 -ml-2">
      {/* invisible sentinel for the IntersectionObserver */}
      <div ref={targetRef} className="h-1 " />

      {/* ─────────────── MANUAL (“See more” button) ─────────────── */}
      {isManual && hasNextPage && (
        <div className="relative flex justify-center mt-4">
          <div className="absolute top-1/2 left-1/2 h-[0.5px] w-full -translate-x-1/2 -translate-y-1/2 bg-gray-300" />
          <Button
            variant="secondary"
            className="relative z-10 h-8  w-[50%] rounded-full border border-gray-300 bg-gray-50 p-0 text-black hover:bg-gray-200 disabled:opacity-100 md:w-[40%] xl:w-[50%]"
            disabled={isFetchingNextPage}
            onClick={fetchNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin text-[#ff0000] " />
            ) : ( 
              <span className="flex items-center gap-4">
                <span>See more</span>
                <ArrowDown className="size-4" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* ─────────────── AUTO (spinner only) ─────────────── */}
      {!isManual && hasNextPage && isFetchingNextPage && (
        <Loader2 className="mx-auto animate-spin text-[#ff0000] " />
      )}

      {/* ─────────────── NO MORE PAGES ─────────────── */}
      {!hasNextPage && (
        <p className="mt-12 text-center text-xs text-gray-600 italic">{message}</p>
      )}
    </div>
  );
}
