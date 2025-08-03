"use client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import useSubscription from "@/modules/subscriptions/hooks/useSubscription";
import { useAuth } from "@clerk/nextjs";
export default function UserProfileSection({ userId }: { userId: string }) {
  const { openSideBar } = useSidebarStore();
  return (
    <Suspense fallback={<p>Loading..</p>}>
      <ErrorBoundary fallback={<p>Something bad happened..</p>}>
        <div
          className={cn(
            `mb-4 pt-2 flex flex-col gap-y-6 relative justify-center w-full `,
            {
              "lg:w-[80%] ": openSideBar === "main",
              "w-[90%]": openSideBar === "icon",
            }
          )}
        >
          <UserProfileSectionSuspense userId={userId} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
}

const UserProfileSectionSuspense = ({ userId }: { userId: string }) => {
  const { openSideBar } = useSidebarStore();
  const {userId:clerkid}=useAuth()
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.User.getOne.queryOptions({
      userId: userId,
    })
  );
  const { isPending, onclick } = useSubscription({
    userId: userId,
    isSubscribed: !!data?.viewerSubscribed,
  });
  if (!data) {
    return <h1>No user found..</h1>;
  }

  return (
    <div
      className={cn("px-4 sm:px-6 md:px-18  lg:px-4", {
        "lg:ml-28 lg:mr-4 w-full  ": openSideBar === "icon",
      })}
    >
      <div className="flex flex-col gap-6">
        <div className="h-42 rounded-xl w-full bg-gray-100"></div>
        <div className="flex gap-2">
          <UserAvatar imageUrl={data.imageUrl} className="h-48 w-48" />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">{data.name}</h1>
            <span className="flex gap-1 items-center">
                 <h1 className="text-sm text-gray-800 font-medium">
              &middot; {data.subscriberCount} subscribers
            </h1>
            <h1 className="text-sm text-gray-800 font-medium">
              &middot; {data.videos.length} videos
            </h1>
            </span>
           
            {clerkid === data.clerkId  ? (
              <Button className="rounded-full px-5 ">
                <Link href={`/studio/${data.id}}`}>YT Studio</Link>
              </Button>
            ) : (
              <Button
                onClick={onclick}
                disabled={isPending}
                className={`rounded-full px-5  ${
                  data.viewerSubscribed &&
                  "bg-gray-100 border hover:bg-gray-200/60 border-gray-200 text-black"
                }`}
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
            <h1></h1>
          </div>
        </div>

        {data?.videos.map((data) => data.id)}
      </div>
    </div>
  );
};
