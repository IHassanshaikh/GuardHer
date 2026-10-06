"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { IncidentCase } from "@/lib/types";

/* ===== ICONS ===== */
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
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

function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}

function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

function ZapIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function SparklesIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

interface StatsData {
  totalSessions: number;
  activeSessions: number;
  totalIncidents: number;
  pendingIncidents: number;
  totalProtectedWomen: number;
  avgDispatchTimeSec: number;
  citiesCovered: number;
}

export default function HomePage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [latestIncident, setLatestIncident] = useState<IncidentCase | null>(null);

  useEffect(() => {
    fetch("/api/sessions?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setActiveSessionId(data.session.id);
        }
      })
      .catch(() => {});

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: StatsData) => {
        if (data && typeof data.totalProtectedWomen === "number") {
          setStats(data);
        }
      })
      .catch(() => {});

    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.incidents && data.incidents.length > 0) {
          setLatestIncident(data.incidents[0]);
        }
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: "How does GuardHer protect Pakistani women during ride-shares?",
      a: "GuardHer pre-loads critical trip intelligence—driver name, vehicle model, registration number plate, and destination—before your ride begins. If an emergency occurs, a single tap dispatches this entire telemetry packet along with continuous live GPS coordinates directly to police dispatchers and family members.",
    },
    {
      q: "Does GuardHer work with InDrive, Yango, Bykea, and Uber?",
      a: "Yes! GuardHer is specifically designed to work seamlessly alongside all ride-hailing services in Pakistan including InDrive, Yango, Bykea, Uber, and local taxi services.",
    },
    {
      q: "Do my emergency contacts need to install the GuardHer app?",
      a: "No! Your trusted contacts receive an instant, secure SMS link with a real-time web tracking map. They can view your live vehicle position, trip details, and safety status directly on any web browser without downloading anything.",
    },
    {
      q: "Is GuardHer free for women in Pakistan?",
      a: "Yes, GuardHer's core emergency dispatch and live tracking features are 100% free for all women across Pakistan as part of our mission to ensure safe mobility.",
    },
    {
      q: "What is the difference between 'I Feel Unsafe' and 'SOS'?",
      a: "'I Feel Unsafe' sends a subtle, quiet alert to your selected contacts to monitor your trip closely if a driver takes a suspicious detour or acts inappropriately. 'SOS' is for active danger—it instantly triggers alarm protocols, alerts authority dispatch centers (like Rescue 15), and broadcasts your exact live location.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#1F1116] bg-grid-pattern relative">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-pink-glow pointer-events-none -z-10" />

      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="GuardHer Logo" className="w-10 h-10 rounded-xl object-cover shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform border border-pink-200" />
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-gradient-pink">
                GuardHer
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-pink-600 -mt-1">
                Pakistan Safety AI
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-pink-950">
            <a href="#features" className="hover:text-pink-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-pink-600 transition-colors">How It Works</a>
            <a href="#night-safety" className="hover:text-pink-600 transition-colors">Night Safety</a>
            <a href="#testimonials" className="hover:text-pink-600 transition-colors">Stories</a>
            <a href="#faq" className="hover:text-pink-600 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-pink-700 hover:text-pink-900 transition-colors px-3 py-2 rounded-lg hover:bg-pink-100/50"
            >
              Dispatch Center
            </Link>
            <Link
              href="/login"
              className="text-sm font-bold text-pink-950 hover:text-pink-600 transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-12 md:pt-20 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            {/* AI BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-pink-200 shadow-sm backdrop-blur-md mb-6 animate-float">
              <SparklesIcon className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                AI Women's Safety Network • Pakistan
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Travel Boldly.<br />
              <span className="text-gradient-pink">Always Guarded.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#6B4657] font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Preload your InDrive, Yango, or Bykea details before travel. If danger strikes, GuardHer dispatches live telemetry, vehicle plate info, and continuous GPS location to authorities and contacts instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-2xl text-base font-extrabold shadow-xl shadow-pink-500/40 hover:shadow-pink-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Get Started Free</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={activeSessionId ? `/ride/live?sessionId=${activeSessionId}` : "/ride/new"}
                className="px-8 py-4 bg-white/90 border-2 border-pink-200 text-pink-950 rounded-2xl text-base font-extrabold hover:border-pink-500 hover:bg-pink-50/50 shadow-md transition-all flex items-center justify-center gap-2"
              >
                {activeSessionId ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                    <span>Resume Active Session</span>
                  </>
                ) : (
                  <span>Launch Safe Ride Demo</span>
                )}
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-10 pt-8 border-t border-pink-200/60 flex items-center justify-center lg:justify-start gap-8 text-xs font-bold text-pink-900">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-pink-600" />
                <span>Zero-Typing Panic Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-pink-600" />
                <span>Direct 15 Police Sync</span>
              </div>
            </div>
          </div>

          {/* HERO IMAGE CONTAINER WITH FLOATING GLASS CARDS */}
          <div className="flex-1 w-full max-w-xl relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/hero-image.jpg"
                alt="Empowered Pakistani woman using GuardHer safety app on street in Lahore"
                className="w-full h-[480px] object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-pink-300">Active Protection</p>
                <p className="text-lg font-extrabold">Safeguard Every Trip Across Karachi, Lahore & Islamabad</p>
              </div>
            </div>

            {/* FLOATING GLASS CARD 1 */}
            <div className="absolute -top-6 -left-6 glass-card p-4 hidden sm:flex items-center gap-3 shadow-xl animate-float">
              <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-extrabold text-sm">
                SOS
              </div>
              <div>
                <p className="text-xs font-bold text-pink-950">1-Tap Emergency</p>
                <p className="text-[10px] text-pink-700 font-semibold">&lt; 3 Sec Dispatch Speed</p>
              </div>
            </div>

            {/* FLOATING GLASS CARD 2 */}
            <div className="absolute -bottom-6 -right-6 glass-card p-4 hidden sm:flex items-center gap-3 shadow-xl animate-float" style={{ animationDelay: "2s" }}>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-pink-950">Live GPS Lock</p>
                <p className="text-[10px] text-pink-700 font-semibold">Real-Time Route Sync</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className="py-10 bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black">
              {stats ? `${stats.totalProtectedWomen.toLocaleString()}+` : "12,450+"}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-200 mt-1">Pakistani Women Protected</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black">
              {stats ? `< ${stats.avgDispatchTimeSec}s` : "< 3 Sec"}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-200 mt-1">Emergency Dispatch Time</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black">
              {stats ? `${stats.activeSessions} Active` : "100%"}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-200 mt-1">
              {stats ? "Live Monitored Trips" : "Free for All Women"}
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black">
              {stats ? `${stats.citiesCovered}+ Cities` : "12+ Cities"}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-200 mt-1">Coverage Across Pakistan</p>
          </div>
        </div>
      </section>

      {/* ===== CORE FEATURES SHOWCASE ===== */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full">
            Complete Protection System
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight mt-4">
            Designed for Real-World Emergencies in Pakistan
          </h2>
          <p className="text-base text-pink-800 font-medium mt-4">
            Traditional panic buttons fail when you can't type your location or car details. GuardHer solves this by pre-storing your ride intelligence before you step into the vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CARD 1 */}
          <div className="glass-card p-8 hover:scale-[1.03] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:rotate-6 transition-transform">
              <ShieldIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-pink-950 mb-3">Preloaded Ride Data</h3>
            <p className="text-sm text-pink-800 font-medium leading-relaxed">
              Log your ride provider (InDrive, Yango, Bykea), driver name, vehicle model, and number plate in 5 seconds before entering the car.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="glass-card p-8 hover:scale-[1.03] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:rotate-6 transition-transform">
              <MapPinIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-pink-950 mb-3">Live Telemetry & GPS</h3>
            <p className="text-sm text-pink-800 font-medium leading-relaxed">
              Continuous live GPS tracking feeds your precise coordinates directly to emergency dispatchers so they see your moving route, not just a static pin.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="glass-card p-8 hover:scale-[1.03] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:rotate-6 transition-transform">
              <AlertTriangleIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-pink-950 mb-3">Dual Safety Alerting</h3>
            <p className="text-sm text-pink-800 font-medium leading-relaxed">
              Choose between 'I Feel Unsafe' for silent guardian warnings during route deviations, or 'SOS' for instant high-priority emergency dispatch.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="glass-card p-8 hover:scale-[1.03] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:rotate-6 transition-transform">
              <UsersIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-pink-950 mb-3">App-Free Guardian Sync</h3>
            <p className="text-sm text-pink-800 font-medium leading-relaxed">
              Your parents or trusted friends receive a secure SMS web link to track your journey live on a map without needing to install any app.
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section id="how-it-works" className="py-24 px-6 bg-white/70 backdrop-blur-md border-y border-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full">
              4 Simple Steps
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight mt-4">
              How GuardHer Works on Every Trip
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative p-6 rounded-2xl bg-[#FFF5F8] border border-pink-200">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center mb-4 text-base">
                1
              </div>
              <h4 className="text-lg font-bold text-pink-950 mb-2">Book Your Ride</h4>
              <p className="text-xs text-pink-800 font-medium leading-relaxed">
                Order your ride normally using InDrive, Yango, Bykea, or Uber.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-[#FFF5F8] border border-pink-200">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center mb-4 text-base">
                2
              </div>
              <h4 className="text-lg font-bold text-pink-950 mb-2">Log Details in 5 sec</h4>
              <p className="text-xs text-pink-800 font-medium leading-relaxed">
                Enter car number plate & destination in GuardHer before stepping inside.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-[#FFF5F8] border border-pink-200">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center mb-4 text-base">
                3
              </div>
              <h4 className="text-lg font-bold text-pink-950 mb-2">Travel Protected</h4>
              <p className="text-xs text-pink-800 font-medium leading-relaxed">
                Background GPS monitoring tracks your journey safely to your destination.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white border border-pink-400 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-white text-pink-600 font-extrabold flex items-center justify-center mb-4 text-base">
                4
              </div>
              <h4 className="text-lg font-bold mb-2">1-Tap Emergency</h4>
              <p className="text-xs text-pink-100 font-medium leading-relaxed">
                Tap SOS if in danger. Vehicle data and live GPS are sent to police & family immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NIGHT TRAVEL SPOTLIGHT ===== */}
      <section id="night-safety" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/night-ride.jpg"
                alt="Pakistani woman entering ride share at night in Islamabad with GuardHer app"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="px-3 py-1 bg-pink-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Night Protection Mode
                </span>
                <p className="text-xl font-black mt-2">Islamabad & Karachi Night Safety Coverage</p>
              </div>
            </div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full">
              Night & Late-Shift Safety
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight mt-4 mb-6">
              Returning Home Late? We’ve Got Your Back.
            </h2>
            <p className="text-base text-pink-800 font-medium mb-8 leading-relaxed">
              Whether you are a university student leaving evening classes or a working professional returning late from office, GuardHer's active night monitoring ensures you never feel vulnerable during nighttime commutes in Pakistani cities.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-pink-200">
                <ZapIcon className="w-6 h-6 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-pink-950">Automated Route Deviation Watch</h4>
                  <p className="text-xs text-pink-800 font-medium">Detects unexpected stops or unusual route changes during night rides.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-pink-200">
                <LockIcon className="w-6 h-6 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-pink-950">Encrypted Emergency Telemetry</h4>
                  <p className="text-xs text-pink-800 font-medium">Your location is encrypted and shared only when an alert is triggered.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMERGENCY PACKET PREVIEW ===== */}
      <section className="py-20 px-6 bg-pink-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-400 bg-pink-900/50 border border-pink-700/50 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Backend Telemetry Feed
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              The Emergency Intelligence Packet
            </h2>
            <p className="text-sm text-pink-300 mt-2 font-medium">
              This is the live high-priority data packet dispatched to police and guardians from the GuardHer engine.
            </p>
          </div>

          <div className="glass-card-dark overflow-hidden text-white border border-pink-500/30">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-white animate-pulse" />
                <span className="font-bold text-sm tracking-wide">
                  {latestIncident?.alertLevel === "unsafe"
                    ? "UNSAFE TRIP DETOUR WARNING"
                    : "HIGH-PRIORITY SOS DISPATCH"}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white">
                {latestIncident ? `INCIDENT: ${latestIncident.resolution.toUpperCase()}` : "LIVE DISPATCH ACTIVE"}
              </span>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="border-b sm:border-b-0 border-pink-900/50 pb-4 sm:pb-0">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Passenger Identifier</p>
                <p className="font-semibold text-lg text-white mt-1">
                  {latestIncident ? `Passenger ID: ${latestIncident.session.userId}` : "Zainab R. (Verified User)"}
                </p>
              </div>

              <div className="border-b sm:border-b-0 border-pink-900/50 pb-4 sm:pb-0">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Ride Provider & Driver</p>
                <p className="font-semibold text-lg text-white mt-1">
                  {latestIncident
                    ? `${latestIncident.session.ride.platform} (${latestIncident.session.ride.driverName})`
                    : "InDrive Pakistan (Kashif M.)"}
                </p>
              </div>

              <div className="border-b sm:border-b-0 border-pink-900/50 pb-4 sm:pb-0">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Vehicle Reg. Plate & Model</p>
                <p className="font-semibold text-lg text-pink-300 mt-1">
                  {latestIncident
                    ? `${latestIncident.session.ride.numberPlate} — ${latestIncident.session.ride.vehicleModel}`
                    : "LEC-9842 — White Suzuki Alto"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Live GPS Coordinates & Telemetry</p>
                <p className="font-mono text-xs font-bold text-emerald-400 mt-1 bg-black/40 p-2 rounded-lg border border-emerald-500/30">
                  {latestIncident && latestIncident.session.currentLocation
                    ? `Lat: ${latestIncident.session.currentLocation.lat.toFixed(4)}° N, Lng: ${latestIncident.session.currentLocation.lng.toFixed(4)}° E (${latestIncident.session.currentLocation.speed ? `${latestIncident.session.currentLocation.speed} km/h` : "Moving"})`
                    : "Lat: 31.4704° N, Lng: 74.4098° E (Johar Town, Lahore)"}
                </p>
              </div>
            </div>

            <div className="bg-pink-900/40 px-8 py-5 border-t border-pink-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-200">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                <span>
                  {latestIncident
                    ? `Notified ${latestIncident.session.trustedContacts.length} trusted contacts + 15 Police Sync`
                    : "Dispatched to 15 Madadgar Police Center + 3 Primary Guardian SMS Links"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-pink-400">
                Timestamp:{" "}
                {latestIncident
                  ? new Date(latestIncident.triggerTime).toLocaleTimeString()
                  : new Date().toLocaleTimeString()}{" "}
                PKT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full">
            Real Impact
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight mt-4">
            Trusted by Women Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col justify-between">
            <p className="text-sm text-pink-950 font-medium leading-relaxed italic mb-6">
              "As a medical resident working night shifts at Mayo Hospital Lahore, booking InDrive late at night used to give me constant anxiety. GuardHer gives me peace of mind every single night."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-sm">
                HA
              </div>
              <div>
                <p className="text-sm font-bold text-pink-950">Dr. Hira Ahmed</p>
                <p className="text-xs text-pink-700 font-semibold">Resident Doctor • Lahore</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col justify-between">
            <p className="text-sm text-pink-950 font-medium leading-relaxed italic mb-6">
              "My parents live in Rawalpindi while I study at NUST Islamabad. Sending them my GuardHer live tracking link every time I take a cab keeps them completely calm."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm">
                FK
              </div>
              <div>
                <p className="text-sm font-bold text-pink-950">Fatima Khan</p>
                <p className="text-xs text-pink-700 font-semibold">University Student • Islamabad</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col justify-between">
            <p className="text-sm text-pink-950 font-medium leading-relaxed italic mb-6">
              "When a driver took an unexpected turn off Shahrah-e-Faisal in Karachi, I used 'I Feel Unsafe'. My brother got an alert immediately and called me. It's an indispensable app."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white font-bold flex items-center justify-center text-sm">
                ZA
              </div>
              <div>
                <p className="text-sm font-bold text-pink-950">Zainab Ali</p>
                <p className="text-xs text-pink-700 font-semibold">Software Engineer • Karachi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-24 px-6 bg-white/80 border-t border-pink-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-4 py-1.5 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight mt-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-pink-200 overflow-hidden bg-[#FFF5F8] transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center font-bold text-base text-pink-950 hover:text-pink-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-xl font-black text-pink-600 transition-transform ${openFaq === idx ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-pink-800 font-medium leading-relaxed border-t border-pink-200/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 p-12 text-center text-white shadow-2xl shadow-pink-500/40 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Never Travel Alone Again.
            </h2>
            <p className="text-base sm:text-lg text-pink-100 font-medium max-w-xl mx-auto mb-8">
              Join thousands of women across Pakistan who ride with confidence every single day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-pink-600 hover:bg-pink-50 rounded-2xl text-base font-extrabold shadow-xl hover:scale-[1.03] transition-all"
              >
                Create Your Free Account
              </Link>
              <Link
                href="/ride/new"
                className="px-8 py-4 bg-pink-950/40 text-white border border-pink-300/40 hover:bg-pink-950/60 rounded-2xl text-base font-extrabold backdrop-blur-md transition-all"
              >
                Test Emergency Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-pink-950 text-pink-200 py-16 px-6 border-t border-pink-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="GuardHer Logo" className="w-9 h-9 rounded-lg object-cover shadow-sm border border-pink-400/30" />
              <span className="text-xl font-extrabold text-white">GuardHer</span>
            </div>
            <p className="text-xs text-pink-400 font-medium leading-relaxed">
              Pakistan's AI-Powered Emergency Intelligence Platform for Women's Mobility & Safety.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-pink-300 font-medium">
              <li><a href="#features" className="hover:text-pink-400">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-pink-400">How It Works</a></li>
              <li><a href="#night-safety" className="hover:text-pink-400">Night Safety Mode</a></li>
              <li><Link href="/dashboard" className="hover:text-pink-400">Dispatch Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pakistan Helplines</h4>
            <ul className="space-y-2 text-xs text-pink-300 font-medium">
              <li>Rescue 15 Police: <span className="font-bold text-white">15</span></li>
              <li>Women Helpline: <span className="font-bold text-white">1099</span></li>
              <li>Rescue Ambulance: <span className="font-bold text-white">1122</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Supported Platforms</h4>
            <p className="text-xs text-pink-300 font-medium leading-relaxed">
              InDrive • Yango • Bykea • Uber • Local Cabs & Auto-Rickshaws
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-pink-900/60 text-center text-xs text-pink-400 font-medium">
          © {new Date().getFullYear()} GuardHer Pakistan. All rights reserved. Empowering women's freedom of movement.
        </div>
      </footer>
    </div>
  );
}
