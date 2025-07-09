import { RefObject, useEffect } from "react";

interface Props {
  ref: NonNullable<RefObject<HTMLDivElement | null>>;
  closeref: NonNullable<RefObject<HTMLDivElement | null>>;
  handler: (event: TouchEvent | MouseEvent) => void;
}

export function useOutsideClick({ ref, handler, closeref }: Props) {
  useEffect(() => {
    const listener = (event: TouchEvent | MouseEvent) => {
      if(!closeref) return
      if (
        !closeref.current ||
        closeref.current.contains(event.target as Node)
      ) {
        handler(event);
      }
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchcancel", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchcancel", listener);
    };
  }, [ref, handler]);
}
