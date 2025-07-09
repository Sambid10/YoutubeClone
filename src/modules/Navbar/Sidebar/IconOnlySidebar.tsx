"use client";

import React from "react";
import { Menu, User } from "lucide-react";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import { sidebarItems } from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";
import { cn } from "@/lib/utils";
export default function IconOnlySidebar({className}:{
  className?:string
}) {
  const { openSideBar, toggleSidebar } = useSidebarStore();

  return (
    <div
      className={cn("hidden lg:block -ml-2", {
      })}
    >
      <div
        onClick={toggleSidebar}
        className="hover hover:bg-gray-200 rounded-full px-2 py-2 ease-in duration-100 transition-colors cursor-pointer"
      >
        <Menu size={22} className="text-gray-800" />
      </div>
      {openSideBar === "icon" && <IconSideBarContent />}
    </div>
  );
}

const IconSideBarContent = () => {
  const pathname = usePathname();
  return (
    <div className="w-18 absolute left-0 min-h-screen top-16 bg-white">
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`
              ${
                pathname === item.href
                  ? "bg-gray-100 text-black font-semibold"
                  : ""
              }
            text-gray-00 rounded-md hover:bg-gray-200 ease-in duration-200 transition-colors cursor-pointer text-sm py-2.5    flex flex-col  justify-center items-center gap-2`}
          >
            <item.icon size={22} className="text-gray-800" />
            <h1 className={` -tracking-tight text-[10px]`}>{item.name}</h1>
          </Link>
        ))}
        <Link
          href={"/"}
          className={` 
          text-gray-00 rounded-md hover:bg-gray-200 ease-in duration-200 transition-colors cursor-pointer text-sm py-2.5    flex flex-col  justify-center items-center gap-2`}
        >
          <MdAccountCircle size={22} className="text-gray-800"/>
          <h1 className={` -tracking-tight text-[10px]`}>Account</h1>
        </Link>
      </div>
    </div>
  );
};
