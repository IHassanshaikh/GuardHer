"use client";

import { useState, useEffect } from "react";

interface InteractiveMapProps {
  lat?: number;
  lng?: number;
  pickup?: string;
  destination?: string;
  vehiclePlate?: string;
  driverName?: string;
  status?: "active" | "sos" | "unsafe" | "completed";
}

export default function InteractiveMap({
  lat = 31.4704,
  lng = 74.4098,
  pickup = "DHA Phase 5, Lahore",
  destination = "Johar Town, Lahore",
  vehiclePlate = "LEC-8921",
  driverName = "Asif Ali",
  status = "active",
}: InteractiveMapProps) {
  const [carProgress, setCarProgress] = useState(25);
  const [radarPulse, setRadarPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 85 ? 15 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[360px] rounded-3xl overflow-hidden border-2 border-pink-200 bg-[#120810] shadow-2xl">
      {/* MAP BACKGROUND CANVAS PATTERN */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EC4899" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* SIMULATED ROADS */}
        <path d="M -50 180 Q 200 120 400 240 T 900 150" fill="none" stroke="#371B28" strokeWidth="24" />
        <path d="M -50 180 Q 200 120 400 240 T 900 150" fill="none" stroke="#EC4899" strokeWidth="4" strokeDasharray="8 6" strokeOpacity="0.8" />

        <path d="M 220 -50 L 220 450" fill="none" stroke="#371B28" strokeWidth="16" />
        <path d="M 520 -50 L 520 450" fill="none" stroke="#371B28" strokeWidth="16" />
      </svg>

      {/* SAFE ZONES & POLICE RADAR CHECKPOINTS */}
      <div className="absolute top-12 left-16 flex items-center gap-2 bg-pink-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/40 text-white text-[10px] font-bold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Rescue 15 Police Patrol Unit #4</span>
      </div>

      <div className="absolute bottom-16 right-12 flex items-center gap-2 bg-pink-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-500/40 text-white text-[10px] font-bold">
        <span className="w-2 h-2 rounded-full bg-pink-500" />
        <span>Safe Haven: 24/7 Lit Station</span>
      </div>

      {/* PICKUP PIN */}
      <div className="absolute top-28 left-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-extrabold flex items-center justify-center text-[10px] shadow-lg border-2 border-white">
          A
        </div>
        <span className="bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-bold mt-1 border border-pink-500/30">
          {pickup.split(",")[0]}
        </span>
      </div>

      {/* DESTINATION PIN */}
      <div className="absolute bottom-20 right-28 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center text-[10px] shadow-lg border-2 border-white">
          B
        </div>
        <span className="bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-bold mt-1 border border-rose-500/30">
          {destination.split(",")[0]}
        </span>
      </div>

      {/* MOVING VEHICLE MARKER & PERIMETER SAFETY CIRCLE */}
      <div
        className="absolute top-[180px] transition-all duration-1000 ease-linear flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${carProgress}%` }}
      >
        {/* PULSATING RADAR PERIMETER */}
        <div className="w-24 h-24 rounded-full bg-pink-500/15 border border-pink-400/40 animate-ping absolute pointer-events-none" />

        <div className={`w-10 h-10 rounded-2xl ${status === "sos" ? "bg-rose-600 animate-bounce" : "bg-gradient-to-tr from-pink-500 to-rose-600"} text-white flex items-center justify-center shadow-xl shadow-pink-500/50 border-2 border-white relative z-10`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
          </svg>
        </div>

        <div className="bg-pink-950/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-pink-500/40 mt-1 whitespace-nowrap">
          {vehiclePlate} ({driverName})
        </div>
      </div>

      {/* BOTTOM TELEMETRY OVERLAY */}
      <div className="absolute bottom-4 left-4 right-4 bg-pink-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-pink-500/30 flex items-center justify-between text-white text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-pink-300">Live GPS Stream • 30 km/h</span>
      </div>
    </div>
  );
}
