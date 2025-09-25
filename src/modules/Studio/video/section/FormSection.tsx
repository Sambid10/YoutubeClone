"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import VideoPlayer from "@/modules/videos/ui/VideoPlayer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/modules/Skeleton";
import ThumbnailUploadModal from "../Modal/ThumbnailUploadModal";
import {
  Trash,
  MoreVertical,
  Loader2,
  CopyCheckIcon,
  CopyIcon,
  Globe,
  LockIcon,
  ImagePlus,
  RotateCcwIcon,
  Recycle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {videoUpdateSchema } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import VideoDeleteDialog from "../Dialog/VideoDeleteDialog";
import Image from "next/image";
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

export const FormSection = ({ videoId }: { videoId: string }) => {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ErrorBoundary fallback={<p>Lodaing</p>}>
      {/* <SkeletonCard/> */}
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const FormSectionSuspense = ({ videoId }: { videoId: string }) => {
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [restoreThumbnailModalOpen, setrestoreThumbnailModalOpen] =
    useState(false);

  const router = useRouter();
  const trpc = useTRPC();
  const video = useSuspenseQuery(
    trpc.stuido.getOne.queryOptions({
      id: videoId,
    })
  );
  const category = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    defaultValues: video.data,
    resolver: zodResolver(videoUpdateSchema),
  });
  const update = useMutation(
    trpc.video.update.mutationOptions({
      onSuccess: () => {
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Video updated.</h1>
          </div>
        ));
        router.refresh();
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  );
  const revalidate=useMutation(
    trpc.video.revalidate.mutationOptions({
       onSuccess: () => {
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Video revalidated.</h1>
          </div>
        ));
        router.refresh();
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    })
  )
  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullurl = `${
    process.env.VERCEL_URL || "https://localhost:3000"
  }/video/${video.data.id} `;
  const [iscopied, setCopyurl] = useState(false);
  const cliptoBoard = async () => {
    setCopyurl(true);
    toast.custom(() => (
      <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
        <h1 className="text-left">Copied to Clipboard</h1>
      </div>
    ));
    await navigator.clipboard.writeText(fullurl);

    setTimeout(() => {
      setCopyurl(false);
    }, 2000);
  };
  const restoreThumbnail = useMutation(
    trpc.video.restoreThumbnail.mutationOptions({
      onSuccess: () => {
        toast.custom(() => (
          <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Restored Thumbnail</h1>
          </div>
        ));
        setrestoreThumbnailModalOpen(false);
        router.refresh();
      },
      onError: () => {
        toast.custom(() => (
          <div className="text-white bg-red-400 rounded-md w-[250px] px-4 py-4 text-sm text-center">
            <h1 className="text-left">Something went wrong</h1>
          </div>
        ));
        setrestoreThumbnailModalOpen(false);
        router.refresh();
      },
    })
  );
  const onrestoreThumnail = () => {
    restoreThumbnail.mutate({ videoId: videoId });
  };
  return (
    <>
      {thumbnailModalOpen && (
        <ThumbnailUploadModal
          video={video.data}
          onOpenChange={setThumbnailModalOpen}
          open={thumbnailModalOpen}
          videoId={video.data.id}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center    justify-between border-b border-gray-400  pb-[9px] pt-2">
            <div className="flex flex-col   ">
              <h1 className="text-3xl font-bold px-6">Video Details</h1>
              <h1 className="text-xs text-gray-500 px-6">
                Manage your video details
              </h1>
            </div>
            <div className="pr-6 flex gap-4 items-center">
              <Button
                type="submit"
                disabled={update.isPending}
                className="cursor-pointer w-16"
              >
                {update.isPending ? (
                  <Loader2 className="animate-spin text-[#ff0000] " />
                ) : (
                  <h1>Save</h1>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    type="button"
                    className="rounded-full bg-gray-200 border border-gray-300 hover:bg-gray-200 cursor-pointer"
                  >
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border border-gray-400"
                >
                  <VideoDeleteDialog videoId={videoId}>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className=" cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex gap-2 items-center">
                        <Trash className="text-red-600 " />
                        <h1 className="text-red-600 ">Delete</h1>
                      </div>
                    </DropdownMenuItem>
                    
                  </VideoDeleteDialog>
                   <DropdownMenuItem
                      onSelect={()=>revalidate.mutate({videoId:videoId})}
                      className=" cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex gap-2 items-center">
                        <Recycle className=" " />
                        <h1 className="">Revalidate</h1>
                      </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5  ">
            <div className="space-y-5 lg:col-span-3 px-6 py-4">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem className="focus-within:text-blue-800">
                    <FormLabel>Video Title :</FormLabel>
                    <FormControl>
                      <Input
                        disabled={update.isPending}
                        {...field}
                        className="rounded-md focus:border-2 focus:border-blue-400 text-black"
                        placeholder="Enter video title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem className="focus-within:text-blue-800">
                    <FormLabel className="">Video Description :</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={update.isPending}
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md focus:border-2 focus:border-blue-400 text-black"
                        placeholder="Enter video description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="">Category :</FormLabel>
                    <Select
                      disabled={update.isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className=" text-black">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        {category.data.map((cat) => (
                          <SelectItem value={cat.id} key={cat.id}>
                            <h1>{cat.name}</h1>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={({}) => (
                  <FormItem>
                    <FormLabel>Thumbnail : </FormLabel>
                    <FormControl>
                      <div className=" relative bg-black  max-w-sm group overflow-hidden border-dashed  aspect-[16/9] border border-gray-400">
                        <Image
                          fill
                          alt="thumbnail"
                          className="object-contain group-hover:scale-105  group-hover:opacity-90 transition-all duration-200 ease-in "
                          src={video.data.thumbnailUrl ?? "/thumb.jpg"}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className=" absolute right-1 top-1 z-40"
                          >
                            <Button
                              type="button"
                              size={"icon"}
                              className="bg-black/50 active:bg-black focus:bg-black cursor-pointer rounded-full group-hover:bg-black"
                            >
                              <MoreVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                setThumbnailModalOpen(true);
                              }}
                            >
                              <div className="flex cursor-pointer items-center gap-2">
                                <ImagePlus />
                                <h1 className="text-sm">Change</h1>
                              </div>
                            </DropdownMenuItem>
                            <AlertDialog
                              open={restoreThumbnailModalOpen}
                              onOpenChange={setrestoreThumbnailModalOpen}
                            >
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault();
                                }}
                                asChild
                              >
                                <AlertDialogTrigger asChild>
                                  <div className="flex items-center gap-2 w-full">
                                    <RotateCcwIcon className="h-4 w-4" />
                                    <span className="text-sm">Restore</span>
                                  </div>
                                </AlertDialogTrigger>
                              </DropdownMenuItem>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete your current
                                    thumbnail and restore our default thumbnail.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    className="cursor-pointer"
                                    disabled={restoreThumbnail.isPending}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <Button
                                    disabled={restoreThumbnail.isPending}
                                    onClick={onrestoreThumnail}
                                    className="w-14 cursor-pointer"
                                  >
                                    {restoreThumbnail.isPending ? (
                                      <Loader2 className="animate-spin text-[#ff0000] " />
                                    ) : (
                                      <h1>Ok</h1>
                                    )}
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col gap-y-4 lg:col-span-2 px-4  lg:px-6 py-4">
              <div className="flex border border-gray-300 shadow-lg shadow-gray-300 flex-col gap-4 bg-[#e5e7eb] h-fit overflow-hidden rounded-xl">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    autoplay={false}
                    thumbnailUrl={video.data.thumbnailUrl}
                    playbackId={video.data.muxPlaybackId}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-4">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-0">
                      <p className="text-[13px] text-gray-900 gap-2">
                        Video Link :
                      </p>
                      <Link href={`/video/${video.data.id}`}>
                        <p className="line-clamp-1 text-[14px] text-blue-600">
                          {fullurl}
                        </p>
                      </Link>
                    </div>
                    <div>
                      <AllTooltip content="Copy to Clipboard">
                        <Button
                          onClick={cliptoBoard}
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0 cursor-pointer rounded-full hover:bg-gray-300"
                          type="button"
                        >
                          {iscopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </AllTooltip>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-[13px] text-gray-900">
                      Video Status :{" "}
                    </h1>
                    <p className="capitalize line-clamp-1 text-[14px]">
                      {video.data.muxStatus || "Preparing"}
                    </p>
                  </div>
                  <div>
                    <h1 className="text-[13px] text-gray-900">
                      Subtitle Status :
                    </h1>
                    <p className="capitalize line-clamp-1 text-[14px]">
                      {video.data.muxTrackStatus || "no subtitle"}
                    </p>
                  </div>
                  <FormField
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] text-gray-900 font-normal">
                          Visibility :
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[50%] bg-white cursor-pointer">
                              <SelectValue placeholder="Video Status"></SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[100%]">
                            <SelectItem value="public">
                              {" "}
                              <Globe className="size-3 text-black" />
                              Public
                            </SelectItem>
                            <SelectItem value="private">
                              <LockIcon className="size-3 text-black" /> Private
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
