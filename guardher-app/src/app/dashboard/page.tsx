"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { IncidentCase } from "@/lib/types";

/* ===== ICONS ===== */
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}
function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
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
    <div className="h-screen flex flex-col bg-guardher-bg text-guardher-text font-sans">
      {/* NAV */}
      <header className="bg-white border-b border-guardher-border px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-guardher-primary" />
            <span className="text-base font-bold tracking-tight">GuardHer Dispatch</span>
          </Link>
          <span className="text-guardher-border-dark">|</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-guardher-text-muted">
            Karachi Central Region
          </span>
        </div>
        <div className="flex items-center gap-4">
          {sosCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-guardher-danger/10 border border-guardher-danger/20">
              <span className="w-2 h-2 rounded-full bg-guardher-danger animate-pulse" />
              <span className="text-xs font-bold text-guardher-danger">{sosCount} ACTIVE SOS</span>
            </div>
          )}
          <div className="text-xs font-medium text-guardher-text-muted">System Operational</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r border-guardher-border flex flex-col">
          <div className="grid grid-cols-2 gap-px bg-guardher-border border-b border-guardher-border">
            <div className="bg-white p-3 text-center">
              <div className="text-lg font-bold text-guardher-warning">{activeCount}</div>
              <div className="text-[10px] text-guardher-text-muted uppercase font-semibold">Active</div>
            </div>
            <div className="bg-white p-3 text-center">
              <div className="text-lg font-bold text-guardher-danger">{sosCount}</div>
              <div className="text-[10px] text-guardher-text-muted uppercase font-semibold">SOS</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-guardher-text-muted">Loading incidents...</div>
            ) : incidents.length === 0 ? (
              <div className="p-6 text-center text-sm text-guardher-text-muted">No active incidents in region.</div>
            ) : (
              incidents
                .sort((a, b) => b.triggerTime - a.triggerTime)
                .map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`w-full text-left p-4 border-b border-guardher-border transition-colors ${
                      selectedIncident?.id === incident.id ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold uppercase ${incident.alertLevel === "sos" ? "text-guardher-danger" : "text-guardher-warning"}`}>
                        {incident.alertLevel === "sos" ? "SOS" : "UNSAFE"}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        incident.resolution === "pending" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                      }`}>
                        {incident.resolution}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-guardher-text truncate">
                      {incident.session.ride.vehicleModel} — {incident.session.ride.numberPlate}
                    </div>
                    <div className="text-xs text-guardher-text-muted mt-1">
                      {new Date(incident.triggerTime).toLocaleTimeString()}
                    </div>
                  </button>
                ))
            )}
          </div>
        </aside>

        {/* MAIN DETAIL */}
        <main className="flex-1 bg-guardher-bg p-6 overflow-y-auto">
          {selectedIncident ? (
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-lg p-5 mb-6 border ${selectedIncident.alertLevel === "sos" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangleIcon className={`w-6 h-6 ${selectedIncident.alertLevel === "sos" ? "text-red-600" : "text-amber-600"}`} />
                  <div>
                    <h1 className={`text-xl font-bold ${selectedIncident.alertLevel === "sos" ? "text-red-700" : "text-amber-700"}`}>
                      {selectedIncident.alertLevel === "sos" ? "Priority 1: SOS Dispatch" : "Priority 2: Passenger Safety Alert"}
                    </h1>
                    <div className="text-xs mt-1 text-gray-600 font-medium">Case ID: {selectedIncident.id} • Opened: {new Date(selectedIncident.triggerTime).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="card p-0 overflow-hidden">
                  <div className="bg-guardher-surface-alt px-4 py-2 border-b border-guardher-border text-xs font-semibold text-guardher-text-muted uppercase">
                    Ride Intelligence Data
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-guardher-text-muted mb-0.5">Platform</div>
                      <div className="font-medium">{selectedIncident.session.ride.platform}</div>
                    </div>
                    <div>
                      <div className="text-xs text-guardher-text-muted mb-0.5">Driver Name</div>
                      <div className="font-medium">{selectedIncident.session.ride.driverName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-guardher-text-muted mb-0.5">Vehicle</div>
                      <div className="font-medium">{selectedIncident.session.ride.vehicleModel}</div>
                    </div>
                    <div>
                      <div className="text-xs text-guardher-text-muted mb-0.5">Reg. Plate</div>
                      <div className="font-medium text-guardher-primary bg-guardher-primary/5 px-2 py-0.5 rounded inline-block">{selectedIncident.session.ride.numberPlate}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-guardher-text-muted mb-0.5">Route</div>
                      <div className="font-medium">{selectedIncident.session.ride.pickup} → {selectedIncident.session.ride.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="card p-0 overflow-hidden">
                  <div className="bg-guardher-surface-alt px-4 py-2 border-b border-guardher-border flex justify-between items-center">
                    <span className="text-xs font-semibold text-guardher-text-muted uppercase">Location Telemetry</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-guardher-primary"><span className="w-1.5 h-1.5 rounded-full bg-guardher-primary animate-pulse"/> LIVE</span>
                  </div>
                  <div className="p-4">
                    {selectedIncident.session.currentLocation ? (
                      <div>
                        <div className="text-xs text-guardher-text-muted mb-1">Coordinates</div>
                        <div className="font-mono text-sm font-medium bg-gray-50 border border-gray-200 p-2 rounded">
                          Lat: {selectedIncident.session.currentLocation.lat.toFixed(6)}<br/>
                          Lng: {selectedIncident.session.currentLocation.lng.toFixed(6)}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Last ping: {new Date(selectedIncident.session.currentLocation.timestamp).toLocaleTimeString()}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Awaiting location lock...</div>
                    )}
                  </div>
                </div>
              </div>

              {selectedIncident.resolution === "pending" ? (
                <div className="flex gap-3 mt-6 border-t border-guardher-border pt-6">
                  <button onClick={() => resolveIncident(selectedIncident.id, "dispatched")} className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Dispatch Units
                  </button>
                  <button onClick={() => resolveIncident(selectedIncident.id, "resolved")} className="px-6 py-2.5 bg-guardher-primary text-white rounded-md text-sm font-medium hover:bg-guardher-primary-hover">
                    Mark Resolved
                  </button>
                  <button onClick={() => resolveIncident(selectedIncident.id, "false_alarm")} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                    Flag as False Alarm
                  </button>
                </div>
              ) : (
                <div className="mt-6 border-t border-guardher-border pt-6 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                  Case marked as: <span className="uppercase">{selectedIncident.resolution}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-guardher-text-muted">
                <ShieldIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a case to view details.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
