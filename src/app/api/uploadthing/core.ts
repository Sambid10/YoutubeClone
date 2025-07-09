import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError ,UTApi} from "uploadthing/server";

import * as z from "zod";
const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);
    
    return { message: err.message };
  },
});
export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();
      console.log("UPLOADTHONG APO")
      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));
      if (!user) {
        throw new UploadThingError("No user found");
      }

      const[existingVideo]=await db.select({
       thumnailkey:videos.thumbnailkey
      }).from(videos).where(and(eq(videos.id,input.videoId),eq(videos.userId,user.id)))
      if(!existingVideo){
         throw new UploadThingError({code:"BAD_REQUEST"});
      }
      if(existingVideo.thumnailkey){
        const utapi=new UTApi()
        await utapi.deleteFiles(existingVideo.thumnailkey)
        await db.update(videos).set({
          thumbnailkey:null,thumbnailUrl:null
        }).where(and(eq(videos.id,input.videoId),eq(videos.userId,user.id)))
      }
      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.ufsUrl,
          thumbnailkey:file.key
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id)
          )
        );

      return { uploadedBy: metadata.user.clerkId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
