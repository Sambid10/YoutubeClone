import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/zustand/useIconSidebar'
export default function SearchLoader() {
    const {openSideBar}=useSidebarStore()
  return (
   <div
            className={cn(
              `mb-4 w-full  pt-2 flex flex-col gap-y-6 relative justify-center`,
              {
                "lg:w-[80%] ": openSideBar === "main",
                "w-[100%]": openSideBar === "icon",
              }
            )}
          >
              <Loader2 className="animate-spin mx-auto text-[#ff0000] font-semibold"/>
          </div>
  )
}

