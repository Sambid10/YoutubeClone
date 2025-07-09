"ise client"
interface HomeViewProps {
  categoryId?: string;
}
import {HomeSection} from "../section/HomeSection";
import React from "react";
import { CategorySection } from "../section/CategorySection";
export default function HomeView({ categoryId }: HomeViewProps) {
  return (
  <div>
     <div className=" flex flex-col w-screen  relative min-h-[calc(100dvh-64px)] overflow-x-clip ">
           <CategorySection  categoryId={categoryId} />
           <div className="mt-2">
            <HomeSection/>
           </div>
         </div>
  </div>
 );
}
