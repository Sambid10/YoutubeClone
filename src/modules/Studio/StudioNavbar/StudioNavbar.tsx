import React from "react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/modules/Navbar/AuthButton";
import StudioUploadModal from "./StudioUploadModal";
import StudioSidebarIcon from "../StudioSidebar/StudioSidebarIcon";
import { Plus } from "lucide-react";
export default function StudioNavbar() {
  return (
    <nav className="h-16 sticky top-0 bg-[#ffff] w-full z-20 border-b border-b-stone-400 shadow-md shadow-gray-300 ">
      <div className="max-w-[100rem]  mx-auto h-full flex items-center">
        <div className="flex justify-between items-center lg:px-4 xl:px-4 md:px-2 px-2 w-full h-full  relative">
          <div className="flex items-center gap-2 lg:gap-4  h-full ">
            <StudioSidebarIcon/>
            <Link
              href={"/studio"}
              className="flex items-center gap-1 lg:gap-2 h-full "
            >
              <Image
                src={"/yt.png"}
                alt="logo"
                className=""
                height={37}
                width={37}
              />
              <h1 className="font-semibold text-lg -mt-[4px] md:text-xl tracking-tight">
                YT-Studio
              </h1>
            </Link>
          </div>
          <div>
            
          </div>
          <div className="flex items-center gap-4 ">
          <StudioUploadModal/>

            <div className="">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
