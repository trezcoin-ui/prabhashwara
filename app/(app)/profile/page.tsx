"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, LogOut, Edit2, Check, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";

const EMOJIS = ["🪷", "🧘", "☮️", "🕉️", "🌸", "🌺", "🦋", "🌙", "⭐", "✨", "🌿", "🍃"];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; emoji: string } | null>(null);
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  const [newEmoji, setNewEmoji] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("prabhashwara_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setNewEmoji(parsed.emoji);
      setNewUsername(parsed.username);
    }
  }, []);

  const handleSaveEmoji = () => {
    if (user && newEmoji) {
      const updated = { ...user, emoji: newEmoji };
      localStorage.setItem("prabhashwara_user", JSON.stringify(updated));
      setUser(updated);
      setIsEditingEmoji(false);
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleSaveUsername = () => {
    if (user && newUsername.trim()) {
      const updated = { ...user, username: newUsername.toLowerCase().replace(/\s/g, "") };
      localStorage.setItem("prabhashwara_user", JSON.stringify(updated));
      setUser(updated);
      setNewUsername(updated.username);
      setIsEditingUsername(false);
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleChangePin = () => {
    setError("");

    // Validate current PIN
    const storedPin = localStorage.getItem("prabhashwara_pin");
    if (currentPin !== storedPin) {
      setError("current pin is incorrect");
      return;
    }

    // Validate new PIN
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      setError("new pin must be exactly 6 digits");
      return;
    }

    if (newPin !== confirmPin) {
      setError("new pins do not match");
      return;
    }

    // Save new PIN
    localStorage.setItem("prabhashwara_pin", newPin);
    setIsChangingPin(false);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");

    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("prabhashwara_user");
    localStorage.removeItem("prabhashwara_pin");
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className={typography.helper}>loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F17] border-b border-white/8">
        <div className="px-3 pt-3 pb-2.5">
          <div className="flex items-start justify-between">
            {/* Left: Home icon + Title */}
            <div className="flex items-start gap-2.5">
              <Link
                href="/today"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
                aria-label="Home"
              >
                <Home size={18} strokeWidth={2} />
              </Link>
              <div>
                <h1 className={`${typography.h3} uppercase`}>
                  profile
                </h1>
                <p className={typography.label} style={{ color: "#8B7BE3" }}>
                  account settings
                </p>
              </div>
            </div>

            {/* Right: Sign out button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/60 hover:bg-white/5 hover:text-red-400 transition-colors mt-0.5"
              aria-label="Sign out"
            >
              <LogOut size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-3 pt-3 pb-6 space-y-2">
        {/* Profile Display */}
        <GlassCard delay={0} accent="#8B7BE3" className="p-2.5">
          <div className="flex items-center gap-3">
            <div className="text-[48px] leading-none">{user.emoji}</div>
            <div className="flex-1">
              <p className={`${typography.h2} uppercase`}>{user.username}</p>
              <p className={typography.helper}>your practice identity</p>
            </div>
          </div>
        </GlassCard>

        {/* Emoji Editor */}
        <GlassCard delay={0.05} className="p-2.5">
          <div className="flex items-center justify-between mb-2">
            <p className={`${typography.bodyMedium} font-semibold`}>Emoji</p>
            {!isEditingEmoji ? (
              <button
                type="button"
                onClick={() => setIsEditingEmoji(true)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
              >
                <Edit2 size={14} />
                <span className={typography.button}>edit</span>
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleSaveEmoji}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-[#8B7BE3] text-[#0B0F17] transition-transform active:scale-90"
                >
                  <Check size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewEmoji(user.emoji);
                    setIsEditingEmoji(false);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/60 transition-transform active:scale-90"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
          {isEditingEmoji && (
            <div className="grid grid-cols-6 gap-1.5">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewEmoji(emoji)}
                  className="text-2xl p-2 rounded-lg transition-all"
                  style={{
                    background: newEmoji === emoji ? "rgba(139, 123, 227, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    border: newEmoji === emoji ? "2px solid #8B7BE3" : "2px solid transparent",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Username Editor */}
        <GlassCard delay={0.1} className="p-2.5">
          <div className="flex items-center justify-between mb-2">
            <p className={`${typography.bodyMedium} font-semibold`}>Username</p>
            {!isEditingUsername ? (
              <button
                type="button"
                onClick={() => setIsEditingUsername(true)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
              >
                <Edit2 size={14} />
                <span className={typography.button}>edit</span>
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleSaveUsername}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-[#8B7BE3] text-[#0B0F17] transition-transform active:scale-90"
                >
                  <Check size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewUsername(user.username);
                    setIsEditingUsername(false);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/60 transition-transform active:scale-90"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
          {isEditingUsername && (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              placeholder="nimal"
              maxLength={20}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[13px]"
            />
          )}
        </GlassCard>

        {/* PIN Change */}
        <GlassCard delay={0.15} className="p-2.5">
          <div className="flex items-center justify-between mb-2">
            <p className={`${typography.bodyMedium} font-semibold`}>PIN</p>
            {!isChangingPin ? (
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(true);
                  setError("");
                }}
                className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
              >
                <Edit2 size={14} />
                <span className={typography.button}>change</span>
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleChangePin}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-[#8B7BE3] text-[#0B0F17] transition-transform active:scale-90"
                >
                  <Check size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setCurrentPin("");
                    setNewPin("");
                    setConfirmPin("");
                    setError("");
                  }}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white/60 transition-transform active:scale-90"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
          {isChangingPin && (
            <div className="space-y-2">
              <input
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="current pin"
                maxLength={6}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[13px] tracking-widest"
              />
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="new pin"
                maxLength={6}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[13px] tracking-widest"
              />
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="confirm new pin"
                maxLength={6}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/12 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#8B7BE3] transition-colors text-[13px] tracking-widest"
              />
              {error && (
                <p className="text-[11px] text-red-400">{error}</p>
              )}
            </div>
          )}
          {!isChangingPin && (
            <p className={typography.helper}>6-digit security pin</p>
          )}
        </GlassCard>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className={`w-full rounded-xl border border-red-400/30 px-3 py-2.5 text-red-400 hover:bg-red-400/10 transition-colors ${typography.button}`}
        >
          sign out
        </button>
      </div>
    </>
  );
}
