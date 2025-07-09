import { categoriesRouter } from '@/modules/Categories/server/procedure';
import {createTRPCRouter, protectedProcedure,  } from '../init';
import { studioRouter } from '@/modules/Studio/server/server';
import { videosRouter } from '@/modules/videos/procedure';
import { videoviewsRouter } from '@/modules/videoviews/procedure/server';
import { videoReactionRouter } from '@/modules/video-reaction/server';
import { SubscriptionRouter } from '@/modules/subscriptions/procedure/server';
import { CommentsRouter } from '@/modules/Comments/procedure/server';
import { CommentReactionRouter } from '@/modules/comment-reaction/modules/server';
import { SuggestionRouter } from '@/modules/Suggestion/procedure/server';
import { SearchRouter } from '@/modules/Search/procedure/server';
import { UserRouter } from '@/modules/User/modules/server';
import { playlistRouter } from '@/modules/playlists/procedure/server';
export const appRouter = createTRPCRouter({
  categories:categoriesRouter,
  stuido:studioRouter,
  video:videosRouter,
  videoviews:videoviewsRouter,
  videoReactions:videoReactionRouter,
  subscription:SubscriptionRouter,
  Comments:CommentsRouter,
  CommentReaction:CommentReactionRouter,
  Suggestion:SuggestionRouter,
  search:SearchRouter,
  User:UserRouter,
  playlist:playlistRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;