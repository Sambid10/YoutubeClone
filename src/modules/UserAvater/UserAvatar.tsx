import React from 'react'
import { cn } from '@/lib/utils'
import { AvatarImage,Avatar } from '@radix-ui/react-avatar'
import {cva,type VariantProps} from "class-variance-authority"
import { Heart } from 'lucide-react'

const avatarVariants=cva("",{
    variants:{
        size:{
            default:"h-9 w-9",
            xs:"h-4 w-4",
            sm:"h-6 w-6",
            custom:"h-10 w-10",
            lg:"h-11 w-11",
            xl:"h-[160px] w-[160px]"
        }
    },
    defaultVariants:{
        size:"default"
    }
})
interface UserAvatarProps extends VariantProps<typeof avatarVariants>{
    imageUrl:string,
    name?:string,
    className?:string,
    showHeart?:boolean,
    onClick?:()=>void
}

export default function UserAvatar({imageUrl,className,onClick,size,showHeart}:UserAvatarProps) {
    
  return (
    <Avatar className={cn(avatarVariants({size,className}),"relative")} onClick={onClick}>
        <AvatarImage src={imageUrl} alt='name' className={cn('rounded-full border-3 border-gray-300',className)}/>
        {showHeart &&     
        <div className=' absolute -bottom-[7px] left-3 border-b border-t-gray-50 border-t  border-b-gray-50 border-r border-r-gray-50 border-l border-l-gray-50 rounded-full p-[0.5px] '>
            <Heart className='size-4 fill-red-500 border-red-500  text-red-500'/>
        </div>
        }
    
    </Avatar>
  )
}
