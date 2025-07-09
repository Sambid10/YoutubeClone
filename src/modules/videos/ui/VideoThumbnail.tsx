"use client";
import React from "react";
import Image from "next/image";
import { formatDuration } from "@/lib/FormatDuration";
import { cn } from "@/lib/utils";
interface VideoThumbnailProps {
  thumbnailUrl?: string | null;
  videopreviewUrl?: string | null;
  duration: number;
    Classname?:string,
}
export default function VideoThumbnail({
  Classname,
  thumbnailUrl,
  videopreviewUrl,
  duration,
}: VideoThumbnailProps) {
  return (
    <div className={cn("relative aspect-[16/9]  overflow-hidden  rounded-md group bg-black",Classname)}>
      <Image
        src={thumbnailUrl ?? "/thumb.jpg"}
        alt="thumbnail"
        fill
          sizes="100vw"
        className="object-contain  group-hover:opacity-0 "
      />
      <Image
        src={videopreviewUrl ?? "/thumb.jpg"}
        alt="previewthumbnailvid"
        fill
          sizes="100vw"
        unoptimized={!!videopreviewUrl}
        className="object-cover group-hover:opacity-100 opacity-0"
      />
      <div className="absolute bottom-1 right-1 px-[7px] py-0.5 rounded bg-black/80 text-white text-[11px] border border-gray-600">
        <h1>{formatDuration(duration) ?? 0}</h1>
      </div>
    </div>
  );
}
