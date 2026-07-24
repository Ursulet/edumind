import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "em_token";

/** Routes that don't require authentication */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/inscriere",
  "/cum-functioneaza",
  "/servicii",
  "/intrebari-frecvente",
  "/contact",
  "/termeni",
  "/confidentialitate",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/v1/health",
];

/** Routes that redirect authenticated users away (login page) */
const AUTH_ONLY_ROUTES = ["/login"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;
    const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() / 1000 > payload.exp;
}

function getHomeForRole(role: string): string {
  switch (role) {
    case "PLATFORM_OWNER":
    case "SUPER_ADMIN":
      return "/admin";
    case "DEPARTMENT_ADMIN":
      return "/director";
    case "SPECIALIST":
      return "/specialist";
    case "PARENT":
    default:
      return "/dashboard";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isAuthenticated = token && !isTokenExpired(token);

  // If user is authenticated and tries to visit /login → redirect to their home
  if (isAuthenticated && AUTH_ONLY_ROUTES.some((r) => pathname === r)) {
    const payload = decodeJwtPayload(token!);
    const role = (payload?.role as string) || "PARENT";
    return NextResponse.redirect(new URL(getHomeForRole(role), request.url));
  }

  // If route requires auth and user is not authenticated → redirect to login
  if (!isPublicRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
