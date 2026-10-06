"use client";

import { useEffect, useState } from "react";
import type { RideSession, IncidentCase } from "@/lib/types";
import InteractiveMap from "@/components/InteractiveMap";

function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function PhoneCallIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

export default function ContactViewPage() {
  const [sessions, setSessions] = useState<RideSession[]>([]);
  const [incidents, setIncidents] = useState<IncidentCase[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data.sessions || []);

        const iRes = await fetch("/api/incidents");
        const iData = await iRes.json();
        setIncidents(iData.incidents || []);
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
    fetchAll();
    const int = setInterval(fetchAll, 3000);
    return () => clearInterval(int);
  }, []);

  const activeSessions = sessions.filter(s => s.status === "active" || s.status === "incident");
  const activeIncidents = incidents.filter(i => i.resolution === "pending");

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern flex flex-col items-center justify-center p-6 text-pink-950">
      <div className="w-full max-w-md glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white h-[840px] flex flex-col relative">
        {/* PHONE TOP BAR */}
        <div className="bg-pink-950 text-white px-6 py-2.5 text-xs flex justify-between font-bold shrink-0">
          <span>03:41 PM</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-pink-300">PAKISTAN 4G</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* HEADER */}
        <div className="bg-white/80 border-b border-pink-200 px-6 py-4 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/logo.png" alt="GuardHer Logo" className="w-6 h-6 rounded-md object-cover" />
            <h1 className="font-extrabold text-pink-950 text-base">Guardian Live Tracking Inbox</h1>
          </div>
          <p className="text-[10px] text-pink-700 font-bold uppercase tracking-wider">SMS Web Tracking Telemetry</p>
        </div>

        {/* MESSAGE STREAM */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFF5F8]">
          {activeSessions.length === 0 && activeIncidents.length === 0 && (
            <div className="text-center text-xs font-bold text-pink-700 mt-20">
              No active ride tracking messages right now.
            </div>
          )}

          {activeSessions.map((session) => {
            const lat = session.currentLocation?.lat || 31.4704;
            const lng = session.currentLocation?.lng || 74.4098;
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

            return (
              <div key={session.id} className="bg-white p-5 rounded-2xl shadow-md border border-pink-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-pink-600" />
                    <span className="text-xs font-black text-pink-950 uppercase tracking-wider">GuardHer Protection Shared</span>
                  </div>
                  <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                    {session.ride.platform}
                  </span>
                </div>

                <p className="text-xs text-pink-900 font-medium leading-relaxed">
                  Ayesha shared her live ride session with you. She is traveling from <strong>{session.ride.pickup}</strong> to <strong>{session.ride.destination}</strong>.
                </p>
                
                {/* INTERACTIVE MAP COMPONENT IN GUARDIAN INBOX */}
                <InteractiveMap
                  lat={lat}
                  lng={lng}
                  pickup={session.ride.pickup}
                  destination={session.ride.destination}
                  vehiclePlate={session.ride.numberPlate}
                  driverName={session.ride.driverName}
                  status={session.status === "incident" ? "sos" : "active"}
                />

                <div className="bg-pink-50 text-pink-950 text-xs p-3 rounded-xl border border-pink-200 font-semibold space-y-1">
                  <div><span className="text-pink-400">Driver:</span> {session.ride.driverName}</div>
                  <div><span className="text-pink-400">Vehicle:</span> {session.ride.vehicleModel}</div>
                  <div><span className="text-pink-400">Plate:</span> <span className="font-mono text-pink-600 bg-white px-1.5 py-0.5 rounded border border-pink-200">{session.ride.numberPlate}</span></div>
                </div>

                {/* FUNCTIONAL BUTTONS */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-pink-950 text-white rounded-xl text-center text-xs font-bold shadow-sm hover:bg-black transition-colors"
                  >
                    Open Google Maps
                  </a>
                  <a
                    href="tel:03001234567"
                    className="py-2.5 px-3 bg-rose-600 text-white rounded-xl text-center text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCallIcon className="w-3.5 h-3.5" />
                    <span>Call Passenger</span>
                  </a>
                </div>
              </div>
            );
          })}

          {activeIncidents.map((incident) => (
            <div key={incident.id} className="bg-rose-50 p-5 rounded-2xl shadow-md border border-rose-300 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-rose-600 animate-bounce" />
                <span className="text-xs font-black text-rose-700 uppercase tracking-widest">EMERGENCY ALERT TRIGGERED</span>
              </div>
              <p className="text-xs text-rose-950 font-extrabold">
                Ayesha pressed {incident.alertLevel === "sos" ? "SOS EMERGENCY DISPATCH" : "UNSAFE ALERT"}!
              </p>
              <p className="text-[11px] text-rose-800 font-medium">
                Last verified GPS lock: Lat {incident.session.currentLocation?.lat.toFixed(4)}, Lng {incident.session.currentLocation?.lng.toFixed(4)}
              </p>
              <div className="text-[11px] text-rose-800 bg-rose-100 p-3 rounded-xl font-bold border border-rose-200">
                15 Madadgar Police Dispatch Center has been notified automatically.
              </div>
              <div className="pt-1">
                <a
                  href="tel:15"
                  className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2"
                >
                  <PhoneCallIcon className="w-4 h-4" />
                  <span>Call 15 Police Now</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
