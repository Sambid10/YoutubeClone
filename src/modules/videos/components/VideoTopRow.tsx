import React from "react";
import { videoGetOneOutput } from "../types/types";
import VideoOwner from "./VideoOwner";
import VideoReaction from "./VideoReaction";
import VideoDescription from "./VideoDescription";
interface Props {
  video: videoGetOneOutput;
}
import VideoDropDown from "./VideoDropDown";
export default function VideoTopRow({ video }: Props) {
  return (
    <div className="flex flex-col gap-2.75  ">
      <div className="font-semibold text-xl mt-2.75">{video.title}</div>
      <div className="flex flex-col sm:flex-row gap-2.75 ">
        <VideoOwner  user={video.user} videoId={video.id} />
        <div className="sm:ml-auto">
          <div className="flex gap-2.75 items-center">
            <VideoReaction 
            videoId={video.id}
            likecount={video.likecount}
            dislikecount={video.dislikecount}
            viewerReaction={video.viewerReaction}
            />
            <VideoDropDown video={video}/>
          </div>
        </div>
      </div>
      <VideoDescription video={video} user={video.user}/>
    </div>
  );
}
