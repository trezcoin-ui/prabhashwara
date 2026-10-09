"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";

const EMOJIS = ["🪷", "🧘", "☮️", "🕉️", "🌸", "🌺", "🦋", "🌙", "⭐", "✨", "🌿", "🍃"];

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [emoji, setEmoji] = useState("🪷");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !pin) {
      setError("Please fill in all fields");
      return;
    }

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError("PIN must be exactly 6 digits");
      return;
    }

    if (isSignup && pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual auth with Supabase
      // For now, store in localStorage
      const user = { username, emoji, userId: Date.now().toString() };
      localStorage.setItem("prabhashwara_user", JSON.stringify(user));
      localStorage.setItem("prabhashwara_pin", pin); // In production, this would be hashed server-side
      
      router.push("/today");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0B0F17" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-[32px] font-semibold leading-tight text-white/90 mb-2 uppercase tracking-[0.12em]">prabhashwara</h1>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7BE3" }}>
            yoga practice tracker
          </p>
        </div>

        <GlassCard accent="#8B7BE3" delay={0} className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className={`${typography.h3} uppercase`}>
              {isSignup ? "create account" : "welcome back"}
            </h2>

            {/* Emoji Selector (signup only) */}
            {isSignup && (
              <div>
                <label className={`${typography.label} block mb-2`}>
                  Choose Your Emoji
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className="text-2xl p-2 rounded-lg transition-all"
                      style={{
                        background: emoji === e ? "rgba(139, 123, 227, 0.2)" : "rgba(255, 255, 255, 0.03)",
                        border: emoji === e ? "2px solid #8B7BE3" : "2px solid transparent",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label className={`${typography.label} block mb-2`}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                placeholder="nimal"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[14px]"
              />
            </div>

            {/* PIN */}
            <div>
              <label className={`${typography.label} block mb-2`}>
                6-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[14px] tracking-widest"
              />
            </div>

            {/* Confirm PIN (signup only) */}
            {isSignup && (
              <div>
                <label className={`${typography.label} block mb-2`}>
                  Confirm PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[14px] tracking-widest"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-[12px] text-red-400 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl ${typography.button} transition-all active:scale-98 disabled:opacity-50`}
              style={{ background: "#8B7BE3", color: "#0B0F17" }}
            >
              {loading ? "please wait..." : isSignup ? "create account" : "sign in"}
            </button>

            {/* Toggle Sign up / Sign in */}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
                setPin("");
                setConfirmPin("");
              }}
              className={`${typography.link} text-white/60 hover:text-white/90 w-full text-center block`}
            >
              {isSignup ? "already have an account? sign in" : "need an account? sign up"}
            </button>
          </form>
        </GlassCard>

        <p className={`${typography.helper} text-center mt-6`}>
          your data is private and secure
        </p>
      </div>
    </div>
  );
}
