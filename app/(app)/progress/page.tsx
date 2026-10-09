"use client";

import Link from "next/link";
import { Home, TrendingUp } from "lucide-react";
import { typography } from "@/lib/design-system";
import { StatsCards } from "@/components/progress/stats-cards";
import { PracticeHeatmap } from "@/components/progress/practice-heatmap";

export default function ProgressPage() {
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
                  Progress
                </h1>
                <p className={typography.label} style={{ color: "#8B7BE3" }}>
                  your practice journey
                </p>
              </div>
            </div>

            {/* Right: Leaderboard icon */}
            <Link
              href="/leaderboard"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
              aria-label="Leaderboard"
            >
              <TrendingUp size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-3 pt-3 pb-6 space-y-2">
        {/* Stats Cards */}
        <StatsCards />

        {/* Practice Heatmap */}
        <PracticeHeatmap />
      </div>
    </>
  );
}
