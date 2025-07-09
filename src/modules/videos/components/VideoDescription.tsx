import React, { useState } from "react";
import { videoGetOneOutput } from "../types/types";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import VideoOwner from "./VideoOwner";
import { useRouter } from "next/navigation";
import LinkifyDescription from "@/utils/Linkify/LinkifyDescription";

export default function VideoDescription({
  video,
  user,
}: {
  video: videoGetOneOutput;
  user: videoGetOneOutput["user"];
}) {
  
  const [isExpanded, setisExpanded] = useState(false);
  const expandeddate = formatDate(video.createdAt, "dd MMMM yyyy");
  const notexpandeddate = formatDistanceToNowStrict(video.createdAt, {
    addSuffix: true,
  });

  return (
    <div
      onClick={() => !isExpanded && setisExpanded(true)}
      className={`w-full h-24 ${
        isExpanded
          ? "h-fit cursor-default"
          : "w-24 overflow-hidden cursor-pointer"
      } flex flex-col border border-gray-200 gap-0.5 rounded-md px-3 py-2 bg-gray-100`}
    >
      <div className="flex gap-2 text-sm font-semibold items-center">
        <h1 className="tracking-tight">{video.videocount} views</h1>
        <h1 className="tracking-tight">
          {isExpanded ? expandeddate : notexpandeddate}
        </h1>
      </div>
      <div className={`text-sm text-gray-800 ${!isExpanded && "line-clamp-3"  }`}>
        {video.description?.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            <LinkifyDescription>
            {line}
            </LinkifyDescription>
            
            <br />
          </React.Fragment>
        ))}
        
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-2.75">
          <button
            onClick={() => setisExpanded(false)}
            className="text-blue-600 w-fit cursor-pointer pr-2 py-2"
          >
            <h1 className="text-sm text-left mt-2 font-medium">Show less</h1>
          </button>
          <VideoOwner user={user} videoId={video.id} showButton={false} />
        </div>
      )}
    </div>
  );
}
