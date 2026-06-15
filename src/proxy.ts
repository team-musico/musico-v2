import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { legacyAuthCookies } from "@/features/auth/server/legacy-auth-cookies";
import { verifyAccessToken } from "@/features/auth/server/verify-access-token";
import { updateSession } from "@/utils/supabase/middleware";

const protectedRoutes = ["/chart", "/new", "/playlists"] as const;

const isProtectedRoute = (pathname: string) =>
  protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const createAuthRedirect = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/auth";
  url.search = "";
  url.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(url);
  response.cookies.delete(legacyAuthCookies.access);

  return response;
};

export async function proxy(request: NextRequest) {
  if (isProtectedRoute(request.nextUrl.pathname)) {
    const token = request.cookies.get(legacyAuthCookies.access)?.value;

    if (!token) {
      return createAuthRedirect(request);
    }

    try {
      await verifyAccessToken(token);
    } catch {
      return createAuthRedirect(request);
    }
  }

  return updateSession(request);
}

export const proxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
