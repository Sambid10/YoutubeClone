"use client"
import { SubscriptionSection } from "../section/SubscriptionSection";
import React from "react";
export default function SubsriptionVideoView() {
  return (
    <div>
      <div className=" flex flex-col w-screen  relative min-h-[calc(100dvh-64px)] overflow-x-clip ">
       
        <div className="mt-2">
          <SubscriptionSection />
        </div>
      </div>
    </div>
  );
}
