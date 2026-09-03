import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "ths_session";
const APP_PREFIXES = ["/student", "/teacher", "/admin"];

function isAppPath(pathname: string) {
  return APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isPublicAuthApi(pathname: string) {
  return (
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/register" ||
    pathname === "/api/auth/reset-password" ||
    pathname === "/api/auth/logout" ||
    pathname === "/api/auth/google" ||
    pathname === "/api/health/firebase"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (isAppPath(pathname) && !token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/api/") && !isPublicAuthApi(pathname) && !token) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student",
    "/student/:path*",
    "/teacher",
    "/teacher/:path*",
    "/admin",
    "/admin/:path*",
    "/api/:path*",
  ],
};
