import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect /d and all sub-routes
  const isProtectedRoute = path.startsWith('/d');
  const isSignInRoute = path.startsWith('/signin');

  // We check for the NextAuth session token cookie. 
  // Depending on whether it's production or development (HTTPS vs HTTP),
  // NextAuth uses different cookie prefixes. 
  const hasSession = 
    request.cookies.has('next-auth.session-token') || 
    request.cookies.has('__Secure-next-auth.session-token');

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect to dashboard if trying to access signin while already logged in
  if (isSignInRoute && hasSession) {
    return NextResponse.redirect(new URL('/d', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/d/:path*', '/d', '/signin'],
};
