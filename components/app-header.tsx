"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, User } from "lucide-react";
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
        <div className="flex items-center justify-between">
          {/* Left: Leaderboard icon + Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/leaderboard"
              className="grid h-10 w-10 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors"
              aria-label="Leaderboard"
            >
              <Trophy size={20} strokeWidth={2} />
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/yoga-logo.svg"
                alt="Prabhashwara Yoga Tracker"
                className="h-12 w-12"
              />
              <p className={`${typography.h3} uppercase tracking-[0.04em]`} style={{ color: "#8B7BE3" }}>
                yoga tracker
              </p>
            </div>
          </div>

          {/* Right: User info + Progress icon — name and score share a baseline */}
          <div className="flex items-center gap-1 self-center">
            <Link
              href="/profile"
              className="flex items-baseline gap-1.5 rounded-lg px-1.5 py-1 hover:bg-white/5 transition-colors"
            >
              <span className="self-center text-[18px] leading-none">{userEmoji}</span>
              <span className={`${typography.bodyMedium} max-w-[96px] truncate text-white/90`}>{userName}</span>
              <span className={typography.numberMedium} style={{ color: "#8B7BE3" }}>
                {score}
                <span className={`ml-1 ${typography.helper}`}>pts</span>
              </span>
            </Link>
            <Link
              href="/progress"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors"
              aria-label="Progress"
            >
              <User size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
