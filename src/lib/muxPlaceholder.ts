import {createBlurUp} from "@mux/blurup"

export const getPlaceholder=async(muxPlaybackId:string)=>{
    const {blurDataURL,aspectRatio}=await createBlurUp(muxPlaybackId)
    return {blurDataURL,aspectRatio}
}