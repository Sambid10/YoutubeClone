import { CategorySection } from "@/modules/Home/section/CategorySection";
import React from "react";
interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}
import { ResultSection } from "../../section/ResultSection";
export default function SearchView({ query, categoryId }: PageProps) {
  return (
    <div className=" flex flex-col w-screen  relative min-h-screen overflow-x-clip   ">
      <CategorySection  categoryId={categoryId} />
      <div className="mt-2">
        <ResultSection categoryId={categoryId} query={query} />
      </div>
    </div>
  );
}
