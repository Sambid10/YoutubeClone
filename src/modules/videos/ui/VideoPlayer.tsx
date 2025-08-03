"use client";
import React from "react";
interface Props {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoplay?: boolean;
  onPlay?: () => void;
}
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
export default function VideoPlayer({
  onPlay,
  autoplay,
  playbackId,
  thumbnailUrl,
}: Props) {
  if (!playbackId)
    return (
      <div className="relative aspect-[16/9] max-w-xl">
        <Image src="/thumb.jpg" fill alt="video" className="object-contain" />
      </div>
    );
  return (
    <>
      <MuxPlayer
        playbackId={playbackId}
        poster={thumbnailUrl ?? "/thumb.png"}
        autoPlay={autoplay} 
        preload="metadata"
        loop
        defaultHiddenCaptions
        accentColor="#FF0000"
        className="rounded-md"
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
        onPlay={onPlay}
      />
    </>
  );
}
