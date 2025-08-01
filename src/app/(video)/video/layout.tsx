export const dynamic= "force-dynamic"
import React from "react";
import Navbar from "@/modules/Navbar/Navbar";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-roboto ">
      <Navbar disableiconSidebar={true} className="lg:block "/>
      <div className="flex relative z-10 max-w-[100vw]  min-h-screen ">
        {children}
      </div>
    </div>
  );
}
