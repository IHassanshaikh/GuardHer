"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { RideSession, AlertLevel } from "@/lib/types";

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
function NavigationIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
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
function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  );
}

function LiveRideContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<RideSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [alertSent, setAlertSent] = useState<AlertLevel | null>(null);
  const [showConfirm, setShowConfirm] = useState<AlertLevel | null>(null);
  const [sending, setSending] = useState(false);
  const [rideEnded, setRideEnded] = useState(false);
  const [recording, setRecording] = useState(false);
  const [fakeCall, setFakeCall] = useState(false);

  const [currentLat, setCurrentLat] = useState(31.4704);
  const [currentLng, setCurrentLng] = useState(74.4098);
  const [speed, setSpeed] = useState(36);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions?active=true`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) setSession(d.session);
      })
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    if (!session || rideEnded) return;
    const interval = setInterval(() => {
      const diff = Date.now() - session.startTime;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [session, rideEnded]);

  useEffect(() => {
    if (!session || rideEnded) return;
    const interval = setInterval(() => {
      setCurrentLat((p) => p + (Math.random() - 0.4) * 0.0005);
      setCurrentLng((p) => p + (Math.random() - 0.3) * 0.0005);
      setSpeed(Math.floor(30 + Math.random() * 15));

      if (sessionId) {
        fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, lat: currentLat, lng: currentLng, speed }),
        }).catch(() => {});
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [session, sessionId, rideEnded, currentLat, currentLng, speed]);

  const triggerAlert = useCallback(
    async (level: AlertLevel) => {
      if (!sessionId || sending) return;
      setSending(true);
      try {
        const res = await fetch("/api/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, alertLevel: level }),
        });
        const data = await res.json();
        if (data.incident) {
          setAlertSent(level);
          setShowConfirm(null);
        }
      } catch (err) {
        console.error("Failed", err);
      } finally {
        setSending(false);
      }
    },
    [sessionId, sending]
  );

  const endRide = async () => {
    if (!sessionId) return;
    await fetch("/api/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId, status: "completed", endTime: Date.now() }),
    });
    setRideEnded(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex items-center justify-center">
        <p className="text-pink-700 font-bold">Connecting to GuardHer Live Telemetry...</p>
      </div>
    );
  }

  if (rideEnded) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircleIcon className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-pink-950 mb-2">Ride Completed Safely</h1>
        <p className="text-pink-700 font-medium mb-8">Total Trip Duration: {elapsedTime}</p>
        <Link href="/" className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-extrabold shadow-lg shadow-pink-500/30">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (alertSent) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center px-6 border-t-8 border-rose-600">
        <div className="w-20 h-20 rounded-3xl bg-rose-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-rose-600/30 animate-pulse">
          <AlertTriangleIcon className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-pink-950 mb-4">
          {alertSent === "sos" ? "SOS Police Dispatch Created" : "Unsafe Alert Broadcasted"}
        </h1>
        <div className="w-full max-w-md glass-card p-6 mb-6">
          <ul className="space-y-4 text-sm font-bold text-pink-950">
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Emergency contacts notified via live map link</li>
            {alertSent === "sos" && <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Rescue 15 Police Dispatch Center notified</li>}
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Real-time GPS tracking stream active</li>
          </ul>
        </div>
        <Link href="/" className="px-6 py-3 bg-pink-950 text-white rounded-xl text-sm font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern flex flex-col pb-12">
      {/* SIMULATED FAKE CALL OVERLAY */}
      {fakeCall && (
        <div className="fixed inset-0 z-50 bg-black/90 text-white flex flex-col items-center justify-between p-12">
          <div className="text-center mt-12">
            <p className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-2">Incoming GuardHer Call</p>
            <p className="text-3xl font-black">Abbu (Father)</p>
            <p className="text-sm text-gray-400 mt-1">Calling to check your ride location...</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-pink-600/30 border-2 border-pink-500 animate-ping flex items-center justify-center">
            <PhoneCallIcon className="w-10 h-10 text-pink-400" />
          </div>
          <button
            onClick={() => setFakeCall(false)}
            className="w-full max-w-xs py-4 bg-rose-600 text-white rounded-2xl font-black text-base shadow-lg"
          >
            End Simulated Call
          </button>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 bg-pink-950/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-pink-200">
            <AlertTriangleIcon className={`w-12 h-12 mb-4 ${showConfirm === "sos" ? "text-rose-600" : "text-amber-500"}`} />
            <h2 className="text-2xl font-black text-pink-950 mb-2">
              {showConfirm === "sos" ? "Confirm Priority 1 SOS" : "Confirm Safety Check-In"}
            </h2>
            <p className="text-xs text-pink-700 font-medium mb-6">
              {showConfirm === "sos"
                ? "This dispatches your exact vehicle plate, driver name, and live GPS to 15 Madadgar Police and family."
                : "This sends a silent check-in warning to your selected guardians."}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(null)} className="flex-1 py-3.5 border border-pink-300 rounded-xl font-bold text-pink-950">
                Cancel
              </button>
              <button
                onClick={() => triggerAlert(showConfirm)}
                disabled={sending}
                className={`flex-1 py-3.5 text-white rounded-xl font-extrabold shadow-lg ${
                  showConfirm === "sos" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {sending ? "Dispatching..." : "Confirm Alert"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP ACTIVE STATUS BAR */}
      <div className="bg-white/90 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-extrabold text-pink-950">Active Protection Lock</span>
          <span className="text-xs font-mono font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md">{elapsedTime}</span>
        </div>
        <button onClick={endRide} className="text-xs font-extrabold text-pink-600 hover:text-pink-900 uppercase tracking-wider px-3 py-1.5 rounded-lg bg-pink-50">
          End Session
        </button>
      </div>

      {/* VEHICLE TELEMETRY CARD */}
      <div className="max-w-xl mx-auto w-full px-6 pt-6">
        <div className="glass-card p-6 shadow-lg border border-pink-200">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-600">{session.ride.platform} Ride</span>
              <h3 className="text-lg font-black text-pink-950">{session.ride.vehicleModel}</h3>
            </div>
            <span className="font-mono text-sm font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-xl">
              {session.ride.numberPlate}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-pink-800">
            <div><span className="text-pink-400">Driver:</span> {session.ride.driverName}</div>
            <div><span className="text-pink-400">Speed:</span> {speed} km/h</div>
            <div className="col-span-2 truncate"><span className="text-pink-400">Route:</span> {session.ride.pickup} → {session.ride.destination}</div>
          </div>
        </div>
      </div>

      {/* MAIN PANIC ACTION CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-xl mx-auto w-full gap-5">
        <button
          onClick={() => setShowConfirm("unsafe")}
          className="w-full p-6 glass-card border-2 border-amber-400 hover:border-amber-500 shadow-md transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <AlertTriangleIcon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-lg font-black text-pink-950 block">I Feel Unsafe</span>
            <span className="text-xs text-pink-700 font-medium">Route deviation or suspicious behavior. Silent alert to guardians.</span>
          </div>
        </button>

        <button
          onClick={() => setShowConfirm("sos")}
          className="w-full p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-2xl shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-6 text-left group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <AlertTriangleIcon className="w-9 h-9" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-wider block">1-TAP SOS</span>
            <span className="text-xs text-pink-100 font-medium">Immediate danger. Dispatches 15 Police & all emergency contacts.</span>
          </div>
        </button>

        {/* EXTRA SAFETY TOOLS */}
        <div className="grid grid-cols-2 gap-4 w-full pt-2">
          <button
            onClick={() => setFakeCall(true)}
            className="p-4 glass-card text-center hover:bg-white transition-all flex flex-col items-center gap-2"
          >
            <PhoneCallIcon className="w-6 h-6 text-pink-600" />
            <span className="text-xs font-extrabold text-pink-950">Trigger Fake Call</span>
          </button>

          <button
            onClick={() => setRecording(!recording)}
            className={`p-4 glass-card text-center transition-all flex flex-col items-center gap-2 ${
              recording ? "bg-rose-50 border-rose-400" : ""
            }`}
          >
            <MicIcon className={`w-6 h-6 ${recording ? "text-rose-600 animate-pulse" : "text-pink-600"}`} />
            <span className="text-xs font-extrabold text-pink-950">
              {recording ? "Recording Audio..." : "Silent Audio Rec"}
            </span>
          </button>
        </div>
      </div>

      {/* FOOTER GPS STATUS */}
      <div className="max-w-xl mx-auto w-full px-6">
        <div className="glass-card px-6 py-3 flex items-center justify-between text-xs font-semibold text-pink-800">
          <div className="flex items-center gap-2">
            <NavigationIcon className="w-4 h-4 text-pink-600" />
            <span className="font-mono">Lat: {currentLat.toFixed(4)}, Lng: {currentLng.toFixed(4)}</span>
          </div>
          <span className="text-emerald-600 font-bold">100% GPS Lock</span>
        </div>
      </div>
    </div>
  );
}

export default function LiveRidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F8] flex items-center justify-center"><p className="text-pink-700 font-bold">Loading Live Protection...</p></div>}>
      <LiveRideContent />
    </Suspense>
  );
}
