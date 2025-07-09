"use client";
import { Clock, Home, List, ThumbsUp, Flame, Wallet, Film } from "lucide-react";
import React from "react";
import SideBarContent from "./SidBarContent";
import { LiaHomeSolid } from "react-icons/lia";
import { MdOutlineSubscriptions } from "react-icons/md";
import { ImFire } from "react-icons/im";
import { LuTimerReset } from "react-icons/lu";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { SiYoutubestudio } from "react-icons/si";
import { PiPlaylistBold } from "react-icons/pi";
export const sidebarItems = [

  {
    name: "Home",
    href: "/",
    key: "home",
    icon: LiaHomeSolid,
  },
  {
    name: "Subscriptions",
    href: "/subscription",
    key: "subscription",
    icon: MdOutlineSubscriptions,
  },
  {
    name: "Trending",
    href: "/trending",
    key: "trending",
    icon: ImFire ,
  },
  
];
import { useSidebarStore } from "@/zustand/useIconSidebar";
export const bottomsidebarItems = [
  {
    name: "History",
    href: "/history",
    key: "history",
    icon: LuTimerReset
  },
  {
    name: "Liked videos",
    href: "/likes",
    key: "like",
    icon: AiOutlineLike,
  },
  {
    name: "All Playlist",
    href: "/playlist",
    key: "playlist",
    icon:PiPlaylistBold,
  },
  {
    name:"YT Studio",
    href:"/studio",
    key:"studio",
    icon:SiYoutubestudio
  }
];
export default function Sidebar() {
  const { openSideBar} = useSidebarStore();
  if (openSideBar === "icon") {
    return null;
  }
  return (
    <div className="hidden lg:block lg:sticky lg:min-w-[19%] xl:min-w-[18%]  top-14 h-[calc(100dvh-58px)] space-y-2 py-2 pl-4">
      <SideBarContent />
    </div>
  );
}
