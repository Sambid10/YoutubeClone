import React from "react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import { videoGetOneOutput } from "../types/types";
export default function VideoDropDown({ video }: { video: videoGetOneOutput }) {
  const fullurl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/video/${video.id} `;
  function copyLink() {
    navigator.clipboard.writeText(fullurl)
     toast.custom(() => (
      <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
        <h1 className="text-left">Copied to Clipboard</h1>
      </div>
    ));
    
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          title="Menu"
          className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-200"
        >
          <EllipsisVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuItem onClick={copyLink} className="flex items-center">
          <Clipboard />
          <h1>Copy Link</h1>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
