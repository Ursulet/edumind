import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check if the database is reachable
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "educariera-web",
      database: "connected"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Health check failed:", error);
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      service: "educariera-web",
      database: "disconnected",
      message: "Database connection failed"
    }, { status: 503 }); // 503 Service Unavailable is standard for failed health checks
  }
}
