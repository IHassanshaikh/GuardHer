"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RidePlatform, Relationship } from "@/lib/types";

// Replacing "Other" with "Bykea" and making it specific
const platforms: RidePlatform[] = ["Yango", "Uber", "InDrive", "Careem", "Bykea" as any, "Other"];
const relationships: Relationship[] = ["Parent", "Brother", "Sister", "Husband", "Friend", "Guardian", "Other"];

/* ===== ICONS ===== */
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}

export default function NewRidePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Form State (Empty by default)
  const [platform, setPlatform] = useState<RidePlatform>("InDrive");
  const [driverName, setDriverName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  // Contacts
  const [contacts, setContacts] = useState([
    { id: "tc-001", name: "Father", phone: "0300-0000000", relationship: "Parent" as Relationship, selected: false },
    { id: "tc-002", name: "Brother", phone: "0321-0000000", relationship: "Brother" as Relationship, selected: false },
  ]);
  
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRel, setNewContactRel] = useState<Relationship>("Friend");

  // Check for active session on load
  useEffect(() => {
    fetch("/api/sessions?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          router.push(`/ride/live?sessionId=${data.session.id}`);
        }
      });
  }, [router]);

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
    <div className="min-h-screen bg-guardher-bg pb-20">
      {/* Nav */}
      <nav className="border-b border-guardher-border bg-white sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-guardher-primary" />
            <span className="text-lg font-bold text-guardher-text tracking-tight">GuardHer</span>
          </Link>
          <span className="text-sm font-medium text-guardher-text-muted">Setup Session</span>
        </div>
      </nav>

      <div className="pt-10 px-6 max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-guardher-primary text-white"
                    : "bg-guardher-surface-alt text-guardher-text-muted border border-guardher-border"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
            </div>
          ))}
        </div>

        {/* STEP 1: RIDE DETAILS */}
        {step === 1 && (
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-guardher-text mb-2">Ride Information</h1>
            <p className="text-sm text-guardher-text-muted mb-6">
              Enter the vehicle and driver details from your ride-hailing app.
            </p>

            <label className="block text-xs font-semibold text-guardher-text-muted uppercase tracking-wider mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-2 mb-6">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                    platform === p
                      ? "bg-guardher-primary border-guardher-primary text-white"
                      : "bg-white border-guardher-border text-guardher-text hover:bg-guardher-surface-alt"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { label: "Driver Name", value: driverName, set: setDriverName, placeholder: "e.g. Asif Ali" },
                { label: "Vehicle Make & Model", value: vehicleModel, set: setVehicleModel, placeholder: "e.g. Suzuki Alto White" },
                { label: "Registration Plate", value: numberPlate, set: setNumberPlate, placeholder: "e.g. LEA-1234" },
                { label: "Pickup Location", value: pickup, set: setPickup, placeholder: "e.g. DHA Phase 5" },
                { label: "Destination", value: destination, set: setDestination, placeholder: "e.g. Gulberg III" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-guardher-text mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-md bg-white border border-guardher-border-dark text-guardher-text placeholder:text-guardher-text-muted focus:outline-none focus:ring-2 focus:ring-guardher-primary/50 focus:border-guardher-primary transition-all sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="mt-8 w-full py-3 rounded-md bg-guardher-primary text-white font-medium disabled:opacity-50 hover:bg-guardher-primary-hover transition-colors"
            >
              Continue to Contacts
            </button>
          </div>
        )}

        {/* STEP 2: CONTACTS */}
        {step === 2 && (
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-guardher-text mb-2">Emergency Contacts</h1>
            <p className="text-sm text-guardher-text-muted mb-6">
              Select contacts to be notified with live tracking if an alert is triggered.
            </p>

            <div className="space-y-3 mb-6">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleContact(c.id)}
                  className={`w-full flex items-center p-4 rounded-md border transition-colors ${
                    c.selected
                      ? "bg-guardher-primary/5 border-guardher-primary"
                      : "bg-white border-guardher-border hover:bg-guardher-surface-alt"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-4 ${c.selected ? "bg-guardher-primary border-guardher-primary text-white" : "border-guardher-border-dark"}`}>
                    {c.selected && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-guardher-text">{c.name}</div>
                    <div className="text-xs text-guardher-text-muted">{c.phone} • {c.relationship}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-guardher-border pt-6 mb-6">
              <label className="block text-xs font-semibold text-guardher-text-muted uppercase tracking-wider mb-3">
                Add New Contact
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Name"
                  className="px-3 py-2 rounded-md border border-guardher-border-dark text-sm focus:ring-2 focus:ring-guardher-primary/50 outline-none"
                />
                <input
                  type="text"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="Phone (03XX...)"
                  className="px-3 py-2 rounded-md border border-guardher-border-dark text-sm focus:ring-2 focus:ring-guardher-primary/50 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={newContactRel}
                  onChange={(e) => setNewContactRel(e.target.value as Relationship)}
                  className="flex-1 px-3 py-2 rounded-md border border-guardher-border-dark text-sm bg-white focus:ring-2 focus:ring-guardher-primary/50 outline-none"
                >
                  {relationships.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  onClick={addContact}
                  className="px-4 py-2 bg-guardher-surface-alt border border-guardher-border rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-guardher-border-dark rounded-md font-medium text-guardher-text hover:bg-guardher-surface-alt">Back</button>
              <button
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-guardher-primary text-white rounded-md font-medium disabled:opacity-50 hover:bg-guardher-primary-hover"
              >
                Review Session
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-guardher-text mb-6">Review &amp; Start</h1>

            <div className="border border-guardher-border rounded-md overflow-hidden mb-6">
              <div className="bg-guardher-surface-alt px-4 py-2 border-b border-guardher-border">
                <span className="text-xs font-semibold text-guardher-text-muted uppercase">Ride Information</span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-guardher-text-muted">Platform</span><span className="font-medium">{platform}</span></div>
                <div className="flex justify-between text-sm"><span className="text-guardher-text-muted">Driver</span><span className="font-medium">{driverName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-guardher-text-muted">Vehicle</span><span className="font-medium">{vehicleModel}</span></div>
                <div className="flex justify-between text-sm"><span className="text-guardher-text-muted">Plate</span><span className="font-medium">{numberPlate}</span></div>
              </div>
            </div>

            <div className="border border-guardher-border rounded-md overflow-hidden mb-8">
              <div className="bg-guardher-surface-alt px-4 py-2 border-b border-guardher-border">
                <span className="text-xs font-semibold text-guardher-text-muted uppercase">Selected Contacts</span>
              </div>
              <div className="p-4 space-y-2">
                {contacts.filter(c => c.selected).map(c => (
                  <div key={c.id} className="text-sm">
                    <span className="font-medium">{c.name}</span> <span className="text-guardher-text-muted">({c.phone})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-guardher-border-dark rounded-md font-medium text-guardher-text hover:bg-guardher-surface-alt">Back</button>
              <button
                onClick={startSafeRide}
                disabled={loading}
                className="flex-1 py-3 bg-guardher-primary text-white rounded-md font-medium hover:bg-guardher-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldIcon className="w-5 h-5" />
                {loading ? "Starting..." : "Start Safe Session"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
