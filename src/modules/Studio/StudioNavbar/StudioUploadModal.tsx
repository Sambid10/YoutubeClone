"use client";
import React from "react";
import { Loader2Icon, MoreVertical, Plus, Trash } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/ResponsiveDialog/ResponsiveDialog";
import StudioUploader from "../Components/StudioUploader";
export default function StudioUploadModal() {
  const trpc = useTRPC();
  const router = useRouter();
  const create = useMutation(
    trpc.video.create.mutationOptions({
      onSuccess: () => {
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[300px] px-4 py-4 text-sm ">
            <h1 className="text-left">Video Created. </h1>
          </div>
        ));
        router.refresh()
        
      },
      onError: (error) => {
        toast.custom(() => (
          <div className="text-white bg-red-400 rounded-md w-[300px] px-4 py-4 text-sm flex items-center justify-between">
            <h1 className="text-left">Sorry, only 10 videos per user.</h1>
          </div>
        ));
      },
    })
  );
  const onSuccess = () => {
    const videoId = create.data?.video.id;
    if (!videoId) return;
  
    router.push(`/studio/video/${videoId}`);
  };
  return (
    <>
      <ResponsiveDialog
        open={!!create.data?.url}
        openChange={() => create.reset()}
        title="Upload a video"
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={onSuccess} endpoint={create.data?.url} />
        ) : (
          <Loader2Icon className="animate-spin text-[#ff0000] " />
        )}
      </ResponsiveDialog>

      <Button
        disabled={create.isPending}
        onClick={() => create.mutate()}
        className="py-2 flex items-center border border-gray-300 hover:bg-gray-300 ease-in duration-200 transition-colors gap-2 cursor-pointer px-4 rounded-md bg-gray-200 text-black text-sm"
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin text-[#ff0000] " size={15} />
        ) : (
          <Plus size={15} />
        )}
        Create
      </Button>
    </>
  );
}
