export const dynamic= "force-dynamic"

import React from "react";
import Navbar from "@/modules/Navbar/Navbar";
import Sidebar from "@/modules/Navbar/Sidebar/Sidebar";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-roboto ">
      <Navbar />
      <div className="flex relative z-10 max-w-[100vw] overflow-x-clip  ">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
