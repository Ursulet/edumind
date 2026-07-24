import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

export async function POST(req: NextRequest) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${API}/api/v1/scheduling/appointments`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to book" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
