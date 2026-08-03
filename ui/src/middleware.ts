import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Demo user data role (default to "user")
    const role = request.cookies.get("role")?.value || request.cookies.get("user_role")?.value || "user";

    // Handle /user path
    if (pathname === "/user" || pathname === "/user/") {
        if (role === "user") {
            return NextResponse.redirect(new URL("/user/dashboard", request.url));
        } else if (role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Protect /user/* subroutes
    if (pathname.startsWith("/user")) {
        if (role !== "user" && role !== "admin") {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Handle /admin path
    if (pathname === "/admin" || pathname === "/admin/") {
        if (role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else {
            // If user role is "user" or unauthorized, redirect to /auth/login
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Protect /admin/* subroutes
    if (pathname.startsWith("/admin")) {
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/user', '/user/:path*', '/admin', '/admin/:path*'],
};
