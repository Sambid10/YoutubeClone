import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define a route matcher to protect specific routes
const isProtectedRoute = createRouteMatcher([
  "/studio",
  "/user",
  "/history",
  "/likes",
  "/subscription",
  "/playlist",
  "/api/trpc/(.*)",
  "/api/uploadthing/(.*)"
   // Define the routes you want to protect
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Configure the middleware to apply to all relevant routes
export const config = {
  matcher: [
    // Exclude Next.js internal routes and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Apply the middleware to API and TRPC routes
    
  ],
};
