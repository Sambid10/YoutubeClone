"use client";
import { Input } from "@/components/ui/input";
import { useTopLoader } from "nextjs-toploader";
import { Search } from "lucide-react";
import React, { useState } from "react";
import FullSearchInput from "./FullSearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { url } from "inspector";

export default function SearchInput() {
  const [fullsearch, setfullsearch] = useState(false);
  const loader = useTopLoader();

  const router = useRouter();
  const searchparams = useSearchParams();
  const q = searchparams.get("query") || "";
  const [searchqueryvalue, setsearchqueryvalue] = useState(q);
  const categoryId = searchparams.get("categoryId") || "";
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nurl = new URL("/search", window.location.origin);
  
    const nquery = searchqueryvalue.trim();
    if (nquery !== "") {
      nurl.searchParams.set("query", nquery); // no need for encodeURIComponent
    }
      if (categoryId) {
      nurl.searchParams.set("categoryId", categoryId);
    }
    if (nquery === "") {
      nurl.searchParams.delete("query");
    }
  
    setsearchqueryvalue(searchqueryvalue);
    loader.start();
    router.push(nurl.toString());
  };
  function closefullSearch() {
    setfullsearch(false);
  }

  return (
    <div className="">
      <div className="relative hidden sm:block">
        <form onSubmit={handleSubmit}>
          <Input
            value={searchqueryvalue}
            onChange={(e) => setsearchqueryvalue(e.target.value)}
            placeholder="Search"
            className="rounded-tr-none rounded-br-none bg-white border-r-white px-4 focus:border-r-0 focus:border-blue-600 sm:h-9 md:h-10"
          />
          <button
            type="submit"
            title="Search"
            className="absolute sm:h-9 md:h-10 hover:bg-gray-200 ease-in z-0 duration-200 transition-colors cursor-pointer rounded-tr-full rounded-br-full -right-14 w-14 top-0 h-10 bg-gray-100 flex items-center border justify-center border-stone-400"
          >
            <Search className="text-gray-800" size={20} />
          </button>
        </form>
      </div>
      <div className="ml-auto">
        <button
          onClick={() => {
            setfullsearch(true);
          }}
          title="Search"
          className="sm:hidden flex hover:bg-gray-200 ease-in duration-200 transition-colors cursor-pointer rounded-full h-9 w-9 md:w-10 md:h-10 bg-gray-100  items-center border justify-center border-stone-400"
        >
          <Search className="text-gray-800" size={20} />
        </button>
      </div>
      {fullsearch && <FullSearchInput closefullSearch={closefullSearch} />}
    </div>
  );
}
