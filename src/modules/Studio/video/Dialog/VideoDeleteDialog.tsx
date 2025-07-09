"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VideoDeleteDialog({
  children,
  videoId,
}: {
  children: React.ReactNode;
  videoId: string;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const removevideo = useMutation(
    trpc.video.remove.mutationOptions({
      onSuccess: () => {
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Video Deleted.</h1>
          </div>
        ));
        router.push("/studio");
      },
      onError: ({message}) => {
        toast.error(message);
      },
    })
  );
  const onDelete = () => {
    console.log(videoId)
    removevideo.mutate({videoId:videoId});
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            video from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
          disabled={removevideo.isPending}
          className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
     
          onClick={onDelete}
          disabled={removevideo.isPending}
          className="cursor-pointer w-16 font-normal text-sm">
            {removevideo.isPending ? <Loader2 className="animate-spin text-[#ff0000] "/> : <h1>Ok</h1>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
