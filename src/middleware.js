import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request) {
  try {
    const token = await getToken({ req: request, secret });
    const url = request.nextUrl;

    if (token) {
      if (
        url.pathname.startsWith("/api/blogs/create") ||
        url.pathname.startsWith("/api/users/:slug/edit") ||
        url.pathname.startsWith("/api/comments/delete") ||
        url.pathname.startsWith("/api/comments/create") ||
        url.pathname.startsWith("/api/blogs/:slug/edit") ||
        url.pathname.startsWith("/blogs/:slug/edit")
      ) {
        return NextResponse.next();
      } else if (url.pathname.startsWith("/login")) {
        return NextResponse.redirect(
          new URL(`/users/${token.username}`, request.url)
        );
      } else if (url.pathname.startsWith("/admin/")) {
        if (token.isAdmin) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(`/users/${token.username}`, request.url)
          );
        }
      }
    } else {
      if (url.pathname.startsWith("/login")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/api/blogs/create",
    "/api/blogs/:slug/edit",
    "/api/users/:slug/edit",
    "/api/comments/create",
    "/api/comments/delete",
    "/blogs/:slug/edit",
    "/login",
    "/admin/:path*",
  ],
};
