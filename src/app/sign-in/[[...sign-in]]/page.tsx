import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className='h-[100dvh] flex items-center w-full justify-center'>
     <SignIn />
  </div>)
 
}