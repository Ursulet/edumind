import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "em_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "MISSING_FIELDS", message: "Email și parola sunt obligatorii" },
        { status: 400 }
      );
    }

    // Forward login request to the NestJS API
    const apiUrl = process.env.INTERNAL_API_URL || "http://api:4000";
    const apiRes = await fetch(`${apiUrl}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        {
          error: data.error || "AUTH_ERROR",
          message: data.message || "Autentificare eșuată",
        },
        { status: apiRes.status }
      );
    }

    const { accessToken, user } = data;

    // Set httpOnly cookie with the JWT token
    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set(COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Auth Login Error]", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Eroare internă de server" },
      { status: 500 }
    );
  }
}
