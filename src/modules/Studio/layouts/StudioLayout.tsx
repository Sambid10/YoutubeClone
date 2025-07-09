import React from 'react'
import StudioNavbar from '../StudioNavbar/StudioNavbar'
export default function StudioLayout({children}:{
    children:React.ReactNode
}) {
  return (
    <div>
        <StudioNavbar/>
        {children}
    </div>
  )
}
