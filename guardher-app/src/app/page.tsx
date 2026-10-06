"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ===== ICONS (Lucide) ===== */
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
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
function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-6 border-guardher-border hover:border-guardher-primary transition-colors">
      <div className="text-guardher-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-guardher-text mb-2">
        {title}
      </h3>
      <p className="text-guardher-text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function HomePage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("/api/sessions?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setActiveSessionId(data.session.id);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-guardher-bg">
      {/* ===== NAVBAR ===== */}
      <nav className="border-b border-guardher-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldIcon className="w-6 h-6 text-guardher-primary" />
            <span className="text-xl font-bold text-guardher-text tracking-tight">
              GuardHer
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-guardher-text-muted hover:text-guardher-primary transition-colors"
            >
              Authority Dashboard
            </Link>
            <Link
              href={activeSessionId ? `/ride/live?sessionId=${activeSessionId}` : "/ride/new"}
              className="px-4 py-2 bg-guardher-primary text-white rounded-md text-sm font-medium hover:bg-guardher-primary-hover transition-colors"
            >
              {activeSessionId ? "Resume Session" : "New Safety Session"}
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-guardher-text tracking-tight mb-6">
            Women's Safety Intelligence for Pakistan.
          </h1>
          <p className="text-lg text-guardher-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            GuardHer preloads ride details before travel. In an emergency, a single tap dispatches 
            driver information, vehicle details, and live location to authorities and trusted contacts instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={activeSessionId ? `/ride/live?sessionId=${activeSessionId}` : "/ride/new"}
              className="px-6 py-3 bg-guardher-primary text-white rounded-md text-base font-medium hover:bg-guardher-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              {activeSessionId ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Resume Active Ride
                </>
              ) : (
                "Start Safe Ride"
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 px-6 bg-white border-y border-guardher-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-guardher-text mb-12">
            Built for Real Emergencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ShieldIcon className="w-6 h-6" />}
              title="Preloaded Intelligence"
              desc="Log your Yango, InDrive, or Bykea details before travel. During an emergency, no typing is required."
            />
            <FeatureCard
              icon={<MapPinIcon className="w-6 h-6" />}
              title="Live GPS Tracking"
              desc="Continuous location updates directly to dispatchers. Authorities see exact routes, not just static pins."
            />
            <FeatureCard
              icon={<AlertTriangleIcon className="w-6 h-6" />}
              title="Two Alert Levels"
              desc="'I Feel Unsafe' for suspicious behaviour. 'SOS' for immediate danger requiring police dispatch."
            />
            <FeatureCard
              icon={<UsersIcon className="w-6 h-6" />}
              title="Trusted Contacts"
              desc="Instant SMS links to parents or guardians allowing them to monitor the vehicle live on a map."
            />
          </div>
        </div>
      </section>

      {/* ===== ALERT PREVIEW ===== */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-guardher-text mb-8">
            The Intelligence Packet
          </h2>
          <div className="card overflow-hidden">
            <div className="bg-guardher-danger px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <AlertTriangleIcon className="w-5 h-5" />
                <span className="font-semibold">SOS Dispatch Created</span>
              </div>
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium text-white">
                LIVE
              </span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Passenger</div>
                  <div className="text-sm font-medium">Ayesha M.</div>
                </div>
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Ride Service</div>
                  <div className="text-sm font-medium">InDrive</div>
                </div>
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Vehicle</div>
                  <div className="text-sm font-medium">Suzuki Alto — LEA-1234</div>
                </div>
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Route</div>
                  <div className="text-sm font-medium">Johar Town to DHA Phase 5</div>
                </div>
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Live Position</div>
                  <div className="text-sm font-medium text-guardher-primary">Active Tracking...</div>
                </div>
                <div>
                  <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-1">Time</div>
                  <div className="text-sm font-medium">21:42 PKT</div>
                </div>
              </div>
            </div>

            <div className="bg-guardher-surface-alt px-6 py-4 border-t border-guardher-border">
              <div className="text-xs text-guardher-text-muted uppercase tracking-wider mb-3 font-semibold">
                Notifications Sent
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-guardher-text">
                  <CheckCircleIcon className="w-4 h-4 text-guardher-primary" />
                  Police Dispatch Center (Karachi)
                </div>
                <div className="flex items-center gap-2 text-sm text-guardher-text">
                  <CheckCircleIcon className="w-4 h-4 text-guardher-primary" />
                  Primary Emergency Contact (0300-XXXXXXX)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
