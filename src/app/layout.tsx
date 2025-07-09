import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import NextTopLoader from "nextjs-toploader";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KathmaTube",
  description: "Watch your videos and enjoy...",
    icons: {
    icon: "/yt.png", // points to /public/favicon.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <ClerkProvider>
        <html lang="en">
         
          <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <Toaster
              position="bottom-center"
              toastOptions={{
                unstyled: true,
                classNames: {
                  icon: "text-sm",
                  error: "bg-red-400",
                  success:
                    "text-white  bg-gray-950 rounded-md flex items-center gap-2 px-9 text-sm py-3",
                  warning: "text-yellow-400",
                  info: "bg-blue-400",
                },
              }}
            />
            <NextTopLoader
              color="#FF0000"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
           
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              zIndex={1600}
              showAtBottom={false}
            />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </TRPCReactProvider>
  );
}
