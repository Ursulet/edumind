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
    const { applicationId, specialistId, journeyTemplateId, departmentId } = body;

    if (!applicationId || !specialistId || !journeyTemplateId || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, specialistId, journeyTemplateId, departmentId" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API}/api/v1/applications/${applicationId}/convert`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ specialistId, journeyTemplateId, departmentId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || "Conversion failed" }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Convert application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
