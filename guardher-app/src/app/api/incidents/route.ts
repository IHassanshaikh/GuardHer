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

  // ===== REAL SMS EMERGENCY DISPATCH (TWILIO) =====
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, NEXT_PUBLIC_BASE_URL, RESCUE_15_POLICE_WEBHOOK_URL } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    const baseUrl = NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const trackingLink = `${baseUrl}/contact-view`;
    const alertTitle = alertLevel === "sos" ? "CRITICAL SOS ALERT" : "SAFETY WARNING";
    const msgBody = `[${alertTitle}] GuardHer: A passenger triggered an emergency alert during her ride (${session.ride.vehicleModel} - ${session.ride.numberPlate}). Driver: ${session.ride.driverName}. Track live position immediately: ${trackingLink}`;

    for (const contact of session.trustedContacts) {
      try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
        const formData = new URLSearchParams();
        formData.append("To", contact.phone);
        formData.append("From", TWILIO_PHONE_NUMBER);
        formData.append("Body", msgBody);

        fetch(url, {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        }).catch(err => console.error("Twilio Emergency SMS error:", err));
      } catch (e) {
        console.error("Twilio error:", e);
      }
    }
  }

  // ===== OPTIONAL 15 POLICE DISPATCH CAD WEBHOOK =====
  if (RESCUE_15_POLICE_WEBHOOK_URL) {
    try {
      fetch(RESCUE_15_POLICE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "GuardHer Emergency Network",
          incidentId: incident.id,
          alertLevel,
          timestamp: incident.triggerTime,
          vehiclePlate: session.ride.numberPlate,
          vehicleModel: session.ride.vehicleModel,
          driverName: session.ride.driverName,
          platform: session.ride.platform,
          currentLocation: session.currentLocation,
        }),
      }).catch(err => console.error("Rescue 15 webhook dispatch error:", err));
    } catch (e) {
      console.error("Rescue 15 webhook error:", e);
    }
  }

  // ===== FALLBACK LOG DISPATCH =====
  console.log("\n[!] ===============================================");
  console.log(`[!] GUARDHER SAFETY ALERT - ${alertLevel.toUpperCase()}`);
  console.log("[!] ===============================================");
  console.log(`   Passenger ID: ${session.userId}`);
  console.log(`   Ride Service: ${session.ride.platform}`);
  console.log(`   Driver: ${session.ride.driverName}`);
  console.log(`   Vehicle: ${session.ride.vehicleModel} (${session.ride.numberPlate})`);
  console.log(`   Route: ${session.ride.pickup} -> ${session.ride.destination}`);
  console.log(`   Alert Level: ${alertLevel === "sos" ? "PRIORITY 1: SOS DISPATCH" : "PRIORITY 2: UNSAFE ALERT"}`);
  console.log(`   Time: ${new Date(incident.triggerTime).toLocaleTimeString()}`);
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
