"use client";
import React from "react";
interface Props {
  videoId: string;
}
import { cn } from "@/lib/utils";
import { useStudioSidebarStore } from "@/zustand/useStuidoSidebar";
import { FormSection } from "../video/section/FormSection";
export default function VideoView({ videoId }: Props) {
  const { studioSidebar } = useStudioSidebarStore();
  return (
    <div
      className={cn("", {
        "ml-[4.5rem]": studioSidebar === "icon",
        "ml-[16rem]": studioSidebar === "fullmenu",
      })}
    >
      <FormSection videoId={videoId} />
    </div>
  );
}
