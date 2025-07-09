"use client";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import React from "react";
import { cn } from "@/lib/utils";
import { LikeVideoSection } from "../section/LikeVideoSection";

export default function LikeVideoView() {
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
          </div>
          <LikeVideoSection/>
        </div>
      </div>
    </div>
  );
}
