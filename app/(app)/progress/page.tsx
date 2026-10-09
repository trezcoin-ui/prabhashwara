"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, TrendingUp } from "lucide-react";
import { typography } from "@/lib/design-system";
import { StatsCards } from "@/components/progress/stats-cards";
import { PracticeHeatmap } from "@/components/progress/practice-heatmap";

type Period = "week" | "month" | "year" | "all";

export default function ProgressPage() {
  const [period, setPeriod] = useState<Period>("week");

  const periods: { key: Period; label: string }[] = [
    { key: "week", label: "week" },
    { key: "month", label: "month" },
    { key: "year", label: "year" },
    { key: "all", label: "all time" },
  ];

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

        {/* Period Navigation */}
        <div className="px-3 pb-2.5">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {periods.map(({ key, label }) => {
              const isSelected = period === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 transition-colors ${typography.bodyMedium} uppercase`}
                  style={{
                    background: isSelected ? "rgba(139, 123, 227, 0.2)" : "rgba(255,255,255,0.04)",
                    color: isSelected ? "#8B7BE3" : "rgba(255,255,255,0.6)",
                    border: isSelected ? "1px solid #8B7BE3" : "1px solid transparent",
                  }}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="px-3 pt-3 pb-6 space-y-2">
        {/* Stats Cards */}
        <StatsCards period={period} />

        {/* Practice Heatmap */}
        <PracticeHeatmap />
      </div>
    </>
  );
}
