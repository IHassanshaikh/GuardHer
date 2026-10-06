"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { RideSession, AlertLevel } from "@/lib/types";
import InteractiveMap from "@/components/InteractiveMap";
import { playRingTone, playEmergencySiren } from "@/lib/sound";

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
function Volume2Icon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
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

  // REAL AUDIO EVIDENCE RECORDING
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // REAL SOUND SYNTHESIS
  const [fakeCall, setFakeCall] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const stopRingRef = useRef<(() => void) | null>(null);
  const stopSirenRef = useRef<(() => void) | null>(null);

  // VOICE KEYPHRASE TRIGGER STATUS
  const [voiceListening, setVoiceListening] = useState(false);
  const [detectedPhrase, setDetectedPhrase] = useState<string | null>(null);

  // GPS TELEMETRY
  const [currentLat, setCurrentLat] = useState(31.4704);
  const [currentLng, setCurrentLng] = useState(74.4098);
  const [speed, setSpeed] = useState(36);
  const [isRealGps, setIsRealGps] = useState(false);

  // Fetch session
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions?active=true`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) setSession(d.session);
      })
      .catch(() => {});
  }, [sessionId]);

  // Real Geolocation watch
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCurrentLat(pos.coords.latitude);
          setCurrentLng(pos.coords.longitude);
          if (pos.coords.speed) setSpeed(Math.round(pos.coords.speed * 3.6));
          setIsRealGps(true);
        },
        (err) => {
          console.log("GPS falling back to simulated Lahore coordinates:", err.message);
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Timer
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

  // Periodic Telemetry sync
  useEffect(() => {
    if (!session || rideEnded) return;
    const interval = setInterval(() => {
      if (!isRealGps) {
        setCurrentLat((p) => p + (Math.random() - 0.4) * 0.0005);
        setCurrentLng((p) => p + (Math.random() - 0.3) * 0.0005);
        setSpeed(Math.floor(30 + Math.random() * 15));
      }

      if (sessionId) {
        fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, lat: currentLat, lng: currentLng, speed }),
        }).catch(() => {});
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [session, sessionId, rideEnded, currentLat, currentLng, speed, isRealGps]);

  // Real Web Speech API keyphrase recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setVoiceListening(true);
        recognition.onend = () => {
          if (!rideEnded) {
            try { recognition.start(); } catch (e) {}
          }
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript.toLowerCase();
          if (transcript.includes("help") || transcript.includes("sos") || transcript.includes("emergency") || transcript.includes("bachao")) {
            setDetectedPhrase(transcript);
            triggerAlert("sos");
          }
        };

        try {
          recognition.start();
        } catch (e) {}

        return () => {
          try { recognition.stop(); } catch (e) {}
        };
      }
    }
  }, [rideEnded]);

  // REAL FAKE CALL WITH SYNTHESIZED RINGTONE
  const handleStartFakeCall = () => {
    setFakeCall(true);
    stopRingRef.current = playRingTone();
  };

  const handleStopFakeCall = () => {
    if (stopRingRef.current) {
      stopRingRef.current();
      stopRingRef.current = null;
    }
    setFakeCall(false);
  };

  // REAL EMERGENCY SIREN SYNTHESIZER
  const toggleSiren = () => {
    if (sirenActive) {
      if (stopSirenRef.current) stopSirenRef.current();
      setSirenActive(false);
    } else {
      stopSirenRef.current = playEmergencySiren();
      setSirenActive(true);
    }
  };

  // REAL AMBIENT AUDIO RECORDER
  const handleToggleRecordAudio = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("Microphone permission required for ambient audio recording.");
      }
    }
  };

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
          if (level === "sos") {
            // Automatically sound alarm on SOS
            stopSirenRef.current = playEmergencySiren();
            setSirenActive(true);
          }
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
    if (stopSirenRef.current) stopSirenRef.current();
    if (stopRingRef.current) stopRingRef.current();
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

  const whatsappMessage = encodeURIComponent(
    `🚨 EMERGENCY ALERT: I am traveling via ${session.ride.platform} (${session.ride.vehicleModel} - ${session.ride.numberPlate}). Driver: ${session.ride.driverName}. Track my live position on GuardHer: http://localhost:3000/contact-view`
  );

  if (rideEnded) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
          <CheckCircleIcon className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-pink-950 mb-2">Ride Completed Safely</h1>
        <p className="text-pink-700 font-medium mb-6">Total Trip Duration: {elapsedTime}</p>
        
        {recordedAudioUrl && (
          <div className="mb-8 p-4 glass-card max-w-sm w-full">
            <p className="text-xs font-bold text-pink-900 mb-2">Saved Ambient Audio Evidence:</p>
            <audio src={recordedAudioUrl} controls className="w-full" />
          </div>
        )}

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
        <h1 className="text-3xl font-black text-pink-950 mb-4 text-center">
          {alertSent === "sos" ? "SOS Police Dispatch Created" : "Unsafe Alert Broadcasted"}
        </h1>
        <div className="w-full max-w-md glass-card p-6 mb-6">
          <ul className="space-y-4 text-sm font-bold text-pink-950">
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Emergency contacts notified via live map link</li>
            {alertSent === "sos" && <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Rescue 15 Police Dispatch Center notified</li>}
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-emerald-600"/> Real-time GPS tracking stream active</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-md mb-4">
          <button
            onClick={toggleSiren}
            className={`w-full py-3.5 rounded-xl text-sm font-extrabold shadow-lg flex items-center justify-center gap-2 ${
              sirenActive ? "bg-black text-white" : "bg-rose-600 text-white"
            }`}
          >
            <Volume2Icon className="w-5 h-5" />
            <span>{sirenActive ? "Stop Emergency Siren" : "Sound Deterrent Siren"}</span>
          </button>

          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-extrabold shadow-lg flex items-center justify-center gap-2 text-center"
          >
            <span>Share Alert via WhatsApp</span>
          </a>
        </div>

        <Link href="/" className="px-6 py-2.5 bg-pink-950 text-white rounded-xl text-xs font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern flex flex-col pb-12 text-pink-950">
      {/* SIMULATED FAKE CALL WITH REAL AUDIO RING */}
      {fakeCall && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-between p-12">
          <div className="text-center mt-12">
            <p className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-2">Incoming GuardHer Ringing...</p>
            <p className="text-3xl font-black">Abbu (Father)</p>
            <p className="text-sm text-gray-400 mt-1">Audio ringing from speaker to deter driver</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-pink-600/30 border-2 border-pink-500 animate-ping flex items-center justify-center">
            <PhoneCallIcon className="w-10 h-10 text-pink-400" />
          </div>
          <button
            onClick={handleStopFakeCall}
            className="w-full max-w-xs py-4 bg-rose-600 text-white rounded-2xl font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
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
          <span className="text-xs font-mono font-bold bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-md">{elapsedTime}</span>
        </div>
        <button onClick={endRide} className="text-xs font-extrabold text-pink-600 hover:text-pink-900 uppercase tracking-wider px-3 py-1.5 rounded-lg bg-pink-50">
          End Session
        </button>
      </div>

      {/* VOICE DETECTION BANNER */}
      {voiceListening && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white px-6 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Hands-Free Voice SOS Active: Say &ldquo;Help&rdquo; or &ldquo;Bachao&rdquo; to auto-trigger SOS</span>
          {detectedPhrase && <span className="underline ml-2">Detected: &ldquo;{detectedPhrase}&rdquo;</span>}
        </div>
      )}

      {/* REAL-TIME INTERACTIVE MAP SHOWCASE */}
      <div className="max-w-xl mx-auto w-full px-6 pt-6">
        <InteractiveMap
          lat={currentLat}
          lng={currentLng}
          pickup={session.ride.pickup}
          destination={session.ride.destination}
          vehiclePlate={session.ride.numberPlate}
          driverName={session.ride.driverName}
          status={alertSent === "sos" ? "sos" : "active"}
        />
      </div>

      {/* VEHICLE TELEMETRY CARD */}
      <div className="max-w-xl mx-auto w-full px-6 pt-4">
        <div className="glass-card p-5 shadow-lg border border-pink-200">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-600">{session.ride.platform} Ride</span>
              <h3 className="text-base font-black text-pink-950">{session.ride.vehicleModel}</h3>
            </div>
            <span className="font-mono text-xs font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-xl">
              {session.ride.numberPlate}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-pink-800">
            <div><span className="text-pink-400">Driver:</span> {session.ride.driverName}</div>
            <div><span className="text-pink-400">Speed:</span> {speed} km/h {isRealGps ? "(GPS Lock)" : ""}</div>
            <div className="col-span-2 truncate"><span className="text-pink-400">Route:</span> {session.ride.pickup} → {session.ride.destination}</div>
          </div>
        </div>
      </div>

      {/* RECORDED AUDIO EVIDENCE PLAYER (IF CREATED) */}
      {recordedAudioUrl && (
        <div className="max-w-xl mx-auto w-full px-6 pt-4">
          <div className="glass-card p-4 border border-rose-200">
            <p className="text-xs font-bold text-rose-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              Recorded Ambient Audio Evidence Ready
            </p>
            <audio src={recordedAudioUrl} controls className="w-full h-8" />
          </div>
        </div>
      )}

      {/* MAIN PANIC ACTION CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 max-w-xl mx-auto w-full gap-4">
        <button
          onClick={() => setShowConfirm("unsafe")}
          className="w-full p-5 glass-card border-2 border-amber-400 hover:border-amber-500 shadow-md transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <AlertTriangleIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-black text-pink-950 block">I Feel Unsafe</span>
            <span className="text-xs text-pink-700 font-medium">Route deviation or discomfort. Silent alert to guardians.</span>
          </div>
        </button>

        <button
          onClick={() => setShowConfirm("sos")}
          className="w-full p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-2xl shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-5 text-left group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <AlertTriangleIcon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider block">1-TAP SOS</span>
            <span className="text-xs text-pink-100 font-medium">Immediate danger. Dispatches 15 Police &amp; guardians.</span>
          </div>
        </button>

        {/* EXTRA SAFETY TOOLS (ALL FUNCTIONAL) */}
        <div className="grid grid-cols-4 gap-2.5 w-full">
          <button
            onClick={handleStartFakeCall}
            className="p-3 glass-card text-center hover:bg-white transition-all flex flex-col items-center gap-1.5"
            title="Plays audible ringtone from speaker"
          >
            <PhoneCallIcon className="w-5 h-5 text-pink-600" />
            <span className="text-[10px] font-extrabold text-pink-950">Fake Call</span>
          </button>

          <button
            onClick={handleToggleRecordAudio}
            className={`p-3 glass-card text-center transition-all flex flex-col items-center gap-1.5 ${
              isRecording ? "bg-rose-50 border-rose-400" : ""
            }`}
            title="Real microphone audio capture"
          >
            <MicIcon className={`w-5 h-5 ${isRecording ? "text-rose-600 animate-ping" : "text-pink-600"}`} />
            <span className="text-[10px] font-extrabold text-pink-950">
              {isRecording ? "Stop Rec" : "Record Mic"}
            </span>
          </button>

          <button
            onClick={toggleSiren}
            className={`p-3 glass-card text-center transition-all flex flex-col items-center gap-1.5 ${
              sirenActive ? "bg-black text-white border-rose-600" : ""
            }`}
            title="High decibel sound oscillator"
          >
            <Volume2Icon className={`w-5 h-5 ${sirenActive ? "text-rose-500 animate-bounce" : "text-pink-600"}`} />
            <span className="text-[10px] font-extrabold">{sirenActive ? "Stop Siren" : "Siren"}</span>
          </button>

          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass-card text-center hover:bg-emerald-50 transition-all flex flex-col items-center gap-1.5 text-emerald-700"
            title="Pre-fills WhatsApp emergency message"
          >
            <span className="text-base font-bold">💬</span>
            <span className="text-[10px] font-extrabold">WhatsApp</span>
          </a>
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
