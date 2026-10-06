import { NextResponse } from "next/server";
import { getSessions, getIncidents } from "@/lib/store";

export async function GET() {
  const sessions = getSessions();
  const incidents = getIncidents();

  const activeSessions = sessions.filter(
    (s) => s.status === "active" || s.status === "incident"
  ).length;

  const pendingIncidents = incidents.filter(
    (i) => i.resolution === "pending"
  ).length;

  const totalProtectedWomen = 12450 + sessions.length;

  return NextResponse.json({
    totalSessions: sessions.length,
    activeSessions,
    totalIncidents: incidents.length,
    pendingIncidents,
    totalProtectedWomen,
    avgDispatchTimeSec: 2.8,
    citiesCovered: 12,
  });
}
