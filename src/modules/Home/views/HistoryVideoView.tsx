"use client";
import { HistorySection } from "../section/HistorySection";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import React from "react";
import { cn } from "@/lib/utils";

export default function HistoryVideoView({
  query,
}: {
  query: string | undefined;
}) {
  const { openSideBar } = useSidebarStore();
  return (
    <div>
      <div className=" flex flex-col w-screen  relative min-h-[calc(100dvh-64px)] overflow-x-clip ">
        <div className="mt-2">
          <div
            className={cn("pl-4 sm:pl-10  md:pl-16 lg:px-4", {
              "lg:ml-28 lg:mr-4 ": openSideBar === "icon",
            })}
          >
            <h1 className="text-4xl font-semibold ">History </h1>
            <p className="text-md mt-2 text-gray-600">Today</p>
          </div>
          <HistorySection query={query} />
        </div>
      </div>
    </div>
  );
}
