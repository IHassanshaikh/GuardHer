/* ===== GUARDHER In-Memory Store (Prototype Local DB) ===== */
import fs from "fs";
import path from "path";
import {
  type RideSession,
  type IncidentCase,
  type TrustedContact,
  type UserProfile,
  type LocationPing,
} from "./types";

const DB_PATH = path.join(process.cwd(), "data.json");

// ---------- Default User for Prototype ----------
const defaultUser: UserProfile = {
  id: "user-001",
  name: "Ayesha Ahmed",
  phone: "+92-300-1234567",
  email: "ayesha@guardher.pk",
  trustedContacts: [
    { id: "tc-001", name: "Ammi (Mother)", phone: "+92-321-9876543", relationship: "Parent" },
    { id: "tc-002", name: "Ali (Brother)", phone: "+92-333-4567890", relationship: "Brother" },
    { id: "tc-003", name: "Sarah (Friend)", phone: "+92-312-5551234", relationship: "Friend" },
  ],
};

interface Store {
  user: UserProfile;
  sessions: RideSession[];
  incidents: IncidentCase[];
}

function loadStore(): Store {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading DB:", err);
  }
  return { user: defaultUser, sessions: [], incidents: [] };
}

function saveStore(store: Store) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing DB:", err);
  }
}

// Keep a cached copy in memory for fast reads
const globalStore: Store = loadStore();

// ---------- User ----------
export function getUser(): UserProfile {
  return globalStore.user;
}

export function updateUser(data: Partial<UserProfile>): UserProfile {
  Object.assign(globalStore.user, data);
  saveStore(globalStore);
  return globalStore.user;
}

// ---------- Trusted Contacts ----------
export function getTrustedContacts(): TrustedContact[] {
  return globalStore.user.trustedContacts;
}

export function addTrustedContact(contact: TrustedContact): TrustedContact {
  globalStore.user.trustedContacts.push(contact);
  saveStore(globalStore);
  return contact;
}

export function removeTrustedContact(id: string): boolean {
  const idx = globalStore.user.trustedContacts.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  globalStore.user.trustedContacts.splice(idx, 1);
  saveStore(globalStore);
  return true;
}

// ---------- Sessions ----------
export function getSessions(): RideSession[] {
  return globalStore.sessions;
}

export function getSession(id: string): RideSession | undefined {
  return globalStore.sessions.find((s) => s.id === id);
}

export function getActiveSession(): RideSession | undefined {
  return globalStore.sessions.find((s) => s.status === "active" || s.status === "incident");
}

export function createSession(session: RideSession): RideSession {
  globalStore.sessions.push(session);
  saveStore(globalStore);
  return session;
}

export function updateSession(
  id: string,
  data: Partial<RideSession>
): RideSession | undefined {
  const session = globalStore.sessions.find((s) => s.id === id);
  if (!session) return undefined;
  Object.assign(session, data);
  saveStore(globalStore);
  return session;
}

export function addLocationPing(
  sessionId: string,
  ping: LocationPing
): boolean {
  const session = globalStore.sessions.find((s) => s.id === sessionId);
  if (!session) return false;
  session.locationHistory.push(ping);
  session.currentLocation = ping;
  saveStore(globalStore);
  return true;
}

// ---------- Incidents ----------
export function getIncidents(): IncidentCase[] {
  return globalStore.incidents;
}

export function getIncident(id: string): IncidentCase | undefined {
  return globalStore.incidents.find((i) => i.id === id);
}

export function createIncident(incident: IncidentCase): IncidentCase {
  globalStore.incidents.push(incident);
  const session = globalStore.sessions.find((s) => s.id === incident.sessionId);
  if (session) {
    session.status = "incident";
  }
  saveStore(globalStore);
  return incident;
}

export function updateIncident(
  id: string,
  data: Partial<IncidentCase>
): IncidentCase | undefined {
  const incident = globalStore.incidents.find((i) => i.id === id);
  if (!incident) return undefined;
  Object.assign(incident, data);
  saveStore(globalStore);
  return incident;
}

// ---------- Utility ----------
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
