/**
 * Server-side auth utilities for EduMind
 * JWT is stored in an httpOnly cookie named "em_token"
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "em_token";
const API_BASE = process.env.INTERNAL_API_URL || "http://api:4000";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  organizationId: string;
  permissions: string[];
}

/** Read the JWT token from the request cookie */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/** Decode JWT payload without verifying (verification happens on API) */
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

/** Check if a JWT token is expired */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() / 1000 > payload.exp;
}

/**
 * Get the current authenticated user from the API.
 * Returns null if not authenticated or token is invalid/expired.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token || isTokenExpired(token)) return null;

  try {
    const res = await fetch(`${API_BASE}/api/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Get the current user from cookie payload (fast, no API call).
 * Use only where you need role/id and don't need fresh data.
 */
export async function getUserFromToken(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token || isTokenExpired(token)) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return {
    id: (payload.sub as string) || "",
    email: (payload.email as string) || "",
    firstName: null,
    lastName: null,
    role: (payload.role as string) || "",
    organizationId: (payload.organizationId as string) || "",
    permissions: (payload.permissions as string[]) || [],
  };
}

/** Role-to-home-page mapping */
export function getHomeForRole(role: string): string {
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

/** Returns the auth header object if token exists, else empty */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
