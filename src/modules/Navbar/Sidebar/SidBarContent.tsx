"use client"
import React from "react";
import { sidebarItems, bottomsidebarItems } from "./Sidebar";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function SideBarContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex flex-col gap-0 w-full">
        {sidebarItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={` ${
              pathname === item.href && "bg-gray-200 text-black"
            } text-gray-00 rounded-md hover:bg-gray-200 ease-in duration-200 transition-colors cursor-pointer text-sm py-2.5  pl-2  flex items-center gap-7`}
          >
            <item.icon size={22} className="text-gray-800"/>
            <h1
              className={`${
                pathname === item.href
                  ? "text-black font-semibold"
                  : " text-gray-900"
              } tracking-wide`}
            >
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
      <div className="h-[1px] bg-gray-400 w-full" />
      <div className="flex flex-col gap-0 ">
        <h1 className="flex gap-2 py-1  px-2 items-center text-black font-semibold">
          You <ArrowRight size={18} />{" "}
        </h1>
        {bottomsidebarItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={` ${
              pathname === item.href && "bg-gray-200 text-black"
            } text-gray-00 rounded-md hover:bg-gray-200 ease-in duration-200 transition-colors cursor-pointer text-sm py-2.5  pl-2  flex items-center gap-7`}
          >
            <item.icon size={18} />
            <h1
              className={`${
                pathname === item.href
                  ? "text-black font-semibold"
                  : " text-gray-900"
              } tracking-wide`}
            >
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </>
  );
}
