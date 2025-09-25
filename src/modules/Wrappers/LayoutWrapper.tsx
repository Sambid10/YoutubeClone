import React from 'react'

export default function LayoutWrapper({children}:{children:React.ReactNode}) {
  return (
    <div className='className="flex relative z-10 max-w-[100vw] overflow-x-clip'>
        {children}
    </div>
  )
}
