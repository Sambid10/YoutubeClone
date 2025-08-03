"use client"
import {CircleUserRound, Film } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
export default function AuthButton() {
  return (
    <>
      <SignedOut>
        <Link href={"/sign-in"}>
          <button className="h-9 md:h-10 text-blue-500 px-4 cursor-pointer hover:bg-gray-200  bg-gray-100 ease-in duration-200 transition-colors   flex items-center gap-1 font-semibold text-sm rounded-full border-gray-400 border">
            <CircleUserRound size={18} />
            Sign in
          </button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "40px",
                height: "40px",
              },
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
            label="Studio"
            href="/studio"
            labelIcon={<Film className="size-4"/>}
            >

            </UserButton.Link>
          </UserButton.MenuItems>
          </UserButton>
      </SignedIn>
    </>
  );
}
