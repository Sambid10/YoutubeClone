"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { userGetmanyOutput } from "@/modules/videos/types/types";
import Link from "next/link";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import useSubscription from "@/modules/subscriptions/hooks/useSubscription";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
interface Props {
  data: userGetmanyOutput["items"][number];
  className?: string;
}

export default function UserSearchCards({ data, className }: Props) {
  const { userId } = useAuth();
  const { isPending, onclick } = useSubscription({
    isSubscribed: data.viewerSubscribed,
    userId: data.id,
    fromVideoId: undefined,
  });
  return (
    <div
      className={cn(
        "w-full border-b border-gray-200 py-2 ease-in duration-200 transition-colors",
        className
      )}
    >
      <div className="flex flex-row  w-full">
        <Link href={`/user/${data.id}`} className="w-full flex justify-center">
          <div className="h-30 w-30">
            <UserAvatar imageUrl={data.imageUrl} className="border-none" />
          </div>
        </Link>

        <div className="w-full flex justify-between items-center  ">
          <div className="flex flex-col w-full justify-start h-full mt-2 ">
            <Link href={`/user/${data.id}`} className="h-full w-full ">
              <h1 className="font-semibold text-[#121212] text-[19px]">
                {data.name}
              </h1>

              <h1 className="text-xs">
                {data.subscriberCount}{" "}
                {data.subscriberCount === 1 || 0 ? "subscriber" : "subscribers"}
              </h1>
            </Link>
          </div>

          <div className="hidden md:block mr-6 ">
            {userId === data.clerkId ? (
              <Button asChild className="rounded-full px-5 ml-4 w-32">
                <Link href={`/studio/video/${data.id}`}>See Profile</Link>
              </Button>
            ) : (
              <Button
                onClick={onclick}
                disabled={isPending}
                className={cn(
                  "rounded-full px-5 ml-4 w-32",
                  data.viewerSubscribed &&
                    "bg-gray-100 border hover:bg-gray-200/60 border-gray-200 text-black"
                )}
              >
                {!data.viewerSubscribed ? (
                  <h1>Subscribe</h1>
                ) : (
                  <h1 className="flex items-center gap-2">
                    <BellIcon className="h-[18px] w-[18px]" /> Subscribed
                  </h1>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    
    </div>
  );
}
