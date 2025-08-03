"use client";
import { videoGetmanyOuput } from "@/modules/videos/types/types";
import React from "react";
import Link from "next/link";
import VideoThumbnail from "@/modules/videos/ui/VideoThumbnail";
import { formatDistanceToNowStrict } from "date-fns";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import { cn } from "@/lib/utils";
export default function HomeFeedGrid({
  data,
}: {
  data: videoGetmanyOuput["items"][number];
}) {
  return (
    <div className="relative">
      <Link
        prefetch
        href={`/video/${data.id}`}
        className={cn("flex flex-col w-full relative z-40 pb-2.5")}
      >
        <VideoThumbnail
          Classname="w-full h-full aspect-[16/9] "
          thumbnailUrl={data.thumbnailUrl}
          videopreviewUrl={data.previewvideoUrl}
          duration={data.vidduration ?? 0}
        />
      </Link>
      <div className="flex flex-col w-full text-black">
        <div className="flex items-start gap-2.5 ">
          <Link
            href={`/user/${data.user.id}`}
            className="cursor-pointer relative  lg:h-11 lg:w-11 h-9 w-9 rounded-full"
          >
            <div className=" relative  cursor-pointer">
              <UserAvatar
                className="border-none"
                imageUrl={data.user.imageUrl}
              />
            </div>
          </Link>

          <div className="flex flex-col w-full  ">
            <Link href={`/video/${data.id}`}>
              <h1
                style={{ lineHeight: "110%" }}
                className="font-semibold line-clamp-2  text-[17px] lg:text-[16px] text-[	#36454F]    w-full"
              >
                {data.title}
              </h1>
              <h1
                style={{ lineHeight: "110%" }}
                className="line-clamp-2 mt-1.5  text-[12px] lg:text-[12.5px] "
              >
                {data.user.name}
              </h1>
              <div className="flex flex-row gap-1 tracking-normal font-[400] items-center mt-[1px]">
                <h1
                  style={{ lineHeight: "110%" }}
                  className="line-clamp-2 text-[12px] lg:text-[12.5px] "
                >
                  {data.viewcount} views
                </h1>
                <h1 className="line-clamp-2  text-[12px] lg:text-[12.5px]  ">
                  •{" "}
                  {formatDistanceToNowStrict(new Date(data.createdAt), {
                    addSuffix: true,
                  })}
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
