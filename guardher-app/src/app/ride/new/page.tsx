"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RidePlatform, Relationship } from "@/lib/types";

const platforms: { name: RidePlatform; color: string }[] = [
  { name: "InDrive", color: "from-green-500 to-emerald-600" },
  { name: "Yango", color: "from-red-500 to-rose-600" },
  { name: "Bykea" as any, color: "from-amber-500 to-yellow-600" },
  { name: "Careem", color: "from-teal-500 to-emerald-600" },
  { name: "Uber", color: "from-gray-800 to-black" },
  { name: "Other", color: "from-pink-500 to-purple-600" },
];

const relationships: Relationship[] = ["Parent", "Brother", "Sister", "Husband", "Friend", "Guardian", "Other"];

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}

function SparklesIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
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

export default function NewRidePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Form State
  const [platform, setPlatform] = useState<RidePlatform>("InDrive");
  const [driverName, setDriverName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  // Contacts
  const [contacts, setContacts] = useState([
    { id: "tc-001", name: "Ammi (Mother)", phone: "0300-9876543", relationship: "Parent" as Relationship, selected: true },
    { id: "tc-002", name: "Tariq (Brother)", phone: "0321-4567890", relationship: "Brother" as Relationship, selected: true },
    { id: "tc-003", name: "Zainab (Friend)", phone: "0333-1122334", relationship: "Friend" as Relationship, selected: false },
  ]);

  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRel, setNewContactRel] = useState<Relationship>("Friend");

  useEffect(() => {
    fetch("/api/sessions?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          router.push(`/ride/live?sessionId=${data.session.id}`);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleQuickScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setDriverName("Muhammad Usman");
      setVehicleModel("Suzuki Alto (White)");
      setNumberPlate("LEC-8921");
      setPickup("DHA Phase 5, Lahore");
      setDestination("Johar Town Block G, Lahore");
      setScanning(false);
      setScanResult("✨ AI Safety Scanner Auto-Filled Ride Data!");
    }, 1200);
  };

  const toggleContact = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const addContact = () => {
    if (!newContactName || !newContactPhone) return;
    setContacts((prev) => [
      ...prev,
      {
        id: `tc-new-${Date.now()}`,
        name: newContactName,
        phone: newContactPhone,
        relationship: newContactRel,
        selected: true,
      },
    ]);
    setNewContactName("");
    setNewContactPhone("");
  };

  const startSafeRide = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ride: { platform, driverName, vehicleModel, numberPlate, pickup, destination },
          trustedContactIds: contacts.filter((c) => c.selected).map((c) => c.id),
        }),
      });
      const data = await res.json();
      if (data.session) {
        router.push(`/ride/live?sessionId=${data.session.id}`);
      }
    } catch (err) {
      console.error("Failed to start", err);
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = driverName && vehicleModel && numberPlate && pickup && destination;
  const canProceedStep2 = contacts.some((c) => c.selected);

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern pb-24 text-pink-950">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-pink-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="GuardHer Logo" className="w-8 h-8 rounded-lg object-cover border border-pink-200" />
            <span className="text-xl font-extrabold text-gradient-pink">GuardHer</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
            Preload Ride Intelligence
          </span>
        </div>
      </nav>

      <div className="pt-10 px-6 max-w-2xl mx-auto">
        {/* STEP PROGRESS BAR */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[
            { num: 1, label: "Ride Intelligence" },
            { num: 2, label: "Guardian Sync" },
            { num: 3, label: "Activate Protection" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-extrabold transition-all shadow-sm ${
                  step >= s.num
                    ? "bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-pink-500/30 scale-105"
                    : "bg-white text-pink-400 border border-pink-200"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className={`text-[11px] font-bold ${step >= s.num ? "text-pink-950" : "text-pink-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: RIDE DETAILS */}
        {step === 1 && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border border-pink-200 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-pink-950 tracking-tight">Preload Ride Details</h1>
                <p className="text-xs text-pink-700 font-medium mt-1">
                  Input driver & vehicle info before entering the vehicle for zero-typing panic dispatch.
                </p>
              </div>
              <button
                onClick={handleQuickScan}
                disabled={scanning}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-xs font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <SparklesIcon className="w-4 h-4" />
                {scanning ? "Scanning..." : "Demo Auto-Fill"}
              </button>
            </div>

            {scanResult && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                {scanResult}
              </div>
            )}

            <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-2">
              Select Ride-Hailing Platform
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPlatform(p.name)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    platform === p.name
                      ? "bg-gradient-to-r from-pink-500 to-rose-600 border-transparent text-white shadow-md shadow-pink-500/20 scale-105"
                      : "bg-white border-pink-200 text-pink-950 hover:bg-pink-50"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Asif Ali"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Suzuki Alto White"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                    Registration Plate
                  </label>
                  <input
                    type="text"
                    value={numberPlate}
                    onChange={(e) => setNumberPlate(e.target.value)}
                    placeholder="e.g. LEA-1234"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-pink-950 placeholder-pink-300 text-sm font-medium uppercase font-mono focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. DHA Phase 5, Lahore"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Johar Town, Lahore"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-pink-200 text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>
            </div>

            <button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-extrabold text-base disabled:opacity-50 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Continue to Guardian Sync →
            </button>
          </div>
        )}

        {/* STEP 2: CONTACTS */}
        {step === 2 && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border border-pink-200">
            <h1 className="text-2xl font-black text-pink-950 tracking-tight mb-2">Guardian Sync</h1>
            <p className="text-xs text-pink-700 font-medium mb-6">
              Select who will receive your continuous live tracking map via instant SMS link.
            </p>

            <div className="space-y-3 mb-6">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleContact(c.id)}
                  className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
                    c.selected
                      ? "bg-pink-100/60 border-pink-400 shadow-sm"
                      : "bg-white border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center mr-4 transition-all ${c.selected ? "bg-pink-600 border-pink-600 text-white" : "border-pink-300 bg-white"}`}>
                    {c.selected && <CheckCircleIcon className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-pink-950">{c.name}</div>
                    <div className="text-xs text-pink-700 font-semibold">{c.phone} • {c.relationship}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-pink-200/80 pt-6 mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-3">
                + Add Another Guardian
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Guardian Name"
                  className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none"
                />
                <input
                  type="text"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={newContactRel}
                  onChange={(e) => setNewContactRel(e.target.value as Relationship)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 bg-white text-sm font-medium focus:ring-2 focus:ring-pink-500/20 outline-none"
                >
                  {relationships.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  onClick={addContact}
                  className="px-5 py-2.5 bg-pink-900 text-white rounded-xl text-sm font-extrabold hover:bg-pink-950 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-pink-300 rounded-xl font-bold text-pink-950 hover:bg-pink-100/50">
                Back
              </button>
              <button
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-xl font-extrabold disabled:opacity-50 shadow-lg shadow-pink-500/30 hover:scale-[1.01]"
              >
                Review Protection →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="glass-card p-8 sm:p-10 shadow-2xl border border-pink-200">
            <h1 className="text-2xl font-black text-pink-950 tracking-tight mb-6">Review &amp; Activate</h1>

            <div className="rounded-2xl border border-pink-200 bg-white overflow-hidden mb-6 shadow-sm">
              <div className="bg-pink-100/70 px-5 py-3 border-b border-pink-200 font-extrabold text-xs uppercase tracking-wider text-pink-900">
                Ride Intelligence Summary
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-pink-700 font-semibold">Service</span><span className="font-bold text-pink-950">{platform}</span></div>
                <div className="flex justify-between"><span className="text-pink-700 font-semibold">Driver</span><span className="font-bold text-pink-950">{driverName}</span></div>
                <div className="flex justify-between"><span className="text-pink-700 font-semibold">Vehicle</span><span className="font-bold text-pink-950">{vehicleModel}</span></div>
                <div className="flex justify-between"><span className="text-pink-700 font-semibold">Plate</span><span className="font-bold text-pink-600 font-mono bg-pink-50 px-2 py-0.5 rounded">{numberPlate}</span></div>
                <div className="flex justify-between"><span className="text-pink-700 font-semibold">Route</span><span className="font-bold text-pink-950">{pickup} → {destination}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-pink-200 bg-white overflow-hidden mb-8 shadow-sm">
              <div className="bg-pink-100/70 px-5 py-3 border-b border-pink-200 font-extrabold text-xs uppercase tracking-wider text-pink-900">
                Notified Guardians ({contacts.filter(c => c.selected).length})
              </div>
              <div className="p-5 space-y-2">
                {contacts.filter(c => c.selected).map(c => (
                  <div key={c.id} className="text-sm flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-pink-950">{c.name}</span>
                    <span className="text-xs text-pink-700 font-medium">({c.phone})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="px-6 py-3.5 border border-pink-300 rounded-xl font-bold text-pink-950 hover:bg-pink-100/50">
                Back
              </button>
              <button
                onClick={startSafeRide}
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-xl font-black text-base shadow-xl shadow-pink-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <ShieldIcon className="w-6 h-6" />
                {loading ? "Activating GuardHer..." : "Activate Safe Session Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
