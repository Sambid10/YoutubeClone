"use client";
import * as z from "zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CommentCreateSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/modules/UserAvater/UserAvatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Smile } from "lucide-react";
import EmojiPicker from "./EmojiSelect";
interface Props {
  videoId: string;
  parentId?: string;
  onCancel?: () => void;
  variant?: "comment" | "reply";
  onSuccess?: () => void;
}

export default function CommentForm({
  videoId,
  onSuccess,
  parentId,
  variant,
}: Props) {
  const [submitbutton, setsubmitbutton] = useState(false);
  const [showemojipicker, setshowemojipicker] = useState(false);
  const btnref = useRef<HTMLButtonElement>(null);
  const clerk = useClerk();
  const { user } = useUser();
  const trpc = useTRPC();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const CommentCreateSchemaWithoutUserId = CommentCreateSchema.omit({
    userId: true,
  }).extend({
    commentinfo: z
      .string()
      .max(1000, { message: "1000 characters exceeded." })
      .transform((val) => val.trim().replace(/\s{3,}/g, " \n\n ")),
  });

  const form = useForm<z.infer<typeof CommentCreateSchemaWithoutUserId>>({
    resolver: zodResolver(CommentCreateSchemaWithoutUserId),
    defaultValues: {
      commentinfo: "",
      videoId,
      parentId,
    },
  });
  const { setValue, getValues } = form;
  function handleEmojiSelect(emoji: any) {
    const val = getValues("commentinfo");
    const cursorpos = textareaRef.current?.selectionStart ?? val.length;
    const newval =
      val.slice(0, cursorpos) + emoji.native + val.slice(cursorpos);

    setValue("commentinfo", newval, {
      shouldValidate: true,
    });
    setTimeout(() => {
      const newPos = cursorpos + emoji.native.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
      textareaRef.current?.focus();
    }, 0);
  }
  const commentText = form.watch("commentinfo");

  const queryClient = useQueryClient()
  const create = useMutation(
    trpc.Comments.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.Comments.getMany.infiniteQueryOptions({
            limit: 5,
            videoId,
            parentId,
          })
        );
      
       form.reset()
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Comment Added</h1>
          </div>
        ));
        onSuccess?.();
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
        toast.error(err.message);
      },
    })
  );

  const handleSubmit = (
    values: z.infer<typeof CommentCreateSchemaWithoutUserId>
  ) => {
   
    create.mutate({
      CommentInfo: values.commentinfo,
      videoId: videoId,
      parentId: parentId,
    });
  };
  function cancelClick() {
    form.reset();
    setsubmitbutton(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-4 flex flex-col mb-4 gap-2 w-full"
      >
        <div className="flex items-start gap-4">
          <div className={`${variant === "comment" ? "h-10 w-10" : "h-8 w-8"}`}>
            <UserAvatar
              className="border-none border-0"
              imageUrl={user?.imageUrl || "/user.svg"}
            />
          </div>
          <FormField
            control={form.control}
            name="commentinfo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    ref={textareaRef}
                    maxLength={1000}
                    disabled={create.isPending}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    onClick={() => setsubmitbutton(true)}
                    className="font-normal  text-[14px] aria-invalid:border-l-0 aria-invalid:border-r-0 aria-invalid:border-b aria-invalid:border-t-0  min-h-6 p-0 border-white border-b border-b-gray-400 focus:border-b-blue-500 transition ease-in-out duration-200 focus:border-1 rounded-none resize-y max-h-40 pb-4 h-auto"
                    placeholder={`${
                      variant === "comment"
                        ? "Add a comment.."
                        : "Add a reply.."
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        {submitbutton && (
          <div className="flex justify-between ml-12 relative">
            <div>
              <button
                ref={btnref}
                type="button"
                onClick={() => setshowemojipicker((prev) => !prev)}
                className="hover:bg-gray-200 ease-in duration-200 rounded-full h-9 w-9  flex justify-center items-center"
              >
                <Smile />
              </button>
              {showemojipicker && (
                <div className="absolute top-12 -left-14 sm:-left-12 md:left-0">
                  <EmojiPicker
                    btnref={btnref}
                    onClose={() => setshowemojipicker(false)}
                    onEmojiSelect={handleEmojiSelect}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center ">
              <Button
                disabled={create.isPending}
                type="button"
                onClick={cancelClick}
                className="bg-transparent px-6 text-black border-none shadow-none rounded-full hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                disabled={create.isPending || commentText.trim() === ""}
                type="submit"
                className="rounded-full bg-blue-700 w-24 hover:bg-blue-6"
              >
                {create.isPending ? (
                  <Loader2 className="animate-spin  " />
                ) : (
                  <h1>{variant === "comment" ? "Comment" : "Reply"}</h1>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
