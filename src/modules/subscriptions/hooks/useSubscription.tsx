import React from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
interface Props {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}
export default function useSubscription({
  fromVideoId,
  isSubscribed,
  userId,
}: Props) {
  const trpc = useTRPC();
  const clerk=useClerk()
  const queryclient = useQueryClient();
  const subscribe = useMutation(
    trpc.subscription.create.mutationOptions({
      onSuccess: () => {
        toast.custom(()=>(
            <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Subscription Added.</h1>
          </div>
        ))
        if (fromVideoId) {
          queryclient.invalidateQueries(
            trpc.video.getOne.queryOptions({ videoId: fromVideoId })
          );
        }else{
          queryclient.invalidateQueries(
            trpc.User.getMany.infiniteQueryOptions({limit:5})
          )
        }
      },
      onError:(err)=>{
        toast.error("Something went wrong")
        if(err.data?.code==="UNAUTHORIZED"){
          clerk.openSignIn()
        }
      }
    })
  );
  const unsubscribe = useMutation(trpc.subscription.remove.mutationOptions({
      onSuccess: () => {
         toast.custom(()=>(
            <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Subscription Removed.</h1>
          </div>
        ))
        if (fromVideoId) {
          queryclient.invalidateQueries(
            trpc.video.getOne.queryOptions({ videoId: fromVideoId })
          );
        }else{
          queryclient.invalidateQueries(
            trpc.User.getMany.infiniteQueryOptions({limit:5})
          )
        }
      },
      onError:(err)=>{
        toast.error("Something went wrong")
        if(err.data?.code==="UNAUTHORIZED"){
          clerk.openSignIn()
        }
      }
    }));
  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onclick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId: userId });
    } else {
      subscribe.mutate({ userId: userId });
    }
  };
  return {
    isPending,
    onclick,
  };
}
