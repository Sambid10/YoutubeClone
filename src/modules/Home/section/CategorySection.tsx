"use client";
import FilterCarasoul from "@/components/Filter-Carasoul/filter";
import { cn } from "@/lib/utils";
import CategorySkeleton from "@/modules/CategorySkeleton";
import { useTRPC } from "@/trpc/client";
import { useSidebarStore } from "@/zustand/useIconSidebar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface Props {
  categoryId?: string;
  classname?:string
}

export const CategorySection = ({ categoryId ,classname}: Props) => {
  const { openSideBar } = useSidebarStore();

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <ErrorBoundary fallback={<p>Error..</p>}>
        <div
          className={cn(
            `mb-0 w-full  pt-2 flex flex-col gap-y-6 relative justify-center`,
            {
              "lg:w-[80%] ": openSideBar === "main",
              "w-[100%]": openSideBar === "icon",
            }
          )}
        >
          <CategorySectionSuspense categoryId={categoryId} classname={classname}/>
          {/* <CategorySkeleton /> */}
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
const CategorySectionSuspense = ({ categoryId ,classname}: Props) => {
  const { openSideBar } = useSidebarStore();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const categories = data.map((category, id) => ({
    value: category.id,
    label: category.name,
  }));
  const searchParams = useSearchParams();
  const currentcategoryid = searchParams.get("categoryId");

  const loader=useTopLoader()
  const searchparmas=useSearchParams()
  const query=searchparmas.get("query")
  const router=useRouter()
  const onSelect=(value:string | null)=>{
     const nurl=new URL("/search",window.location.origin)
     const catid=value?.trim()
      if(catid)
      nurl.searchParams.set("categoryId",encodeURI(catid))

     if(query){
      nurl.searchParams.set("query",query)
     }
     if(catid === ""){
      nurl.searchParams.delete("categoryId")
     }
     loader.start()
     router.push(nurl.toString())
  }
 
  

  return (
    <div
      className={cn(" px-4 relative", {
        "lg:ml-28 lg:mr-4": openSideBar === "icon"
      })}
    >
      <FilterCarasoul
        onSelect={onSelect}
        value={currentcategoryid}
        data={categories}
        isLoading={false}
      />
    </div>
  );
};
