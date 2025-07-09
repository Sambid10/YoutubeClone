import React, { RefObject, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import data from "@emoji-mart/data";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

export default function EmojiPicker({
  onEmojiSelect,
  onClose,
  btnref,
}: {
  onEmojiSelect: (emoji: any) => void;
  onClose: () => void;
  btnref: NonNullable<RefObject<HTMLButtonElement | null>>;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: TouchEvent | MouseEvent) => {
      if (!btnref.current || btnref.current.contains(event.target as Node)) {
        return;
      }
      if (
        !pickerRef.current ||
        pickerRef.current.contains(event.target as Node)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchcancel", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchcancel", listener);
    };
  }, [btnref, onClose, pickerRef]);

  return (
    <div ref={pickerRef} className="z-50 top-0 -left-32">
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        previewPosition="none"
        theme="light"
      />
    </div>
  );
}
