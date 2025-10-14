/**
 * Next.js Middleware - Route Protection
 * Redirects unauthenticated users to /auth
 */

import { NextRequest, NextResponse } from "next/server";

// Protected routes (require authentication)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/selko",
  "/vat",
  "/billing",
  "/reports",
  "/legal",
  "/admin",
  "/settings",
  "/receipts",
  "/ai"
];

// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  "/auth",
  "/login",
  "/logout",
  "/"
];

export function middleware(request: NextRequest) {
  // 🔓 DEV MODE: Auth disabled for MVP testing
  // TODO: Re-enable for production
  return NextResponse.next();
  
  /* ORIGINAL AUTH CODE (commented out for MVP testing):
  const { pathname } = request.nextUrl;
  
  // Check if route needs authentication
  const needsAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  
  if (!needsAuth) {
    return NextResponse.next();
  }
  
  // Check for session cookie
  const sessionCookie = request.cookies.get("converto_session");
  
  if (!sessionCookie?.value) {
    // Not authenticated - redirect to auth page
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname);
    
    return NextResponse.redirect(url);
  }
  
  // Authenticated - allow request
  return NextResponse.next();
  */
}

export const config = {
  // Match all routes except static files and API routes
  matcher: ["/((?!_next|api|public|favicon.ico|.*\\..*).*)"],
};

