"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from "lucide-react";

interface AppHeaderProps {
  userName: string;
  userEmoji: string;
  memberSince: string;
  score: number;
  currentDate: string;
  onPreviousDay?: () => void;
  onNextDay?: () => void;
  onToday?: () => void;
  canGoNext?: boolean;
}

export function AppHeader({
  userName,
  userEmoji,
  memberSince,
  score,
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  canGoNext = true,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17] border-b border-white/8">
      <div className="px-4 pt-4 pb-3">
        {/* Top row: Logo and User Info */}
        <div className="flex items-start justify-between mb-4">
          {/* Left: Leaderboard icon + Logo */}
          <div className="flex items-start gap-3">
            <Link
              href="/leaderboard"
              className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
              aria-label="Leaderboard"
            >
              <TrendingUp size={20} strokeWidth={2} />
            </Link>
            <div>
              <h1 className="text-white text-base font-medium leading-tight">
                Prabhashwara
              </h1>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7BE3" }}>
                Yoga Tracker
              </p>
            </div>
          </div>

          {/* Right: User info + Progress icon */}
          <div className="flex items-start gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <span className="text-lg">{userEmoji}</span>
                <span className="text-sm font-medium text-white/90">{userName}</span>
              </div>
              <p className="text-[10px] text-white/40">Member since: {memberSince}</p>
            </div>
            <div className="tnum font-[family-name:var(--font-display)] text-[32px] font-bold leading-none" style={{ color: "#8B7BE3" }}>
              {score}
            </div>
            <Link
              href="/progress"
              className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
              aria-label="Progress"
            >
              <BarChart3 size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousDay}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <div className="flex-1 grid grid-cols-3 gap-1.5 bg-white/[0.03] rounded-xl p-1">
            <button
              onClick={onToday}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors"
              style={{
                background: currentDate === "Today" ? "#8B7BE3" : "transparent",
                color: currentDate === "Today" ? "#0B0F17" : "rgba(255,255,255,0.6)",
              }}
            >
              Today
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors"
              style={{
                background: currentDate === "Yesterday" ? "#8B7BE3" : "transparent",
                color: currentDate === "Yesterday" ? "#0B0F17" : "rgba(255,255,255,0.6)",
              }}
            >
              Yesterday
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-white/40"
              disabled
            >
              2 days ago
            </button>
          </div>

          <button
            onClick={onNextDay}
            disabled={!canGoNext}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
