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
    const { assessmentId, caseId } = body;

    if (!assessmentId || !caseId) {
      return NextResponse.json({ error: "Missing assessmentId or caseId" }, { status: 400 });
    }

    const res = await fetch(`${API}/api/v1/cases/${caseId}/assessments/${assessmentId}/status`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DECLARED_COMPLETED" }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || "Failed to update" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment complete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
