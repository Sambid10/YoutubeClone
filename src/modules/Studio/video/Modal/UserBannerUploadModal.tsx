"use client";
import * as z from "zod";
import ResponsiveDialog from "@/components/ResponsiveDialog/ResponsiveDialog";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { UserUpdateSchema, videoUpdateSchema } from "@/db/schema";
import { CropIcon, ImagePlus, Loader2, Trash } from "lucide-react";
import AllTooltip from "@/modules/Tooltip/AllTooltip";
import CropThumbnailModal from "./CropThumbnailModal";
import Resizer from "react-image-file-resizer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
                    croppedImage ? URL.createObjectURL(croppedImage) : user.bannerUrl!
                }
                banner={user.bannerUrl!}
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
        })
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

    const canCrop = Boolean(imageToEdit);

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
                    <div className="w-full relative bg-black cursor-pointer flex items-center  justify-center group overflow-hidden border-dashed border border-gray-400 aspect-[16/9]">
                        <Image
                            fill
                            alt="thumbnail"
                            className="object-contain group-hover:scale-105 group-hover:opacity-80 transition-all duration-200 ease-in"
                            src={
                                imageToEdit
                                    ? URL.createObjectURL(imageToEdit)
                                    : uploadedThumbnail
                                        ? URL.createObjectURL(uploadedThumbnail)
                                        : src
                            }
                        />
                        <div className="opacity-20 border border-gray-500 group-hover:opacity-100 transition-all duration-200 ease-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-gray-200/70 h-16 w-16">
                            <ImagePlus className="size-10 text-black" />
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
                    className={`w-24 bg-red-500 hover:bg-red-400 ${!src && "hidden"}`}
                >
                    <Trash />
                    Delete
                </Button>
                <Button
                    disabled={isUploading}
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
