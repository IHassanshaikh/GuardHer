/* ===== GUARDHER API Routes — Location Pings ===== */

import { NextRequest, NextResponse } from "next/server";
import { addLocationPing } from "@/lib/store";
import type { LocationPing } from "@/lib/types";

// POST /api/location — send a GPS ping for an active session
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, lat, lng, speed } = body;

  if (!sessionId || lat === undefined || lng === undefined) {
    return NextResponse.json(
      { error: "Missing sessionId, lat, or lng" },
      { status: 400 }
    );
  }

  const ping: LocationPing = {
    lat,
    lng,
    timestamp: Date.now(),
    speed: speed ?? 0,
  };

  const success = addLocationPing(sessionId, ping);
  if (!success) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ping }, { status: 201 });
}
