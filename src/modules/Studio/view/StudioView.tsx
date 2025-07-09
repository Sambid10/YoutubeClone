"use client"
import React from 'react'
import { VideoSection } from '../section/VideoSection'
import { useStudioSidebarStore } from '@/zustand/useStuidoSidebar'
import { cn } from '@/lib/utils'

export default function StudioView() {
    const {studioSidebar}=useStudioSidebarStore()
  return (
    <div className={cn(" ",{
        "ml-[5rem]":studioSidebar==="icon",
        "ml-[16.5rem]":studioSidebar==="fullmenu" 
    })}>
      <div className='flex flex-col border-b border-gray-400 shadows-sm -ml-2 pb-[9px] pt-2    '>
          <h1 className='text-3xl font-bold px-6'>Channel Content</h1>
          <h1 className='text-xs text-gray-500 px-6'>Manage your Channel content & videos</h1>
      </div>
        <VideoSection/>
    </div>
  )
}
