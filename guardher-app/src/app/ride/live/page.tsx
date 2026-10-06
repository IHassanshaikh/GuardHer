"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { RideSession, AlertLevel } from "@/lib/types";

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
function CheckCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  );
}
function NavigationIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  );
}
function CarIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
    </svg>
  );
}

function LiveRideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<RideSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [alertSent, setAlertSent] = useState<AlertLevel | null>(null);
  const [showConfirm, setShowConfirm] = useState<AlertLevel | null>(null);
  const [sending, setSending] = useState(false);
  const [rideEnded, setRideEnded] = useState(false);

  const [currentLat, setCurrentLat] = useState(24.8607);
  const [currentLng, setCurrentLng] = useState(67.0011);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions?active=true`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) setSession(d.session);
      });
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
      setCurrentLat((p) => p + (Math.random() - 0.4) * 0.001);
      setCurrentLng((p) => p + (Math.random() - 0.3) * 0.001);
      if (sessionId) {
        fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, lat: currentLat, lng: currentLng, speed: 30 }),
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [session, sessionId, rideEnded, currentLat, currentLng]);

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
      <div className="min-h-screen bg-guardher-bg flex items-center justify-center">
        <p className="text-guardher-text-muted">Loading session...</p>
      </div>
    );
  }

  if (rideEnded) {
    return (
      <div className="min-h-screen bg-guardher-bg flex flex-col items-center justify-center px-6">
        <CheckCircleIcon className="w-16 h-16 text-guardher-primary mb-4" />
        <h1 className="text-2xl font-bold text-guardher-text mb-2">Ride Completed Safely</h1>
        <p className="text-guardher-text-muted mb-8">Duration: {elapsedTime}</p>
        <Link href="/" className="px-6 py-3 bg-guardher-primary text-white rounded-md font-medium">
          Return Home
        </Link>
      </div>
    );
  }

  if (alertSent) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 border-t-8 border-guardher-danger">
        <AlertTriangleIcon className={`w-16 h-16 mb-4 ${alertSent === "sos" ? "text-guardher-danger" : "text-guardher-warning"}`} />
        <h1 className="text-2xl font-bold text-guardher-text mb-6">
          {alertSent === "sos" ? "SOS Alert Dispatched" : "Alert Sent"}
        </h1>
        <div className="w-full max-w-sm card p-6 mb-6">
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm font-medium text-guardher-text"><CheckCircleIcon className="w-5 h-5 text-guardher-primary"/> Trusted contacts notified</li>
            {alertSent === "sos" && <li className="flex items-center gap-3 text-sm font-medium text-guardher-text"><CheckCircleIcon className="w-5 h-5 text-guardher-primary"/> Emergency response alerted</li>}
            <li className="flex items-center gap-3 text-sm font-medium text-guardher-text"><CheckCircleIcon className="w-5 h-5 text-guardher-primary"/> Live tracking active</li>
          </ul>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="min-h-screen bg-guardher-bg flex items-center justify-center px-6">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
        <div className="relative z-10 bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
          <AlertTriangleIcon className={`w-10 h-10 mb-4 ${showConfirm === "sos" ? "text-guardher-danger" : "text-guardher-warning"}`} />
          <h2 className="text-xl font-bold text-guardher-text mb-2">
            {showConfirm === "sos" ? "Confirm Emergency SOS" : "Confirm 'Unsafe' Alert"}
          </h2>
          <p className="text-guardher-text-muted text-sm mb-6">
            {showConfirm === "sos" ? "This will instantly alert police dispatch and your contacts." : "This will notify contacts and start enhanced monitoring."}
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirm(null)} className="flex-1 py-3 border border-guardher-border-dark rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={() => triggerAlert(showConfirm)} disabled={sending} className={`flex-1 py-3 text-white rounded-md text-sm font-medium ${showConfirm === "sos" ? "bg-guardher-danger hover:bg-guardher-danger-hover" : "bg-guardher-warning hover:bg-guardher-warning-hover"}`}>
              {sending ? "Sending..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-guardher-bg flex flex-col">
      <div className="bg-white border-b border-guardher-border px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-guardher-primary animate-pulse" />
          <span className="text-sm font-semibold text-guardher-text">Session Active</span>
          <span className="text-sm text-guardher-text-muted ml-2">{elapsedTime}</span>
        </div>
        <button onClick={endRide} className="text-sm font-medium text-guardher-primary hover:text-guardher-primary-hover">End Session</button>
      </div>

      <div className="bg-white border-b border-guardher-border px-6 py-3 flex items-center gap-3 overflow-x-auto text-sm text-guardher-text">
        <CarIcon className="w-4 h-4 text-guardher-text-muted" />
        <span className="font-semibold">{session.ride.platform}</span>
        <span className="text-guardher-border-dark">|</span>
        <span>{session.ride.vehicleModel}</span>
        <span className="text-guardher-border-dark">|</span>
        <span className="font-medium">{session.ride.numberPlate}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-6">
        <button
          onClick={() => setShowConfirm("unsafe")}
          className="w-full max-w-sm p-6 bg-white border border-guardher-warning rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-2"
        >
          <AlertTriangleIcon className="w-8 h-8 text-guardher-warning" />
          <span className="text-lg font-bold text-guardher-text">I Feel Unsafe</span>
          <span className="text-sm text-guardher-text-muted">Suspicious route, discomfort. Notifies contacts.</span>
        </button>

        <button
          onClick={() => setShowConfirm("sos")}
          className="w-full max-w-sm p-6 bg-guardher-danger rounded-xl shadow-md hover:bg-guardher-danger-hover transition-colors flex flex-col items-center text-center gap-2"
        >
          <AlertTriangleIcon className="w-10 h-10 text-white" />
          <span className="text-2xl font-bold text-white tracking-wide">SOS</span>
          <span className="text-sm text-white/80">Immediate danger. Triggers police dispatch.</span>
        </button>
      </div>

      <div className="bg-white border-t border-guardher-border px-6 py-4 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-guardher-text-muted">
          <NavigationIcon className="w-4 h-4" />
          <span className="text-xs font-mono">
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </span>
        </div>
        <div className="text-xs text-guardher-text-muted">GPS Syncing</div>
      </div>
    </div>
  );
}

export default function LiveRidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-guardher-bg flex items-center justify-center"><div className="text-guardher-text-muted">Loading...</div></div>}>
      <LiveRideContent />
    </Suspense>
  );
}
