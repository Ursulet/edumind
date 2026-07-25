import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

export async function POST(req: NextRequest) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caseId, productId, reason } = await req.json();

    const res = await fetch(`${API}/api/v1/cases/${caseId}/recommendations`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ productId, reason }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || "Failed to add recommendation" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Add recommendation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
