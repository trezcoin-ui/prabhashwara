"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function ProfilePage() {
  return (
    <div className="px-4 pb-6 pt-safe">
      <style jsx>{`
        .pt-safe {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
      `}</style>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold text-white/90 leading-tight">
          Profile
        </h1>
        <p className="text-[11px] text-white/45 mt-1">Your account settings</p>
      </div>

      {/* Placeholder */}
      <GlassCard delay={0} className="p-6">
        <div className="text-center space-y-2">
          <div className="text-[48px] mb-2">🪷</div>
          <p className="text-[15px] font-[family-name:var(--font-display)] text-white/80">
            Nimal
          </p>
          <p className="text-[10.5px] text-white/45">
            Emoji, username, and PIN settings
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
