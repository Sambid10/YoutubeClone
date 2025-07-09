"use client";
import { useStudioSidebarStore } from "@/zustand/useStuidoSidebar";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import React, { use } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { links } from "./StudioIconSidebarContent";
import Link from "next/link";

export default function StudioSideBarContent() {
  const { session } = useSession();
  const { studioSidebar } = useStudioSidebarStore();
  const { user } = useUser();
  if (studioSidebar === "icon") return null;
  return (
    <div className="absolute top-16 w-[16rem] p-6 bg-white flex flex-col items-center left-0 h-[calc(100dvh-64px)] gap-2 border-r border-gray-400">
      <UserAvatar
        size="xl"
        imageUrl={user?.imageUrl!}
        name={user?.fullName!}
        className="rounded-full"
      />
      <div className="text-center ">
        <h1 className=" font-semibold text-[17px] tracking-tight">
          Your channel
        </h1>
        <h1 className="text-[13px] ">{session?.user.fullName}</h1>
      </div>
      <div></div>
      <div className="h-[0.9px] bg-gray-400 w-[calc(100%+3rem)]" />
      <div className="flex flex-col justify-start gap-0 w-full  ">
        {links.map((link, _) => (
          <Link
            className="flex items-center  hover:bg-gray-200 ease-in duration-200 transition-colors rounded-md gap-2  w-full  justify-center"
            href={link.href}
            key={link.key}
          >
            <div className="flex items-center h-full py-2.5 gap-2">
              <h1>
                <link.icon className="size-5 text-gray-800" />
              </h1>
              <h1 className="text-sm">{link.title}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
