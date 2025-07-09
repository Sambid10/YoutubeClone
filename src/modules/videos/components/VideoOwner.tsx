"use client";
import React from "react";
import { videoGetOneOutput } from "../types/types";
interface Props {
  user: videoGetOneOutput["user"];
  videoId: string;
  showButton?: boolean;
}
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import { UserSubscription } from "@/db/schema";
import useSubscription from "@/modules/subscriptions/hooks/useSubscription";
import { Bell, BellDotIcon, BellIcon } from "lucide-react";
export default function VideoOwner({
  user,
  videoId,
  showButton = true,
}: Props) {
  const { userId } = useAuth();
  const {isPending,onclick}=useSubscription({
    userId:user.id,
    isSubscribed:user.viewerSubscribed,
    fromVideoId:videoId
  })
  return (
    <div className="flex gap-3 items-center">
      <Link href={`/user/${user.id}`} className="w-11 h-11">
        <UserAvatar imageUrl={user.imageUrl} name={user.name} />
      </Link>

      <div className="flex flex-col">
        <AllTooltip content={user.name}>
          <h1 className="font-medium line-clamp-1">{user.name}</h1>
        </AllTooltip>

        <p className="text-gray-600 text-[12.5px] -mt-[2px] line-clamp-1">
          {user.subscriberCount} subscribers
        </p>
      </div>

      {showButton && userId === user.clerkId ? (
        <Button className="rounded-full px-5 ml-4">
          <Link href={`/studio/video/${videoId}`}>Edit video</Link>
        </Button>
      ) : showButton ? (
        <Button 
        onClick={onclick}
        disabled={isPending}
        className={`rounded-full px-5 ml-4 ${user.viewerSubscribed && "bg-gray-100 border hover:bg-gray-200/60 border-gray-200 text-black"}`}>
          {!user.viewerSubscribed ? <h1>Subscribe</h1> : <h1 className="flex items-center gap-2"><BellIcon className="h-[18px] w-[18px]"/> Subscribed</h1>}
        </Button>
      ) : null}
    </div>
  );
}
