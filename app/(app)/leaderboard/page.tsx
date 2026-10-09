"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, BarChart3, Trophy, Medal, Award } from "lucide-react";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, parseISO } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";
import { calculateDailyScore } from "@/lib/scoring";
import { getCurrentPracticeDate } from "@/lib/dates";
import type { MeditationSession } from "@/lib/types";

type Period = "today" | "yesterday" | "week" | "month" | "year";

interface AggregatedEntry {
  username: string;
  emoji: string;
  totalScore: number;
  practiceDays: number;
  totalMeditationMinutes: number;
  pranayamaCount: number;
}

function calculateAggregatedScores(period: Period): AggregatedEntry[] {
  if (typeof window === "undefined") return [];

  const today = getCurrentPracticeDate();
  const parsedToday = parseISO(today);
  let startDate: Date;
  let endDate = parsedToday;

  // Determine date range based on period
  switch (period) {
    case "today":
      startDate = parsedToday;
      break;
    case "yesterday":
      startDate = subDays(parsedToday, 1);
      endDate = subDays(parsedToday, 1);
      break;
    case "week":
      startDate = startOfWeek(parsedToday, { weekStartsOn: 1 }); // Monday
      break;
    case "month":
      startDate = startOfMonth(parsedToday);
      break;
    case "year":
      startDate = startOfYear(parsedToday);
      break;
  }

  // Get all user data
  const userMap = new Map<string, AggregatedEntry>();

  // Iterate through all possible days in the range
  const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < dayCount; i++) {
    const checkDate = format(subDays(endDate, dayCount - 1 - i), "yyyy-MM-dd");

    // Get all stored practice logs for this date
    const keys = Object.keys(localStorage);
    const logKeys = keys.filter(key => key.startsWith(`practice_log_${checkDate}`));
    const sessionKeys = keys.filter(key => key.startsWith(`meditation_sessions_${checkDate}`));

    // For this simple localStorage implementation, we only have one user
    const userDataStr = localStorage.getItem("prabhashwara_user");
    if (!userDataStr) continue;

    const userData = JSON.parse(userDataStr);
    const logKey = `practice_log_${checkDate}`;
    const sessionKey = `meditation_sessions_${checkDate}`;

    const savedLog = localStorage.getItem(logKey);
    const savedSessions = localStorage.getItem(sessionKey);

    if (savedLog && savedSessions) {
      try {
        const log = JSON.parse(savedLog);
        const sessions: MeditationSession[] = JSON.parse(savedSessions);
        const dayScore = calculateDailyScore(log, sessions);

        // Check if any activity was done
        const hasPractice = log.priming || log.surya_namaskaraya ||
          log.kapalabhati || log.bhastrika ||
          log.nadi_shodhana || log.bhramari ||
          sessions.length > 0;

        if (hasPractice) {
          const existing = userMap.get(userData.username) || {
            username: userData.username,
            emoji: userData.emoji,
            totalScore: 0,
            practiceDays: 0,
            totalMeditationMinutes: 0,
            pranayamaCount: 0,
          };

          existing.totalScore += dayScore;
          existing.practiceDays += 1;
          existing.totalMeditationMinutes += sessions.reduce((sum, s) => sum + s.minutes, 0);

          const pranayamaTechniques = [
            log.kapalabhati,
            log.bhastrika,
            log.nadi_shodhana,
            log.bhramari,
          ].filter(Boolean).length;
          existing.pranayamaCount += pranayamaTechniques;

          userMap.set(userData.username, existing);
        }
      } catch (e) {
        // Failed to parse
      }
    }
  }

  // Convert to array and sort by total score
  return Array.from(userMap.values()).sort((a, b) => b.totalScore - a.totalScore);
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("today");
  const [leaderboard, setLeaderboard] = useState<AggregatedEntry[]>([]);

  useEffect(() => {
    setLeaderboard(calculateAggregatedScores(period));
  }, [period]);

  const periods: { key: Period; label: string }[] = [
    { key: "today", label: "today" },
    { key: "yesterday", label: "yesterday" },
    { key: "week", label: "week" },
    { key: "month", label: "month" },
    { key: "year", label: "year" },
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

      <div className="px-3 pt-3 pb-6">
        {/* Leaderboard entries */}
        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;

              return (
                <GlassCard
                  key={entry.username}
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
                        <span className={typography.helper}>
                          {entry.practiceDays} {entry.practiceDays === 1 ? "day" : "days"} · {entry.totalMeditationMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`shrink-0 text-right ${typography.numberMedium}`} style={{
                      color: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#8B7BE3",
                    }}>
                      {entry.totalScore}
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
