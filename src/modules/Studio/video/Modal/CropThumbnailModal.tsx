import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "cropperjs/dist/cropper.css";
import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

interface Props {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export default function CropThumbnailModal({
  cropAspectRatio,
  onClose,
  onCropped,
  src,
}: Props) {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => {
      onCropped(blob);
    }, "image/webp");

    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Crop Image?</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={true}
          zoomable={false}
          viewMode={1}
          ref={cropperRef}
        />
        <DialogFooter className="flex justify-end gap-4">
          <DialogClose className="bg-gray-200 rounded-lg px-6 border border-stone-200 cursor-pointer hover:bg-gray-300 transition-all ease-in duration-200">Cancel</DialogClose>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
