"use client";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import { useStudioSidebarStore } from "@/zustand/useStuidoSidebar";
import { useAuth, UserButton, useSession, useUser } from "@clerk/nextjs";
import { Leaf, Video, LogOut } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
export const links = [
  {
    title: "Content",
    href: "/studio",
    key: "content",
    icon: Video,
    desc: "Content",
  },
  {
    title: "Exit studio",
    href: "/",
    key: "exit",
    icon: LogOut,
    desc: "Exit",
  },
];
export default function StudioIconSidebarContent() {
  const { studioSidebar } = useStudioSidebarStore();
  const {user}=useUser()
  if(!user) return null

  if (studioSidebar === "fullmenu") return null;
  return (
    <div className="absolute top-16 h-[calc(100dvh-64px)]  flex flex-col items-center gap-1 pt-4 left-0 w-18 bg-white border-r p-2 border-r-stone-400">
      
      <AllTooltip content="View channel on Youtube">
      <UserAvatar size="custom" imageUrl={user.imageUrl} name={user.fullName!} className="rounded-full" />
      </AllTooltip>
      <div className="h-[0.5px] w-[calc(72px)] bg-gray-400 mt-[9px]"/>
      <div className="w-full flex flex-col gap-1 ">
        {links.map((link) => (
          <AllTooltip content={link.desc} key={link.key} className="w-full">
            <Link
              className="flex hover:bg-gray-200 ease-in py-2.5 duration-200 transition-colors rounded-md gap-2 w-full justify-center"
              href={link.href}
            >
              <link.icon className="size-5 text-gray-800" />
            </Link>
          </AllTooltip>
        ))}
      </div>
    </div>
  );
}
