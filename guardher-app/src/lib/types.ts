/* ===== GUARDHER Type Definitions ===== */

export type RidePlatform = "Yango" | "Uber" | "InDrive" | "Careem" | "Other";

export type Relationship =
  | "Parent"
  | "Brother"
  | "Sister"
  | "Husband"
  | "Friend"
  | "Guardian"
  | "Other";

export type AlertLevel = "unsafe" | "sos";

export type RideStatus =
  | "pending"
  | "active"
  | "completed"
  | "incident";

export type IncidentResolution =
  | "pending"
  | "dispatched"
  | "resolved"
  | "false_alarm";

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: Relationship;
}

export interface RideDetails {
  platform: RidePlatform;
  driverName: string;
  driverPhoto?: string;
  vehicleModel: string;
  numberPlate: string;
  pickup: string;
  destination: string;
}

export interface LocationPing {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number;
}

export interface RideSession {
  id: string;
  userId: string;
  ride: RideDetails;
  trustedContacts: TrustedContact[];
  status: RideStatus;
  startTime: number;
  endTime?: number;
  locationHistory: LocationPing[];
  currentLocation?: LocationPing;
}

export interface IncidentCase {
  id: string;
  sessionId: string;
  session: RideSession;
  alertLevel: AlertLevel;
  triggerTime: number;
  resolution: IncidentResolution;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  emergencyPin?: string;
  trustedContacts: TrustedContact[];
}
