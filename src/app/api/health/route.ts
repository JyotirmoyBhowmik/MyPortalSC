import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "operational",
        timestamp: Date.now(),
        version: process.env.npm_package_version || "1.0.0",
        uptime: process.uptime?.() ?? 0,
        environment: process.env.VERCEL_ENV || "development",
    });
}

export const runtime = "edge";
