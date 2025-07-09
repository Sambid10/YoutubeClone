import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { videoGetmanyOuput } from "@/modules/videos/types/types";
import Link from "next/link";
import VideoThumbnail from "@/modules/videos/ui/VideoThumbnail";
import { formatDistanceToNowStrict } from "date-fns";
import UserAvatar from "@/modules/UserAvater/UserAvatar";

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

export default function SearchCards({ data, size, className }: Props) {
  return (
    <div
      className={cn(
        videoRowCardVariants({ size }),
        " w-full   hover:bg-gray-50 rounded-xl py-2  ease-in duration-200 transition-colors",
        className
      )}
    >
      <Link
        href={`/video/${data.id}`}
        className={cn(
          ThumbnailVariants({ size }),
          "flex flex-row  gap-4  w-full"
        )}
      >
        <div className="w-[50%] lg:w-[60%]">
          <VideoThumbnail
            Classname="w-full h-full aspect-[16/9] "
            thumbnailUrl={data.thumbnailUrl}
            videopreviewUrl={data.previewvideoUrl}
            duration={data.vidduration ?? 0}
          />
        </div>

        <div className="flex flex-col gap-[8px] w-[50%] lg:w-full text-black">
          <h1
            style={{ lineHeight: "110%" }}
            className="font-semibold line-clamp-2 lg:text-[19px] text-[#121212] text-lg mt-1  w-[80%] "
          >
            {data.title}
          </h1>
          <div className="flex flex-row gap-1 tracking-normal font-[400] -mt-1 items-center">
            <h1
              style={{ lineHeight: "110%" }}
              className="line-clamp-2 text-[11.5px] lg:text-[12.5px] "
            >
              {data.viewcount} views
            </h1>
            <h1 className="line-clamp-2  text-[11.5px] lg:text-[12.5px]  ">
              •{" "}
              {formatDistanceToNowStrict(new Date(data.createdAt), {
                addSuffix: true,
              })}
            </h1>
          </div>
          <div className="flex flex-row items-center text-[12px] lg:text-[12.5px]  font-medium gap-2">
            <div className="lg:h-7 lg:w-7 h-6 w-6 rounded-full">
              <UserAvatar
                className="border-none"
                imageUrl={data.user.imageUrl}
              />
            </div>

            <h1
              style={{ lineHeight: "110%" }}
              className="line-clamp-2  "
            >
              {data.user.name}
            </h1>
          </div>
          <h1 className="line-clamp-1 lg:text-xs text-[11px]   w-[80%]  text-gray-800">{data.description}</h1>
        </div>
      </Link>
    </div>
  );
}
