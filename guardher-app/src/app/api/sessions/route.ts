/* ===== GUARDHER API Routes — Sessions ===== */

import { NextRequest, NextResponse } from "next/server";
import {
  getSessions,
  getActiveSession,
  createSession,
  updateSession,
  generateId,
  getUser,
} from "@/lib/store";
import type { RideSession, RideDetails } from "@/lib/types";

// GET /api/sessions — list all sessions OR get active session
export async function GET(req: NextRequest) {
  const active = req.nextUrl.searchParams.get("active");
  if (active === "true") {
    const session = getActiveSession();
    return NextResponse.json({ session: session ?? null });
  }
  return NextResponse.json({ sessions: getSessions() });
}

// POST /api/sessions — create a new ride session
export async function POST(req: NextRequest) {
  const body = await req.json();
  const ride: RideDetails = body.ride;
  const contactIds: string[] = body.trustedContactIds ?? [];

  if (!ride || !ride.driverName || !ride.numberPlate) {
    return NextResponse.json(
      { error: "Missing required ride details" },
      { status: 400 }
    );
  }

  const user = getUser();
  const selectedContacts = user.trustedContacts.filter((c) =>
    contactIds.includes(c.id)
  );

  const session: RideSession = {
    id: generateId("ride"),
    userId: user.id,
    ride,
    trustedContacts:
      selectedContacts.length > 0 ? selectedContacts : user.trustedContacts,
    status: "active",
    startTime: Date.now(),
    locationHistory: [],
  };

  createSession(session);

  // ===== REAL SMS INTEGRATION =====
  // Only runs if TWILIO_ACCOUNT_SID is provided in .env
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    const trackingLink = `http://localhost:3000/contact-view`; 
    const msgBody = `GuardHer Alert: ${user.name} has started a ride in a ${ride.vehicleModel} (${ride.numberPlate}). Track live: ${trackingLink}`;
    
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
        }).catch(err => console.error("Twilio send error:", err));
      } catch (e) {
        console.error("Twilio error:", e);
      }
    }
  }

  return NextResponse.json({ session }, { status: 201 });
}

// PATCH /api/sessions — update session (e.g. end ride)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }
  const session = updateSession(id, data);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}
