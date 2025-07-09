import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { db } from "@/db";
import { users } from "@/db/schema";
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET!;
  if (!SIGNING_SECRET) {
    throw new Error("NO SECRET");
  }
  const wh = new Webhook(SIGNING_SECRET);

  //headers
  const headerPayLoad = await headers();
  const svix_id = headerPayLoad.get("svix-id");
  const svix_timestamp = headerPayLoad.get("svix-timestamp");
  const svix_signature = headerPayLoad.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);
  let evt: WebhookEvent;
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("error", {
      status: 400,
    });
  }
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const data = evt.data;
    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
    });
    console.log("user created...")
   
  }
  if (eventType === "user.deleted") {
    const data = evt.data;
    if (!data.id) return new Response("Unauthorized", { status: 401 });
    await db.delete(users).where(eq(users.clerkId, data.id));
  }
  if (eventType === "user.updated") {
    const data = evt.data;
    await db
      .update(users)
      .set({
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, data.id));
  }
  return new Response("Webhook recieved",{status:200})
}
