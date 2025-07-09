import { eq } from "drizzle-orm";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackCreatedWebhookEvent
  | VideoAssetDeletedWebhookEvent;
export const SIGNING_SECRET = process.env.MUX_SIGNING_SECRET;
export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("No Signing Secret found for mux");
  }
  const headersPayload = await headers();
  const muxsignature = headersPayload.get("mux-signature");
  if (!muxsignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxsignature,
    },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload ID", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;
      if (!data.upload_id) {
        return new Response("Missing upliad id", { status: 400 });
      }
      if (!playbackId) {
        return new Response("No vid playback id", { status: 400 });
      }
      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const videopreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const vidduration = data.duration ? Math.round(data.duration * 1000) : 0;
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          previewvideoUrl: videopreviewUrl,
          vidduration: vidduration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upliad id", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("Missing upliad id", { status: 400 });
      }
      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.track.created": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };
      //Typesctipt le asset_id xaina vanxa
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing upliad id", { status: 400 });
      }
      await db.update(videos).set({
        muxTrackId:trackId,
        muxTrackStatus:status
      }).where(eq(videos.muxAssetId,assetId))
    }
  }
  return new Response("Webhook recieved", { status: 200 });
};
