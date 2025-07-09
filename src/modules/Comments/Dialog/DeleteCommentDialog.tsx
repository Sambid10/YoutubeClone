"use client";
import React, { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CommentDeleteDialog({
  children,
  videoId,
  parentId,
  commentId,
}: {
  children: React.ReactNode;
  videoId: string;
  commentId: string;
  parentId?: string;
}) {
  // control the dialog open state
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const removecomment = useMutation(
    trpc.Comments.remove.mutationOptions({
      onMutate: () => {
        // You could optionally disable buttons here by some state
      },
      onSuccess: () => {
        // 1) Close the dialog *immediately on success*
        setOpen(false);
        // 2) Invalidate the correct comment list
        queryClient.invalidateQueries(
          trpc.Comments.getMany.infiniteQueryOptions({
            videoId,
            parentId,
            limit: 5,
          })
        );
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Comment Deleted.</h1>
          </div>
        ));
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    })
  );

  const onDelete = () => {
    removecomment.mutate({
      commentId,
      videoId,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] sm:w-[55%] md:w-[45%] lg:w-[30%] xl:w-[25%] rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
          <AlertDialogDescription>
            Delete your comment permanently?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={removecomment.isPending}
            className="rounded-full font-[500] bg-transparent border-none text-blue-500 hover:bg-blue-100"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onDelete}
            disabled={removecomment.isPending}
            className="w-full sm:w-16 font-[500] rounded-full bg-transparent border-none text-blue-500 hover:bg-blue-100"
          >
            {removecomment.isPending ? (
              <Loader2 className="animate-spin text-[#ff0000] " />
            ) : (
              "Ok"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
