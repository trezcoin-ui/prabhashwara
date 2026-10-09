"use client";

import Link from "next/link";
import { Home, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function LeaderboardPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F17] border-b border-white/8">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between">
            {/* Left: Home icon + Title */}
            <div className="flex items-start gap-3">
              <Link
                href="/today"
                className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
                aria-label="Home"
              >
                <Home size={20} strokeWidth={2} />
              </Link>
              <div>
                <h1 className="text-white text-base font-medium leading-tight">
                  Leaderboard
                </h1>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7BE3" }}>
                  Community Rankings
                </p>
              </div>
            </div>

            {/* Right: Progress icon */}
            <Link
              href="/progress"
              className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
              aria-label="Progress"
            >
              <BarChart3 size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 pb-6">
        {/* Placeholder */}
        <GlassCard delay={0} className="p-6">
          <div className="text-center space-y-2">
            <p className="text-[15px] font-[family-name:var(--font-display)] text-white/80">
              Daily Rankings
            </p>
            <p className="text-[10.5px] text-white/45">
              See how you compare with other practitioners
            </p>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
