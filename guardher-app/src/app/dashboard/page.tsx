"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { IncidentCase } from "@/lib/types";

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}

function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}

function CheckCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  );
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentCase[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("/api/incidents");
        const data = await res.json();
        setIncidents(data.incidents || []);
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, []);

  const resolveIncident = async (id: string, resolution: string) => {
    await fetch("/api/incidents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, resolution }),
    });
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, resolution: resolution as IncidentCase["resolution"] } : i))
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident({ ...selectedIncident, resolution: resolution as IncidentCase["resolution"] });
    }
  };

  const activeCount = incidents.filter((i) => i.resolution === "pending").length;
  const sosCount = incidents.filter((i) => i.alertLevel === "sos" && i.resolution === "pending").length;

  return (
    <div className="h-screen flex flex-col bg-[#FFF5F8] text-pink-950 font-sans overflow-hidden">
      {/* NAVBAR */}
      <header className="bg-white border-b border-pink-200 px-6 h-16 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="GuardHer Logo" className="w-8 h-8 rounded-lg border border-pink-200" />
            <span className="text-xl font-black text-gradient-pink">GuardHer Dispatch</span>
          </Link>
          <span className="text-pink-300">|</span>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
            Karachi &amp; Lahore Control Command
          </span>
        </div>
        <div className="flex items-center gap-4">
          {sosCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 border border-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-black text-rose-700">{sosCount} ACTIVE SOS DISPATCH</span>
            </div>
          )}
          <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            15 Emergency Sync Active
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r border-pink-200 flex flex-col">
          <div className="grid grid-cols-2 gap-px bg-pink-200 border-b border-pink-200">
            <div className="bg-white p-4 text-center">
              <div className="text-2xl font-black text-amber-500">{activeCount}</div>
              <div className="text-[10px] text-pink-700 uppercase font-extrabold tracking-wider">Active Alerts</div>
            </div>
            <div className="bg-white p-4 text-center">
              <div className="text-2xl font-black text-rose-600">{sosCount}</div>
              <div className="text-[10px] text-pink-700 uppercase font-extrabold tracking-wider">High Priority SOS</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-xs font-bold text-pink-600">Syncing Cases...</div>
            ) : incidents.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-pink-700">No active emergency dispatches.</div>
            ) : (
              incidents
                .sort((a, b) => b.triggerTime - a.triggerTime)
                .map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`w-full text-left p-4 border-b border-pink-100 transition-all ${
                      selectedIncident?.id === incident.id
                        ? "bg-pink-100/70 border-l-4 border-l-pink-600"
                        : "hover:bg-pink-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        incident.alertLevel === "sos" ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {incident.alertLevel === "sos" ? "PRIORITY 1: SOS" : "UNSAFE ALERT"}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        incident.resolution === "pending" ? "bg-gray-100 text-gray-700" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {incident.resolution}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-pink-950 truncate mt-1">
                      {incident.session.ride.vehicleModel} — {incident.session.ride.numberPlate}
                    </div>
                    <div className="text-[11px] font-medium text-pink-700 mt-1 flex justify-between">
                      <span>{incident.session.ride.platform}</span>
                      <span>{new Date(incident.triggerTime).toLocaleTimeString()}</span>
                    </div>
                  </button>
                ))
            )}
          </div>
        </aside>

        {/* MAIN CASE DETAIL */}
        <main className="flex-1 bg-[#FFF5F8] p-8 overflow-y-auto">
          {selectedIncident ? (
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-2xl p-6 mb-6 border shadow-md ${
                selectedIncident.alertLevel === "sos" ? "bg-rose-50 border-rose-300 text-rose-950" : "bg-amber-50 border-amber-300 text-amber-950"
              }`}>
                <div className="flex items-center gap-4">
                  <AlertTriangleIcon className={`w-8 h-8 shrink-0 ${selectedIncident.alertLevel === "sos" ? "text-rose-600 animate-bounce" : "text-amber-600"}`} />
                  <div>
                    <h1 className="text-2xl font-black">
                      {selectedIncident.alertLevel === "sos" ? "Priority 1: Emergency SOS Dispatch" : "Priority 2: Safety Check-In Alert"}
                    </h1>
                    <div className="text-xs font-semibold mt-1 opacity-80">
                      Case ID: {selectedIncident.id} • Opened: {new Date(selectedIncident.triggerTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="glass-card p-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-4 pb-2 border-b border-pink-100">
                    Ride Intelligence Data
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-xs text-pink-400 font-bold block">Service</span><span className="font-extrabold text-pink-950">{selectedIncident.session.ride.platform}</span></div>
                    <div><span className="text-xs text-pink-400 font-bold block">Driver Name</span><span className="font-extrabold text-pink-950">{selectedIncident.session.ride.driverName}</span></div>
                    <div><span className="text-xs text-pink-400 font-bold block">Vehicle Model</span><span className="font-extrabold text-pink-950">{selectedIncident.session.ride.vehicleModel}</span></div>
                    <div><span className="text-xs text-pink-400 font-bold block">Number Plate</span><span className="font-mono font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded">{selectedIncident.session.ride.numberPlate}</span></div>
                    <div><span className="text-xs text-pink-400 font-bold block">Route</span><span className="font-extrabold text-pink-950">{selectedIncident.session.ride.pickup} → {selectedIncident.session.ride.destination}</span></div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 mb-4 pb-2 border-b border-pink-100 flex justify-between items-center">
                    <span>Live Telemetry Lock</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> LIVE GPS</span>
                  </h3>
                  {selectedIncident.session.currentLocation ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-xs text-pink-400 font-bold block mb-1">Coordinates</span>
                        <div className="font-mono text-xs font-bold bg-white border border-pink-200 p-3 rounded-xl text-pink-950 shadow-inner">
                          Lat: {selectedIncident.session.currentLocation.lat.toFixed(6)}<br/>
                          Lng: {selectedIncident.session.currentLocation.lng.toFixed(6)}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-pink-700">
                        Last Ping: {new Date(selectedIncident.session.currentLocation.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-pink-600 font-medium">Awaiting GPS telemetry...</p>
                  )}
                </div>
              </div>

              {selectedIncident.resolution === "pending" ? (
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-pink-200">
                  <button onClick={() => resolveIncident(selectedIncident.id, "dispatched")} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-extrabold shadow-lg hover:bg-rose-700 transition-all">
                    Dispatch Rescue Units
                  </button>
                  <button onClick={() => resolveIncident(selectedIncident.id, "resolved")} className="px-6 py-3 bg-pink-600 text-white rounded-xl text-xs font-extrabold shadow-lg hover:bg-pink-700 transition-all">
                    Mark Resolved
                  </button>
                  <button onClick={() => resolveIncident(selectedIncident.id, "false_alarm")} className="px-6 py-3 bg-white border border-pink-300 text-pink-950 rounded-xl text-xs font-extrabold hover:bg-pink-50 transition-all">
                    Flag False Alarm
                  </button>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-pink-200 flex items-center gap-2 text-sm font-extrabold text-pink-800">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                  Status: <span className="uppercase text-emerald-700">{selectedIncident.resolution}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-pink-700 font-bold">
                <ShieldIcon className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                <p>Select an emergency case from the left panel to inspect.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
