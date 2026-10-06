"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch user profile from API
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user) {
        localStorage.setItem("guardher_session_token", `user-token-${Date.now()}`);
        localStorage.setItem("guardher_user", JSON.stringify(data.user));
        router.push("/ride/new");
      }
    } catch (err) {
      setError("Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] bg-grid-pattern flex items-center justify-center p-6 relative text-pink-950">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 shadow-2xl relative z-10 border border-pink-200">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <img src="/logo.png" alt="GuardHer Logo" className="w-10 h-10 rounded-xl object-cover shadow-md border border-pink-200 group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-black tracking-tight text-gradient-pink">
              GuardHer
            </span>
          </Link>
          <h1 className="text-2xl font-black text-pink-950 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-pink-700 font-medium mt-1">Sign in to manage your safety profile &amp; emergency contacts</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-900 mb-1.5">
              Mobile Number (Pakistan)
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-900">
                Password
              </label>
              <a href="#" className="text-xs text-pink-600 font-semibold hover:underline">Forgot?</a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-pink-950 placeholder-pink-300 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to GuardHer"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-pink-800 font-medium">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-extrabold text-pink-600 hover:underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
