import type { Video } from '@/modules/User/modules/server';
import React from 'react';
import VideoThumbnail from '@/modules/videos/ui/VideoThumbnail';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';

export default function UserVideos({ vidData }: { vidData: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vidData.map((data: any) => (
        <div className="flex flex-col" key={data.id}>
          <Link
            prefetch
            href={`/video/${data.id}`}
            className={cn("relative w-full")}
          >
            <VideoThumbnail
              Classname="w-full h-full aspect-[16/9]"
              thumbnailUrl={data.thumbnail_url}
              videopreviewUrl={data.preview_videoUrl}
              duration={data.vid_duration ?? 0}
            />
          </Link>
          <div className="flex flex-col mt-2 text-black">
            <Link href={`/video/${data.id}`}>
              <h1
                style={{ lineHeight: "110%" }}
                className="font-semibold line-clamp-2 text-[17px] lg:text-[16px] text-[#36454F]"
              >
                {data.title}
              </h1>
              <p className="text-[12px] lg:text-[12.5px] mt-1 text-gray-600 line-clamp-1">
                • {data.views} {formatDistanceToNowStrict(new Date(data.created_at), { addSuffix: true })}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
