import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  integer,
  pgEnum,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

//users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);
export const UserUpdateSchema = createUpdateSchema(users);

export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  videoviews: many(videoviews),
  videoreactions: many(videoReactions),
  subsscriptions: many(UserSubscription,{
    relationName:"subscription_viewer_id_fk"
  }),
  subscribers: many(UserSubscription,{
    relationName:"subscription_creator_id_fk"
  }),
  comments:many(Comments),
  commentReaction:many(CommentReaction)
}));

//categories
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);
export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

//videos
export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);
export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_assetid").unique(),
  muxUploadId: text("mux_uploadId").unique(),
  muxPlaybackId: text("mux_playbackId").unique(),
  muxTrackId: text("mux_trackId").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailkey: text("thumbnail_key"),
  previewvideoUrl: text("preview_videoUrl"),
  previewvideoUrlkey: text("preview_videoUrl_key"),
  vidduration: integer("vid_duration"),
  visibility: videoVisibility("visibility").default("private").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_videos_user_id").on(t.userId),
  index("idx_videos_category_id").on(t.categoryId),
  index("idx_videos_visibility").on(t.visibility),
  uniqueIndex("uniq_mux_asset_id").on(t.muxAssetId),
  uniqueIndex("uniq_mux_upload_id").on(t.muxUploadId),
  uniqueIndex("uniq_mux_playback_id").on(t.muxPlaybackId),
]);

export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  categories: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(videoviews),
  videoreactions: many(videoReactions),
  Comments:many(Comments),

}));

//video views
export const videoviews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_views_primarykey",
      columns: [t.videoId, t.userId],
    }),
  ]
);

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoViewRealtions = relations(videoviews, ({ one }) => ({
  user: one(users, {
    fields: [videoviews.userId],
    references: [users.id],
  }),
  videos: one(videos, {
    fields: [videoviews.videoId],
    references: [videos.id],
  }),
}));

export const videoviewInsertSchema = createInsertSchema(videoviews);
export const videoviewUpdateSchema = createUpdateSchema(videoviews);
export const videoviewSelectSchema = createSelectSchema(videoviews);

// video reactions
export const videoreactionType = pgEnum("reaction_type", ["like", "dislike"]);
export const videoReactions = pgTable(
  "video_reactions",
  {
    videoId: uuid("video_id")
      .references(() => videos.id,{onDelete:"cascade"})
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id,{onDelete:"cascade"})
      .notNull(),
    reactiontype: videoreactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_reaction_pk",
      columns: [t.videoId, t.userId],
    })
  ]
);

export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionSelectSchema = createSelectSchema(videoReactions);

//for app level only doesnt change  anything in the schema in db
export const videoreactionRelations = relations(videoReactions, ({ one }) => ({
  user: one(users, {
    fields: [videoReactions.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));

//user subscription

export const UserSubscription = pgTable(
  "user_subscription",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    }),
     index("idx_user_subscription_viewer").on(t.viewerId),
  index("idx_user_subscription_creator").on(t.creatorId),
  ]
);

export const UserSubscriptionrelation = relations(
  UserSubscription,
  ({  one }) => ({
    creatorId: one(users, {
      fields: [UserSubscription.creatorId],
      references: [users.id],
      relationName:"subscription_creator_id_fk"
    }),
    viewerId: one(users, {
      fields: [UserSubscription.viewerId],
      references: [users.id],
       relationName:"subscription_viewer_id_fk"
    }),
  })
);


export const Comments=pgTable("comments",{
  id:uuid("id").primaryKey().defaultRandom(),
  userId:uuid("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
   parentId:uuid("parent_id"),
  videoId:uuid("video_id").references(()=>videos.id,{onDelete:"cascade"}).notNull(),
  commentinfo:text("comment_info").notNull(),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull()
},(t)=>[
  foreignKey({
    columns:[t.parentId],
    foreignColumns:[t.id],
    name:"comment_parent_id_fkey"
  }).onDelete("cascade"),
   index("idx_comments_video_id").on(t.videoId),
  index("idx_comments_user_id").on(t.userId),
  index("idx_comments_parent_id").on(t.parentId),
])

export const CommentRealtions=relations(Comments,({one,many})=>({
  user:one(users,{
    fields:[Comments.userId],
    references:[users.id]
  }),
  video:one(videos,{
    fields:[Comments.videoId],
    references:[videos.id]
  }),
  parent:one(Comments,{
    fields:[Comments.parentId],
    references:[Comments.id],
    relationName:"Comments_parent_fk"
  }),
  reactions:many(CommentReaction),
  replies:many(Comments,{
    relationName:"Comments_parent_fk"
  })
}))

export const CommentCreateSchema=createInsertSchema(Comments)
export const CommentUpdaeSchema=createUpdateSchema(Comments)
export const CommentSelectSchema=createSelectSchema(Comments)


export const CommentReactionenum=pgEnum("comment_reaction_type",["like","dislike"])
export const CommentReaction=pgTable("comment_reaction",{
  userId:uuid("user_id").references(()=>users.id).notNull(),
 
  commentId:uuid("comment_id").references(()=>Comments.id,{onDelete:"cascade"}).notNull(),
  reactionType:CommentReactionenum("reaction_type"),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull(),
},(t)=>[primaryKey({
  name:"comment_reaction_pk",
  columns:[t.userId,t.commentId]
}),
 index("idx_commentreaction_comment_id").on(t.commentId),
  index("idx_commentreaction_user_id").on(t.userId),
])

export const CommentReactionRealtion=relations(CommentReaction,({one})=>({
  user:one(users,{
    fields:[CommentReaction.userId],
    references:[users.id]
  }),
  comment:one(Comments,({
    fields:[CommentReaction.commentId],
    references:[Comments.id]
  })),
 
}))
