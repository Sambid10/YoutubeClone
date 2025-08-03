"use client"
import { useTRPC } from '@/trpc/client'
import {useSuspenseInfiniteQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import VideoRowCard from '../components/VideoRowCard'
import SuggestionSkeletonList from '@/modules/SuggestionSkeleton'
import InfiniteScroll from '@/components/InfinteSrcoll/InfinteSroll'
export default function SuggestionSection({videoId}:{
    videoId:string
}) {
  return (
    <Suspense fallback={<SuggestionSkeletonList/>}>
        <ErrorBoundary fallback={<p>error</p>}>
            <SuggestionSectionSuspense videoId={videoId}/>
        </ErrorBoundary>
    </Suspense>
  )
}

function SuggestionSectionSuspense({videoId}:{
    videoId:string
}){
    const trpc=useTRPC()
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,}=useSuspenseInfiniteQuery(
        trpc.Suggestion.getMany.infiniteQueryOptions({
            limit:7,
            videoId:videoId
        },{
            getNextPageParam:(oldpage)=>oldpage.nextCursor
        })
    )
    const flatmappeddata=data.pages.flatMap((page)=>page.items)
    if(flatmappeddata.length < 0){
        return (
            <h1>No suggestions videos found!!</h1>
        )
    }
    return (
        <div className='grid sm:grid-cols-2  mb-6 relative grid-cols-1 md:grid-cols-3 lg:grid-cols-1'>

                {flatmappeddata.map((data)=>
                   <VideoRowCard data={data} key={data.id}/>
                )}
                {hasNextPage && 
                 <div className=' absolute lg:-bottom-12 -bottom-8 md:-bottom-10 w-full'>
                <InfiniteScroll
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                message={"Show more"}
                isManual={true}
                />
                </div>
                }
                {!hasNextPage && <h1 className='absolute lg:-bottom-10 -bottom-10 md:-bottom-10  text-xs text-gray-600 font-medium left-[45%] -translate-y-1/2 mt-4'>End of the list..</h1>}
               
        </div>
    )
}