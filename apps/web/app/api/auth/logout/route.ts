import { NextResponse } from "next/server";

const COOKIE_NAME = "em_token";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/login";
  const response = NextResponse.redirect(url);
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
