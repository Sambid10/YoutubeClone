export const dynamic= "force-dynamic"

import React from "react";
import Navbar from "@/modules/Navbar/Navbar";
import Sidebar from "@/modules/Navbar/Sidebar/Sidebar";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-roboto ">
      <Navbar disableiconSidebar={true} className="lg:block block pl-2"/>
      <div className="flex relative z-10 max-w-[100vw]  min-h-screen ">
        {children}
      </div>
    </div>
  );
}
