"use client"
import { TrendingSection } from "../section/TrendingSection";
import React from "react";
export default function TrendingVideoView() {
  return (
    <div>
      <div className=" flex flex-col w-screen  relative min-h-[calc(100dvh-64px)] overflow-x-clip ">
       
        <div className="mt-2">
          <TrendingSection />
        </div>
      </div>
    </div>
  );
}
