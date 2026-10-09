"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from "lucide-react";
import { typography } from "@/lib/design-system";

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
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between">
          {/* Left: Leaderboard icon + Logo */}
          <div className="flex items-start gap-2">
            <Link
              href="/leaderboard"
              className="grid h-10 w-10 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors"
              aria-label="Leaderboard"
            >
              <TrendingUp size={20} strokeWidth={2} />
            </Link>
            <img
              src="/yoga-logo.svg"
              alt="Prabhashwara Yoga Tracker"
              className="h-10 w-10"
            />
          </div>

          {/* Right: User info + Progress icon */}
          <div className="flex items-start gap-2">
            <Link href="/profile" className="text-right hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-1.5 justify-end">
                <span className={typography.h3}>{userEmoji}</span>
                <span className={`${typography.bodyMedium} text-white/90`}>{userName}</span>
              </div>
            </Link>
            <div className={typography.numberMedium} style={{ color: "#8B7BE3" }}>
              {score}
            </div>
            <Link
              href="/progress"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors"
              aria-label="Progress"
            >
              <BarChart3 size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
