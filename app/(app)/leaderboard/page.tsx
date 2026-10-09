"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, BarChart3, Trophy, Medal, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";
import type { LeaderboardEntry } from "@/lib/types";

// Mock data for development
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    user_id: "1",
    username: "nimal",
    emoji: "🪷",
    score: 160,
    priming: true,
    surya_namaskaraya: true,
    pranayama_techniques: ["kapalabhati", "bhastrika", "nadi_shodhana", "bhramari"],
    meditation_sessions: [{ type: "anapanasati", minutes: 60 }],
    earliest_completion: "2026-10-09T06:30:00Z",
  },
  {
    user_id: "2",
    username: "saman",
    emoji: "🌸",
    score: 140,
    priming: true,
    surya_namaskaraya: true,
    pranayama_techniques: ["kapalabhati", "bhastrika", "nadi_shodhana"],
    meditation_sessions: [{ type: "metta", minutes: 60 }],
    earliest_completion: "2026-10-09T07:00:00Z",
  },
  {
    user_id: "3",
    username: "kumari",
    emoji: "🦋",
    score: 120,
    priming: true,
    surya_namaskaraya: true,
    pranayama_techniques: ["kapalabhati", "bhastrika"],
    meditation_sessions: [{ type: "anapanasati", minutes: 60 }],
    earliest_completion: "2026-10-09T07:30:00Z",
  },
  {
    user_id: "4",
    username: "silva",
    emoji: "🌙",
    score: 100,
    priming: false,
    surya_namaskaraya: true,
    pranayama_techniques: ["kapalabhati", "bhastrika", "nadi_shodhana", "bhramari"],
    meditation_sessions: [{ type: "metta", minutes: 40 }],
    earliest_completion: "2026-10-09T08:00:00Z",
  },
  {
    user_id: "5",
    username: "perera",
    emoji: "☀️",
    score: 80,
    priming: true,
    surya_namaskaraya: true,
    pranayama_techniques: ["kapalabhati"],
    meditation_sessions: [{ type: "anapanasati", minutes: 30 }],
    earliest_completion: "2026-10-09T09:00:00Z",
  },
];

function getDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "yesterday";
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

function getLast7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
}

export default function LeaderboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setDates(getLast7Days());
  }, []);

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
                  leaderboard
                </h1>
                <p className={typography.label} style={{ color: "#8B7BE3" }}>
                  community rankings
                </p>
              </div>
            </div>

            {/* Right: Progress icon */}
            <Link
              href="/progress"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/60 hover:bg-white/5 transition-colors mt-0.5"
              aria-label="Progress"
            >
              <BarChart3 size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="px-3 pb-2.5">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {selectedDate && dates.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const label = getDateLabel(date);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 rounded-lg px-2.5 py-1.5 transition-colors ${typography.bodyMedium}`}
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

      <div className="px-3 pt-3 pb-6">
        {/* Leaderboard entries */}
        {MOCK_LEADERBOARD.length > 0 ? (
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((entry, index) => {
              const rank = index + 1;
              const meditationMinutes = entry.meditation_sessions.reduce(
                (sum, s) => sum + s.minutes,
                0
              );

              return (
                <GlassCard
                  key={entry.user_id}
                  delay={index * 0.02}
                  accent={rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : undefined}
                  className="p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{
                      background: rank === 1 ? "rgba(255, 215, 0, 0.15)" : rank === 2 ? "rgba(192, 192, 192, 0.15)" : rank === 3 ? "rgba(205, 127, 50, 0.15)" : "rgba(255,255,255,0.04)",
                      color: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "rgba(255,255,255,0.4)",
                    }}>
                      {rank === 1 ? (
                        <Trophy size={18} strokeWidth={2.5} />
                      ) : rank === 2 ? (
                        <Medal size={18} strokeWidth={2.5} />
                      ) : rank === 3 ? (
                        <Award size={18} strokeWidth={2.5} />
                      ) : (
                        <span className={typography.numberSmall}>{rank}</span>
                      )}
                    </div>

                    {/* User info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[18px]">{entry.emoji}</span>
                        <span className={`${typography.bodyMedium} truncate`}>
                          {entry.username}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {entry.priming && (
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#8B7BE3" }} />
                        )}
                        {entry.surya_namaskaraya && (
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#F59E0B" }} />
                        )}
                        {entry.pranayama_techniques.length > 0 && (
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#60A5FA" }} />
                        )}
                        {entry.meditation_sessions.length > 0 && (
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#EC4899" }} />
                        )}
                        <span className={typography.helper}>
                          {entry.pranayama_techniques.length}/4 pranayama · {meditationMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`shrink-0 text-right ${typography.numberMedium}`} style={{
                      color: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#8B7BE3",
                    }}>
                      {entry.score}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard delay={0} className="p-6">
            <div className="text-center space-y-1.5">
              <p className={`${typography.h3} uppercase`}>
                no data yet
              </p>
              <p className={typography.helper}>
                complete your practice to appear on the leaderboard
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </>
  );
}
