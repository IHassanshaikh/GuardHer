/* ===== GUARDHER API Routes — Incidents (Emergency Triggers) ===== */

import { NextRequest, NextResponse } from "next/server";
import {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  getSession,
  generateId,
} from "@/lib/store";
import type { IncidentCase, AlertLevel } from "@/lib/types";

// GET /api/incidents — list all incidents
export async function GET() {
  const incidents = getIncidents();
  return NextResponse.json({ incidents });
}

// POST /api/incidents — trigger an emergency alert
export async function POST(req: NextRequest) {
  const body = await req.json();
  const sessionId: string = body.sessionId;
  const alertLevel: AlertLevel = body.alertLevel;

  if (!sessionId || !alertLevel) {
    return NextResponse.json(
      { error: "Missing sessionId or alertLevel" },
      { status: 400 }
    );
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  const incident: IncidentCase = {
    id: generateId("inc"),
    sessionId,
    session: { ...session },
    alertLevel,
    triggerTime: Date.now(),
    resolution: "pending",
  };

  createIncident(incident);

  // ===== SIMULATED DISPATCH =====
  // In production, these are real SMS (Twilio), Push (FCM), and Webhooks.
  console.log("\n[!] ===============================================");
  console.log(`[!] GUARDHER SAFETY ALERT - ${alertLevel.toUpperCase()}`);
  console.log("[!] ===============================================");
  console.log(`   Passenger: ${session.userId}`);
  console.log(`   Ride Service: ${session.ride.platform}`);
  console.log(`   Driver: ${session.ride.driverName}`);
  console.log(`   Vehicle: ${session.ride.vehicleModel}`);
  console.log(`   Number Plate: ${session.ride.numberPlate}`);
  console.log(`   Pickup: ${session.ride.pickup}`);
  console.log(`   Destination: ${session.ride.destination}`);
  console.log(`   Current Position: ${JSON.stringify(session.currentLocation)}`);
  console.log(`   Time: ${new Date(incident.triggerTime).toLocaleTimeString()}`);
  console.log(`   Alert Type: ${alertLevel === "sos" ? "[!] SOS / EMERGENCY" : "[WARN] PASSENGER FEELS UNSAFE"}`);
  console.log("[!] ===============================================");
  console.log("   -> Dispatching to: Relevant Department / Emergency Response");
  console.log("   -> Notifying: Trusted Contacts");
  session.trustedContacts.forEach((c) => {
    console.log(`      [SMS] -> ${c.name} (${c.phone})`);
  });
  console.log("   -> Logging: Incident Database");
  console.log("   -> Live Tracking: ACTIVE [ON]");
  console.log("[!] ===============================================\n");

  return NextResponse.json({ incident }, { status: 201 });
}

// PATCH /api/incidents — update incident resolution
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing incident ID" }, { status: 400 });
  }
  const incident = updateIncident(id, data);
  if (!incident) {
    return NextResponse.json(
      { error: "Incident not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ incident });
}
