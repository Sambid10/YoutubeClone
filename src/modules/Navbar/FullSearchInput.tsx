"use client";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, X } from "lucide-react";
import React, { useRef } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTopLoader } from "nextjs-toploader";
export default function FullSearchInput({
  closefullSearch,
}: {
  closefullSearch: (open: boolean) => void;
}) {
  const ref = useRef(null);
  const router = useRouter();
  const btnref = useRef(null);
  const loader=useTopLoader()
  const [searchqueryvalue, setsearchqueryvalue] = useState("");
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nurl = new URL("/search", window.location.origin);
    
    const nquery = searchqueryvalue.trim();
    nurl.searchParams.set("query", encodeURIComponent(nquery));
    if (nquery === "") {
      nurl.searchParams.delete("query");
    }
    setsearchqueryvalue(searchqueryvalue);
     loader.start()
    router.push(nurl.toString());
  };
  useOutsideClick({
    ref: ref,
    closeref: btnref,
    handler: () => closefullSearch(true),
  });

  return (
    <div
      ref={ref}
      className="fixed sm:hidden left-0 h-14 bg-white top-0 z-[50] flex items-center w-full px-2"
    >
      <div>
        <button
          ref={btnref}
          title="Close"
          className="flex items-center bg-white hover:bg-gray-200 ease-in duration-200 transition-colors rounded-full px-2 py-2 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Centered search input + button */}
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-center justify-center mx-auto w-[65%]">
          <Input
            value={searchqueryvalue}
            onChange={(e) => setsearchqueryvalue(e.target.value)}
            placeholder="Search"
            className="rounded-r-none h-9 px-4 focus:border-blue-600"
          />
          {/* {searchqueryvalue && 
            <button
            type="button"
            onClick={()=>setsearchqueryvalue("")}
            >
              <X
               className="h-9 w-14 flex items-center justify-center border border-l-0 border-stone-400 bg-gray-100 hover:bg-gray-200 rounded-r-full transition-colors duration-200 ease-in"
              />
            </button>
} */}
          <button
            title="Search"
            type="submit"
            className="h-9 w-14 flex items-center justify-center border border-l-0 border-stone-400 bg-gray-100 hover:bg-gray-200 rounded-r-full transition-colors duration-200 ease-in"
          >
            <Search className="text-gray-800" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
