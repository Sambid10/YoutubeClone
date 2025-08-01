import React from "react";
import { HomeVideoSection } from "../section/HomeVideoSection";
import { CommentsSection } from "../section/CommentsSection";
import SuggestionSection from "../section/SuggestionSection";
export default function HomeVideoView({ videoId }: { videoId: string }) {
  return (
    <div className="py-2 px-4 mb-10 w-full relative">
      <div className="grid grid-cols-12 gap-4">
        {/* VIDEO SECTION */}
        <div className="lg:col-span-8 xl:col-span-9 xl:w-[96%] col-span-12 w-full order-1 lg:order-none h-fit ">
          <HomeVideoSection videoId={videoId} />
        </div>
        <div className="lg:col-span-8 text-[22px] font-semibold xl:col-span-9 col-span-12 w-full order-3 lg:order-none  ">
          <CommentsSection videoId={videoId}/>
        </div>

        {/* SUGGESTIONS */}
        <div className="font-semibold  text-[22px] col-span-12 lg:col-span-4 xl:col-span-4 xl:-ml-12    order-2 lg:order-none  lg:absolute lg:top-0 lg:right-6 lg:w-[30%] xl:w-[26%]">
          <SuggestionSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
