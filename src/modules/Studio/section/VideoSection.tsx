"use client";
import InfinteSroll from "@/components/InfinteSrcoll/InfinteSroll";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VideoThumbnail from "@/modules/videos/ui/VideoThumbnail";
import { useTRPC } from "@/trpc/client";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { StudioSkeleton } from "@/modules/StudioSkeleton";
import Link from "next/link";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Globe, LockKeyhole } from "lucide-react";
import AllTooltip from "@/modules/Tooltip/AllTooltip";

export const VideoSection = () => {
  return (
    <Suspense fallback={<StudioSkeleton/>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
      <VideoSectionSuspense/>
        
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = () => {
  const trpc = useTRPC();
  const query = useSuspenseInfiniteQuery(
    trpc.stuido.getMany.infiniteQueryOptions(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      }
    )
  );
  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    query;

  return (
    <div className="">
      <div className="-ml-2 sticky ">
        <Table className="">
          <TableHeader className="">
            <TableRow className="border-gray-400  ">
              <TableHead className="pl-7  text-left w-[50%]  ">Video</TableHead>
              <TableHead className="text-center">Visibility</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead className="text-center pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap((page) =>
              page.items.map((vid) => (
                <TableRow key={vid.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/studio/video/${vid.id}`}
                      className="flex items-center gap-4 lg:gap-6 pl-4 h-full w-full "
                    >
                      <VideoThumbnail
                      Classname=" h-[100px] w-full max-w-[190px]"
                        duration={vid.vidduration!}
                        videopreviewUrl={vid.previewvideoUrl}
                        thumbnailUrl={vid.thumbnailUrl}
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm line-clamp-1 font-semibold capitalize">
                          {vid.title}
                        </span>
                        <span className="text-xs line-clamp-2 whitespace-pre-line md:max-w-[10rem] lg:max-w-[20rem] xl:max-w-[20rem] max-w-[10rem] capitalize text-gray-600">
                          {vid.description || "No description"}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {vid.visibility === "private" ? (
                        <AllTooltip content="Private">
                         <LockKeyhole className="size-5"/>
                        </AllTooltip>
                      ) : (
                        <AllTooltip content="Public">
                          <Globe className="size-5"/>
                        </AllTooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <span className="capitalize">{vid.muxStatus === "ready" ? <h1>Ready</h1> : <h1>Preparing</h1>}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <h1>{format(new Date(vid.createdAt), "dd MMM yyyy")}</h1>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">Views</TableCell>
                  <TableCell className="text-center">Comments</TableCell>
                  <TableCell className="text-center pr-6">Likes</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <InfinteSroll
        isManual
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        message="You have reached end if the list."
      />
    </div>
  );
};
