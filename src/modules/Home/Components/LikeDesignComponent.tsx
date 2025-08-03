"use client"
import React from "react";
import { videoGetmanyOuput } from "@/modules/videos/types/types";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
export default function LikeDesignComponent({
   data,
   totallikedvideos
}: {
  data: videoGetmanyOuput["items"][number];
   totallikedvideos:number
}) {
  return (
   <div className="bg-white/40 bg-gradient-to-b from-white/70 via-red-50/60 to-rose-50/60 backdrop-blur-xl rounded-xl  h-fit xl:h-[80vh] border px-4 py-2 border-gray-200 sticky top-20 text-gray-800 shadow-md flex flex-col md:flex-row xl:flex-col gap-6">
      <Link href={`video/${data.id}`}>
        <div className="relative h-[300px] md:h-[200px] w-full  md:w-[320px]  xl:w-full bg-black rounded-xl group hover:opacity-95 cursor-pointer">
          <div className="h-full bg-transparent  w-full rounded-xl relative z-50 hover:bg-black/70 group-hover:flex justify-center items-center transition-all ease-in duration-100">
            <span className="text-base text-transparent group-hover:text-white flex items-center gap-1">
              <Play  className="h-5 w-5"/>
             <h1>Play</h1> 
            </span>
          </div>
          <Image
            src={data.thumbnailUrl!}
            alt="liked video pic"
            objectFit="contain"
            fill
            className="rounded-xl relative z-20 opacity-85"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold ">Liked videos</h1>
        <div
        style={{lineHeight:"150%"}}
        className="flex flex-col  text-[13px]  text-gray-700 font-medium">
           <h1 className="">{data.user.name}</h1>
           <h1 className="font-normal">Total videos: {totallikedvideos}</h1>
        </div>
       
      </div>
      
    </div>
  );
}
