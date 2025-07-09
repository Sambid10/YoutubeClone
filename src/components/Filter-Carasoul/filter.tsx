"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}
export default function FilterCarasoul({
  data,
  isLoading,
  onSelect,
  value,
}: Props) {
  const [leftarrow, setleftarrow] = useState(false);
  const [rightarrow, setrightarrow] = useState(false);
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const containerref = useRef<HTMLDivElement>(null);
  const checksrcoll = () => {
    if (containerref.current) {
      const { scrollWidth, scrollLeft, clientWidth } = containerref.current;
      setleftarrow(scrollLeft > 0);
      setrightarrow(scrollLeft + clientWidth < scrollWidth - 12);
    }
  };
  useEffect(() => {
    const el = containerref.current;
    if (!el) return;
    checksrcoll();
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "instant", // no animation
        inline: "center", // scroll just enough horizontally to make it visible
        block: "nearest", // no vertical movement
      });
    }
    el.addEventListener("scroll", checksrcoll);
    window.addEventListener("resize", checksrcoll);
    return () => {
      el.removeEventListener("scroll", checksrcoll);
      window.removeEventListener("resize", checksrcoll);
    };
  }, [checksrcoll]);
  const handleleftClick = () => {
    if (containerref.current) {
      containerref.current.scrollLeft -= 500;
    }
  };
  const handlerightClick = () => {
    if (containerref.current) {
      containerref.current.scrollLeft += 500;
    }
  };
  return (
    <div
      ref={containerref}
      className="flex flex-nowrap category  gap-4  scroll-smooth  "
    >
      <button
      onClick={()=>onSelect(null)}
        className={`${
          value === null
            ? "bg-black text-white hover:bg-[#121212]"
            : "bg-gray-200 hover:bg-gray-300"
        } cursor-pointer ease-in duration-200 transition-colors  py-2 text-sm px-4  rounded-md text-gray-900`}
      >
        All
      </button>

      {data.map((cat, i) => (
        <div
          ref={cat.value === value ? selectedRef : undefined}
          key={i}
          className="whitespace-nowrap "
        >
          <button
            onClick={() => onSelect(cat.value)}
            className={`${
              cat.value === value
                ? "bg-black text-white hover:bg-[#121212]"
                : "bg-gray-200 hover:bg-gray-300"
            } cursor-pointer ease-in duration-200 transition-colors  py-2 text-sm px-4  rounded-md text-gray-900`}
          >
            {cat.label}
          </button>
        </div>
      ))}

      {/* Left Shadow */}
      {leftarrow && (
        <div className="pointer-events-none absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white via-gray-50 to-transparent" />
      )}

      {/* Right Shadow */}
      {rightarrow && (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white via-gray-50 to-transparent" />
      )}
      {leftarrow && (
        <button
          onClick={handleleftClick}
          className="absolute  hover:bg-gray-200 cursor-pointer  top-1/2 left-0 -translate-y-1/2 transition-colors rounded-full px-2 py-2"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      {rightarrow && (
        <button
          onClick={handlerightClick}
          className="absolute hover:bg-gray-200 ease-in duration-200  cursor-pointer transition-colors rounded-full px-2 py-2  right-0 top-1/2 -translate-y-1/2"
        >
          <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
}
