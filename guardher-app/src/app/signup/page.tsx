"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Karachi");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/ride/new");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern flex items-center justify-center p-6 relative py-12">
      <div className="w-full max-w-lg glass-card p-8 sm:p-10 shadow-2xl relative z-10 border border-pink-200">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldIcon className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gradient-pink">
              GuardHer
            </span>
          </Link>
          <h1 className="text-2xl font-black text-pink-950 tracking-tight">Create Safety Account</h1>
          <p className="text-xs text-pink-700 font-medium mt-1">Join 12,000+ Pakistani women traveling with confidence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ayesha Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                Your Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
                City in Pakistan
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad / Rawalpindi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Quetta">Quetta</option>
                <option value="Other">Other City</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
              Primary Guardian / Emergency Contact Phone
            </label>
            <input
              type="tel"
              required
              placeholder="Parent, Spouse or Friend's 03XX Number"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1">
              Create Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Complete Sign Up & Protect Rides"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-pink-800 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-pink-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
