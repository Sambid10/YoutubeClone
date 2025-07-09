import React from "react";

import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
const UPLOADER_ID = "video-uploader";
interface Props {
  endpoint?: string | null;
  onSuccess: () => void;
}
export default function StudioUploader({ onSuccess, endpoint }: Props) {
  return (
    <div>
      <MuxUploader
        id={UPLOADER_ID}
        className="hidden group/uploader"
        endpoint={endpoint}
        onSuccess={onSuccess}
      />
      <MuxUploaderDrop className="group/drop pb-12 pt-6" muxUploader={UPLOADER_ID}>
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-gray-200 h-32 w-32">
            <UploadIcon className="size-10 text-gray-700 group/drop-[&[active]]:animate-bounce" />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-sm">Drag and drop video files to upload</p>
            <p className="text-xs text-gray-400">
              Your videos will be private until you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="cursor-pointer">
              Select files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden"/>
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm"/>
          <MuxUploaderProgress
            muxUploader={UPLOADER_ID}
            className="text-sm"
            type="percentage"
          />
          <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
        
      </MuxUploaderDrop>
    </div>
  );
}
