"use client"
import React from 'react'
import { Menu } from 'lucide-react'
import { useStudioSidebarStore } from '@/zustand/useStuidoSidebar'
import StudioIconSidebarContent from './StudioIconSidebarContent'
import StudioSideBarContent from './StudioSideBarContent'
export default function StudioSidebarIcon() {
    const {setstudioSidebar,studioSidebar}=useStudioSidebarStore()
  return (
    <div className="">
      <div
        onClick={setstudioSidebar}
        className="hover hover:bg-gray-200 rounded-full px-2 py-2 ease-in duration-100 transition-colors cursor-pointer"
      >
        <Menu size={22} className="text-gray-800" />
      </div>
      {studioSidebar === "icon" ? <StudioIconSidebarContent/> : <StudioSideBarContent/>}
    
    </div>
  )
}
