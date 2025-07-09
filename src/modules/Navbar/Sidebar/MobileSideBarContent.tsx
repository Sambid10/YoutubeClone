"use client";
import React from "react";
interface Props {
  closeSidebar: (open: boolean) => void;
}
import { Menu } from "lucide-react";
import { easeIn, motion } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import Image from "next/image";
import { useRef } from "react";
import SideBarContent from "./SidBarContent";
export default function MobileSideBarContent({ closeSidebar }: Props) {
  const sidebarRef = useRef(null);
  const closeref = useRef(null);
  useOutsideClick({
    ref: sidebarRef,
    closeref: closeref,
    handler: () => closeSidebar(false),
  });
  return (
    <div>
      <div className="absolute inset-0 bg-black/50 z-10 min-h-screen" />
      <motion.div
        ref={sidebarRef}
        className="lg:w-[18%] md:w-[35%] w-[60%] sm:w-[45%] absolute min-h-screen z-30 top-0 left-0 px-2  border-r bg-white border-stone-400  flex flex-col space-y-4"
        initial={{ x: "-100%" }}
        transition={{ ease: easeIn, duration: 0.3 }}
        animate={{ x: "0%" }}
        exit={{ x: "-100%" }}
      >
        <div className="h-14">
          <div className="flex items-center gap-4 h-full">
            <div
              ref={closeref}
              className="hover hover:bg-gray-200 rounded-full px-2 py-2 ease-in duration-100 transition-colors cursor-pointer"
            >
              <Menu size={22} className="text-gray-800" />
            </div>
            <div className="flex items-center gap-1 h-full">
              <Image
                src={"/yt.png"}
                alt="logo"
                className=""
                height={37}
                width={37}
              />
              <h1 className="font-semibold text-lg md:text-xl tracking-tight">KathmaTube</h1>
            </div>
          </div>
        </div>
        <SideBarContent />
      </motion.div>
    </div>
  );
}
