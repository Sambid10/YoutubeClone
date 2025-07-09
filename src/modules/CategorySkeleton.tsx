import React from 'react'
import Skeleton from './Skeleton'
export default function CategorySkeleton() {
  return (
    <div className='px-[14px] max-w-[calc(100vw-20rem)] flex justify-start  items-center overflow-clip gap-4 h-11 mt-1'>
     {Array.from({ length: 19 }).map((_, index) => (
        <div key={index} className="">
          {" "}
          {/* Prevent shrinking of items */}
          <Skeleton className=" px-2 py-2 rounded-md text-sm w-[150px] animate-pulse font-semibold">
            &nbsp;
          </Skeleton>
        </div>
      ))}</div>
   
  )
}
