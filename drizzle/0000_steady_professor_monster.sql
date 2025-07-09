CREATE TYPE "public"."video_visibility" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "video_reactions" (
	"video_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"reactiontype" "video_reaction" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "video_reaction_pk" PRIMARY KEY("video_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"mux_status" text,
	"mux_assetid" text,
	"mux_uploadId" text,
	"mux_playbackId" text,
	"mux_trackId" text,
	"mux_track_status" text,
	"thumbnail_url" text,
	"thumbnail_key" text,
	"preview_videoUrl" text,
	"preview_videoUrl_key" text,
	"vid_duration" integer,
	"visibility" "video_visibility" DEFAULT 'private' NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "videos_mux_assetid_unique" UNIQUE("mux_assetid"),
	CONSTRAINT "videos_mux_uploadId_unique" UNIQUE("mux_uploadId"),
	CONSTRAINT "videos_mux_playbackId_unique" UNIQUE("mux_playbackId"),
	CONSTRAINT "videos_mux_trackId_unique" UNIQUE("mux_trackId")
);
--> statement-breakpoint
CREATE TABLE "video_views" (
	"user_id" uuid NOT NULL,
	"video_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "video_views_primarykey" PRIMARY KEY("video_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "video_reactions" ADD CONSTRAINT "video_reactions_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_reactions" ADD CONSTRAINT "video_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_views_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "clerk_id_idx" ON "users" USING btree ("clerk_id");