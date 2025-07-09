"use client";
import { Button } from "@/components/ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { videoGetOneOutput } from "../types/types";
import React from "react";
import { useClerk } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  usePrefetchQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AiFillDislike,
  AiFillLike,
  AiTwotoneDislike,
  AiTwotoneLike,
} from "react-icons/ai";
import { useSuspenseQuery } from "@tanstack/react-query";
interface Props {
  videoId: string;
  likecount: number;
  dislikecount: number;
  viewerReaction: videoGetOneOutput["viewerReaction"];
}
export default function VideoReaction({
  dislikecount,
  likecount,
  videoId,
}: Props) {
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.video.getOne.queryOptions({
      videoId: videoId,
    })
  );
  const isValidReaction = (r: any): r is "like" | "dislike" =>
    r === "like" || r === "dislike";
  const dislikemutaion = useMutation(
    trpc.videoReactions.dislike.mutationOptions({
      onMutate: async ({ videoId }) => {
        await queryClient.cancelQueries();
        const prevdata = queryClient.getQueryData(
          trpc.video.getOne.queryOptions({
            videoId: videoId,
          }).queryKey
        );
        queryClient.setQueryData(
          trpc.video.getOne.queryOptions({
            videoId: videoId,
          }).queryKey,
          (oldata: typeof prevdata) => {
            if (!oldata) return oldata;
            const prevReaction: "like" | "dislike" | null = isValidReaction(
              oldata.viewerReaction
            )
              ? oldata.viewerReaction
              : null;
            const newViewerReaction: "dislike" | null =
              prevReaction === "dislike" ? null : "dislike";
            return {
              ...oldata,
              likecount:
                oldata.viewerReaction === "like"
                  ? oldata.likecount - 1
                  : oldata.likecount,

              dislikecount:
                oldata.viewerReaction === "dislike"
                  ? oldata.dislikecount - 1
                  : oldata.dislikecount + 1,
              viewerReaction: newViewerReaction,
            };
          }
        );
        return { prevdata };
      },
      onError: (error, variables, context) => {
        if (context?.prevdata) {
          queryClient.setQueryData(
            trpc.video.getOne.queryOptions({
              videoId,
            }).queryKey,
            context.prevdata
          );
        }
          if(error.data?.code === "UNAUTHORIZED"){
          clerk.openSignIn()
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.video.getOne.queryOptions({
            videoId,
          })
        );
      },
    })
  );

  const likemutation = useMutation(
    trpc.videoReactions.like.mutationOptions({
      onMutate: async ({ videoId }) => {
        await queryClient.cancelQueries();

        const prevdata = queryClient.getQueryData(
          trpc.video.getOne.queryOptions({ videoId }).queryKey
        );

        queryClient.setQueryData(
          trpc.video.getOne.queryOptions({ videoId }).queryKey,
          (oldata: typeof prevdata) => {
            if (!oldata) return oldata;
            const prevReaction: "like" | "dislike" | null = isValidReaction(
              oldata.viewerReaction
            )
              ? oldata.viewerReaction
              : null;
            const newViewerReaction: "like" | null =
              prevReaction === "like" ? null : "like";
            return {
              ...oldata,
              likecount:
                oldata.viewerReaction === "like"
                  ? oldata.likecount - 1
                  : oldata.likecount + 1,
              dislikecount:
                oldata.viewerReaction === "dislike"
                  ? oldata.dislikecount - 1
                  : oldata.dislikecount,
                viewerReaction:newViewerReaction
            };
          }
        );
        return { prevdata };
      },

      onError: (error, variables, context) => {
        if (context?.prevdata) {
          queryClient.setQueryData(
            trpc.video.getOne.queryOptions({
              videoId,
            }).queryKey,
            context.prevdata
          );
        }
        if(error.data?.code === "UNAUTHORIZED"){
          clerk.openSignIn()
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.video.getOne.queryOptions({
            videoId,
          })
        );
      },
    })
  );
  return (
    <div className="flex items-center w-36 rounded-full bg-gray-100 border border-gray-200">
      <Button
        onClick={() => likemutation.mutate({ videoId: videoId })}
        // disabled={likemutation.isPending || dislikemutaion.isPending}
        title="I like this"
        className="w-[50%] rounded-tl-full rounded-bl-full rounded-tr-none rounded-br-none bg-transparent hover:bg-gray-200 flex justify-center"
      >
        {data.viewerReaction === "like" ? (
          <AiFillLike color="#121212" className="size-6" />
        ) : (
          <AiTwotoneLike color="black" className="size-6" />
        )}

        <h1 className="text-black">{likecount}</h1>
      </Button>

      <Button
        onClick={() => dislikemutaion.mutate({ videoId: videoId })}
        // disabled={likemutation.isPending || dislikemutaion.isPending}
        title="I dislike this"
        className="w-[50%] rounded-tr-full rounded-br-full rounded-tl-none rounded-bl-none bg-transparent border-l border-gray-300 hover:bg-gray-200 flex justify-start"
      >
        {data.viewerReaction === "dislike" ? (
          <AiFillDislike color="#121212" className="size-5" />
        ) : (
          <AiTwotoneDislike color="black" className="size-5" />
        )}

        <h1 className="text-black">{dislikecount}</h1>
      </Button>
    </div>
  );
}
