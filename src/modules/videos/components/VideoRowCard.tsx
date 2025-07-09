import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { videoGetmanyOuput } from "../types/types";
import Link from "next/link";
import VideoThumbnail from "../ui/VideoThumbnail";
import { formatDistanceToNowStrict } from "date-fns";
import InfiniteScroll from "@/components/InfinteSrcoll/InfinteSroll";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const ThumbnailVariants = cva("", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface Props extends VariantProps<typeof videoRowCardVariants> {
  data: videoGetmanyOuput["items"][number];
  className?: string;
}

export default function VideoRowCard({ data, size, className }: Props) {
  return (
    <div
      className={cn(
        videoRowCardVariants({ size }),
        "mt-2 mb-2 sm:mb-0 w-full  md:flex flex space-y-2 hover:bg-gray-50 rounded-xl p-1 ease-in duration-200 transition-colors",
        className
      )}
    >
      <Link
        href={`/video/${data.id}`}
        className={cn(
          ThumbnailVariants({ size }),
          "flex flex-col lg:flex-row gap-3 w-full"
        )}
      >
        <div className=" ">
          <VideoThumbnail
            Classname="w-full h-full aspect-[16/9] lg:w-[160px] lg:h-[95px]"
            thumbnailUrl={data.thumbnailUrl}
            videopreviewUrl={data.previewvideoUrl}
            duration={data.vidduration ?? 0}
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <h1
            style={{ lineHeight: "110%" }}
            className="font-semibold line-clamp-2 text-sm "
          >
            {data.title}
          </h1>
          <div className="flex flex-col font-medium gap-[2px]">
            <h1
              style={{ lineHeight: "110%" }}
              className="line-clamp-2 text-xs text-gray-600 "
            >
              {data.user.name}
            </h1>
            <div className="flex flex-row gap-1">
              <h1
                style={{ lineHeight: "110%" }}
                className="line-clamp-2 text-xs text-gray-600 "
              >
                {data.viewcount} views
              </h1>
              <h1 className="line-clamp-2 text-xs text-gray-600 ">
                •{" "}
                {formatDistanceToNowStrict(new Date(data.createdAt), {
                  addSuffix: true,
                })}
              </h1>
            </div>
          </div>
        </div>
      </Link>
    
    </div>
  );
}
