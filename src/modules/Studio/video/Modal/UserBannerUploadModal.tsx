"use client";
import * as z from "zod";
import ResponsiveDialog from "@/components/ResponsiveDialog/ResponsiveDialog";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { UserUpdateSchema, videoUpdateSchema } from "@/db/schema";
import { CropIcon, ImagePlus, Loader, Loader2, Trash } from "lucide-react";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import CropThumbnailModal from "./CropThumbnailModal";
import Resizer from "react-image-file-resizer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useUploadThing } from "@/utils/uploadthing/uploadthing";
interface Props {
    open: boolean;
    userId: string;
    user: z.infer<typeof UserUpdateSchema>;
    onOpenChange: (open: boolean) => void;
}

export default function UserBannerUploadModal({
    onOpenChange,
    open,
    userId,
    user,
}: Props) {
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    return (
        <ResponsiveDialog
            title="Upload your new Banner"
            open={open}
            openChange={onOpenChange}
        >
            <BannerInput
                userId={userId}
                src={
                    croppedImage ? URL.createObjectURL(croppedImage) : user.bannerUrl || ""
                }
                banner={user.bannerUrl ||
                    ""
                }
                onOpenChange={onOpenChange}
                onImageCropped={setCroppedImage}
            />
        </ResponsiveDialog>
    );
}

interface ThumbnailInputProps {
    src: string;
    userId: string;
    banner?: string;
    onImageCropped: (blob: Blob | null) => void;
    onOpenChange: (open: boolean) => void,
}

function BannerInput({
    onImageCropped,
    onOpenChange,
    src,
    userId,
    banner,
}: ThumbnailInputProps) {
    const [uploadedThumbnail, setUploadedThumbnail] = useState<File>();
    const [imageToEdit, setImageToEdit] = useState<Blob | File>();
    const [cropDialogOpen, setCropDialogOpen] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter()
    const { startUpload, isUploading } = useUploadThing("profileBanner", {
        onClientUploadComplete: () => {
            onOpenChange(false)
            router.refresh()
            toast.custom(() => (
                <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
                    <h1 className="text-left">Banner updated.</h1>
                </div>
            ));


        }
    });
    async function save() {
        if (!imageToEdit) return;
        const file = new File([imageToEdit], "banner.webp", {
            type: "image/webp"
        })
        await startUpload([file], {
            userId: userId
        }).then(()=>router.refresh())
    }
    function onImageSelected(image: File | undefined) {
        if (!image) return;

        Resizer.imageFileResizer(
            image,
            1280,
            720,
            "WEBP",
            100,
            0,
            (uri) => {
                const file = uri as File;
                setUploadedThumbnail(file);
                setImageToEdit(file);
            },
            "file"
        );
    }
    const trpc = useTRPC()
    const canCrop = Boolean(imageToEdit);
    const deleteBanner = useMutation(
        trpc.User.deleteBanner.mutationOptions({
            onSuccess: () => {
                toast.custom(() => (
                    <div className="text-white bg-gray-950 rounded-md w-[250px] px-4 py-4 text-sm text-center">
                        <h1 className="text-left">Banner Deleted.</h1>
                    </div>
                ));
                onOpenChange(false)
                router.refresh()
            }, onError: () => {
                toast.custom(() => (
                    <div className="text-white bg-red-400 rounded-md w-[250px] px-4 py-4 text-sm text-center">
                        <h1 className="text-left">Something went wrong.</h1>
                    </div>
                ));
            }
        })
    )
    const previewSrc =
        imageToEdit
            ? URL.createObjectURL(imageToEdit)
            : uploadedThumbnail
                ? URL.createObjectURL(uploadedThumbnail)
                : src || null;

    return (
        <>
            <input
                ref={fileRef}
                className="hidden sr-only"
                type="file"
                accept="image/*"
                onChange={(e) => onImageSelected(e.target.files?.[0])}
            />
            <AllTooltip content="Change Banner">
                <button type="button" onClick={() => fileRef.current?.click()}>
                    <div className="w-full relative bg-black cursor-pointer flex items-center justify-center group overflow-hidden border-dashed border border-gray-400 aspect-[16/9]">
                        {previewSrc ? (
                            <Image
                                fill
                                unoptimized
                                alt="thumbnail"
                                src={previewSrc}
                                className="object-contain group-hover:scale-105 group-hover:opacity-80 transition-all"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <ImagePlus className="size-10" />
                                <span className="text-sm mt-1">Upload banner</span>
                            </div>
                        )}

                        <div className="opacity-20 group-hover:opacity-100 transition absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-gray-200/70 h-16 w-16 flex items-center justify-center">
                                <ImagePlus className="size-10 text-black" />
                            </div>
                        </div>
                    </div>
                </button>
            </AllTooltip>

            <div className="flex items-center justify-end gap-2 mt-2">
                <Button
                    onClick={() => setCropDialogOpen(true)}
                    className="w-24"
                    disabled={!canCrop || isUploading}
                >
                    <CropIcon />
                    Crop
                </Button>
                <Button
                disabled={deleteBanner.isPending || isUploading }
                    onClick={() => deleteBanner.mutate({ userId: userId })}
                    className={`w-24 bg-red-500 hover:bg-red-400 ${!src && "hidden"}`}
                >

                    {deleteBanner.isPending ? <Loader2 className="animate-spin" /> :
                        <>
                            <Trash />
                            <h1>Delete</h1>
                        </>
                    }
                </Button>
                <Button
                    disabled={isUploading || deleteBanner.isPending}
                    className="w-20" onClick={save}>
                    {isUploading ? <Loader2 className="animate-spin text-[#ff0000] " /> : <h1>Save</h1>}
                </Button>
            </div>

            {cropDialogOpen && uploadedThumbnail && (
                <CropThumbnailModal
                    cropAspectRatio={3.66}
                    src={URL.createObjectURL(uploadedThumbnail)} // Always use original
                    onCropped={(blob) => {
                        setImageToEdit(blob!); // Display the cropped image
                        onImageCropped(blob); // Send it up to parent
                    }}
                    onClose={() => setCropDialogOpen(false)}
                />
            )}
        </>
    );
}
