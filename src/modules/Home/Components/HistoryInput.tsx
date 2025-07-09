"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
export default function HistoryInput() {
  const searchparams = useSearchParams();
  const loader = useTopLoader();
  const searchparamsquery = searchparams.get("historyquery") || "";
  const router = useRouter();
  const [query, setQuery] = useState(searchparamsquery);

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = new URL("/history", window.location.origin);
    const nquery = query.trim();
    if (query) {
      url.searchParams.set("historyquery", nquery);
    }
    loader.start();
    router.push(url.toString());
  };


  return (
    <div className="relative">
      <form onSubmit={handleChange}>
        <Input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="Search history"
          className="border-t-0 focus:border-b-blue-700 border-gray-400 borde-b border-r-0 border-l-0 pl-10 rounded-none"
        />
        <button
          type="submit"
          title="Search"
          className=" absolute top-1/2 left-0 -translate-y-1/2 hover:bg-gray-200/50 cursor-pointer px-2 py-2 rounded-full"
        >
          <Search className="size-5 text-gray-800" />
        </button>
      </form>
    </div>
  );
}
