import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

export async function GET(req: NextRequest) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");
    const date = searchParams.get("date");
    const typeId = searchParams.get("typeId");

    const res = await fetch(`${API}/api/v1/scheduling/slots?staffId=${staffId}&date=${date}&typeId=${typeId}`, {
      headers: { ...headers }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
