"use client";

import { useEffect, useState } from "react";
import type { RideSession, IncidentCase } from "@/lib/types";

function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function ContactViewPage() {
  const [sessions, setSessions] = useState<RideSession[]>([]);
  const [incidents, setIncidents] = useState<IncidentCase[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);

      const iRes = await fetch("/api/incidents");
      const iData = await iRes.json();
      setIncidents(iData.incidents || []);
    };
    fetchAll();
    const int = setInterval(fetchAll, 3000);
    return () => clearInterval(int);
  }, []);

  const activeSessions = sessions.filter(s => s.status === "active" || s.status === "incident");
  const activeIncidents = incidents.filter(i => i.resolution === "pending");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border-[8px] border-gray-900 h-[800px] flex flex-col">
        {/* Phone Header */}
        <div className="bg-gray-900 text-white px-6 py-2 text-xs flex justify-between font-medium">
          <span>03:41 PM</span>
          <div className="flex gap-1.5">
            <span className="w-4 h-4 bg-white/20 rounded-full" />
            <span className="w-4 h-4 bg-white/20 rounded-full" />
            <span className="w-4 h-4 bg-white/20 rounded-full" />
          </div>
        </div>

        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 text-center">
          <h1 className="font-bold text-gray-900">Trusted Contact Messages</h1>
          <p className="text-xs text-gray-500">Simulated SMS Inbox</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
          {activeSessions.length === 0 && activeIncidents.length === 0 && (
            <div className="text-center text-sm text-gray-500 mt-10">No recent messages.</div>
          )}

          {activeSessions.map((session) => (
            <div key={session.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold text-gray-900">GuardHer Notification</span>
              </div>
              <p className="text-sm text-gray-800 mb-3">
                Ayesha shared a live ride session with you. She is traveling from <strong>{session.ride.pickup}</strong> to <strong>{session.ride.destination}</strong> via {session.ride.platform}.
              </p>
              <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded mb-3 border border-blue-100 font-medium">
                Vehicle: {session.ride.vehicleModel} ({session.ride.numberPlate})
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span className="flex items-center gap-1 text-blue-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"/> LIVE TRACKING ACTIVE</span>
                <span>Tap to view map</span>
              </div>
            </div>
          ))}

          {activeIncidents.map((incident) => (
            <div key={incident.id} className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Emergency Alert</span>
              </div>
              <p className="text-sm text-red-900 font-medium mb-3">
                Ayesha triggered an {incident.alertLevel === "sos" ? "SOS" : "UNSAFE"} alert during her ride!
              </p>
              <p className="text-xs text-red-800 mb-3">
                Last known position: Lat {incident.session.currentLocation?.lat.toFixed(4)}, Lng {incident.session.currentLocation?.lng.toFixed(4)}
              </p>
              <div className="text-xs text-red-700 bg-red-100 px-3 py-2 rounded font-medium border border-red-200">
                Authorities have been notified automatically. Please attempt contact immediately.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
