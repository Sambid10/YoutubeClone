"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "./AuthButton";
import SearchInput from "./SearchInput";
import MobileSidebar from "./Sidebar/MobileSidebar";
import IconOnlySidebar from "./Sidebar/IconOnlySidebar";
export default function Navbar({disableiconSidebar=false,className}:{
  disableiconSidebar?:boolean
  className?:string
}) {
  return (
    <nav className="h-14  sticky top-0 bg-white/95 backdrop-blur-3xl w-full z-20 ">
      <div className="max-w-[100rem]  mx-auto h-full flex items-center">
        <div className="flex justify-between items-center px-6 w-full h-full  relative">
          <div className="flex items-center gap-2 lg:gap-4  h-full ">
            <MobileSidebar className={className}/>
            {disableiconSidebar ==false &&  <IconOnlySidebar className={""} />}
           
            <Link
              href={"/"}
              className="flex items-center gap-1 lg:gap-2 h-full "
            >
              <Image
                src={"/yt.png"}
                alt="logo"
                className=""
                height={37}
                width={37}
              />
              <h1 className="font-semibold text-lg  md:text-xl tracking-tight">
                KathmaTube
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2 ">
            <div className=" sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2  sm:w-[30%]">
              <SearchInput />
            </div>

            <div className="">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
