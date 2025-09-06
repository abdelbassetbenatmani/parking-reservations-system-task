import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: Middleware runs on the server, so it cannot access localStorage directly.
// Tokens should be sent via cookies or headers for server-side authentication.

export function middleware(request: NextRequest) {
    const protectedPaths = ['/checkpoint', '/admin'];
    const { pathname } = request.nextUrl;

    // Check if the request is for a protected path
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        // Get token from cookies (since localStorage is not accessible on server)
        const token = request.cookies.get('token')?.value;

        if (!token) {
            // Redirect to login if token is missing
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
        // Optionally, verify the token here
    }

    return NextResponse.next();
}

// Specify the matcher for middleware
export const config = {
    matcher: ['/checkpoint/:path*', '/admin/:path*'],
};