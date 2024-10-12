import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request) {
  try {
    const token = await getToken({ req: request, secret });
    const url = request.nextUrl;
    const { pathname } = url;

    const isAdminPath = (path) =>
      path.startsWith("/admin") || path.startsWith("/api/admin/");

    if (!token) {
      if (pathname.startsWith("/login")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(
        new URL(`/users/${token.username}`, request.url)
      );
    }

    if (
      pathname.startsWith("/api/users/:slug/edit") ||
      pathname.startsWith("/api/comments/delete") ||
      pathname.startsWith("/api/blogs/:slug/edit") ||
      pathname.startsWith("/blogs/create") ||
      pathname.startsWith("/api/blogs/create") ||
      pathname.startsWith("/blogs/:slug/edit")
    ) {
      return NextResponse.next();
    }

    if (isAdminPath(pathname)) {
      if (token.isAdmin || token.isSuper) {
        return NextResponse.next();
      }
      return NextResponse.redirect(
        new URL(`/users/${token.username}`, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/api/blogs/:slug/edit",
    "/blogs/create",
    "/api/blogs/create",
    "/api/users/:slug/edit",
    "/api/comments/create",
    "/api/comments/delete",
    "/blogs/:slug/edit",
    "/login",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
