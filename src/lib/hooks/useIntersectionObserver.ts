import { useEffect,useState,useRef } from "react";

export const useIntersectionObserver=(options?:IntersectionObserverInit)=>{
    const [isintersecting,setisIntercenting]=useState(false)
    const targetRef=useRef<HTMLDivElement>(null)
    useEffect(()=>{
        const observer=new IntersectionObserver(([entry])=>{
            setisIntercenting(entry.isIntersecting)
        },options)
        if(targetRef.current){
            observer.observe(targetRef.current)
        }
        return()=>observer.disconnect()
    },[options])
    return {targetRef,isintersecting}
}