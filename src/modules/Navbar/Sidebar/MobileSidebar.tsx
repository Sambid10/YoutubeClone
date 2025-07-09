"use client";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import MobileSideBarContent from "./MobileSideBarContent";
import { cn } from "@/lib/utils";
export default function MobileSidebar({className}:{
  className?:string
}) {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const closeSidebar = () => {
    setsidebarOpen((prev) => !prev);
  };
  return (
    <div className={cn("lg:hidden block -ml-4",className)}>
      <div
        onClick={() => {
          setsidebarOpen(true);
        }}
        className="hover hover:bg-gray-200 rounded-full px-2  py-2 ease-in duration-100 transition-colors cursor-pointer"
      >
        <Menu size={22} className="text-gray-800" />
      </div>
      <AnimatePresence>
        {sidebarOpen && <MobileSideBarContent closeSidebar={closeSidebar} />}
      </AnimatePresence>
    </div>
  );
}
