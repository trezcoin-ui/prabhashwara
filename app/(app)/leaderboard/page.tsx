"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, BarChart3, Trophy, Medal, Award } from "lucide-react";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, parseISO } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";
import { calculateDailyScore } from "@/lib/scoring";
import { getCurrentPracticeDate } from "@/lib/dates";
import { getAllPracticeLogsInRange, getAllMeditationSessionsInRange } from "@/lib/db";
import type { ClientMeditationSession, PracticeLog } from "@/lib/types";

type Period = "day" | "week" | "month" | "year";
type TimeFrame = "current" | "previous";

interface AggregatedEntry {
  username: string;
  emoji: string;
  totalScore: number;
  practiceDays: number;
  totalMeditationMinutes: number;
  pranayamaCount: number;
}

async function calculateAggregatedScores(period: Period, timeFrame: TimeFrame): Promise<AggregatedEntry[]> {
  const today = getCurrentPracticeDate();
  const parsedToday = parseISO(today);
  let startDate: Date;
  let endDate: Date;

  // Determine date range based on period and timeframe
  switch (period) {
    case "day":
      if (timeFrame === "current") {
        startDate = parsedToday;
        endDate = parsedToday;
      } else {
        startDate = subDays(parsedToday, 1);
        endDate = subDays(parsedToday, 1);
      }
      break;
    case "week":
      if (timeFrame === "current") {
        startDate = startOfWeek(parsedToday, { weekStartsOn: 1 });
        endDate = parsedToday;
      } else {
        const prevWeekEnd = subDays(startOfWeek(parsedToday, { weekStartsOn: 1 }), 1);
        startDate = startOfWeek(prevWeekEnd, { weekStartsOn: 1 });
        endDate = prevWeekEnd;
      }
      break;
    case "month":
      if (timeFrame === "current") {
        startDate = startOfMonth(parsedToday);
        endDate = parsedToday;
      } else {
        const prevMonthEnd = subDays(startOfMonth(parsedToday), 1);
        startDate = startOfMonth(prevMonthEnd);
        endDate = prevMonthEnd;
      }
      break;
    case "year":
      if (timeFrame === "current") {
        startDate = startOfYear(parsedToday);
        endDate = parsedToday;
      } else {
        const prevYearEnd = subDays(startOfYear(parsedToday), 1);
        startDate = startOfYear(prevYearEnd);
        endDate = prevYearEnd;
      }
      break;
  }

  try {
    // Fetch all practice logs and meditation sessions in the date range
    const [practiceLogs, meditationSessions] = await Promise.all([
      getAllPracticeLogsInRange(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd")),
      getAllMeditationSessionsInRange(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))
    ]);

    // Group by user
    const userMap = new Map<string, AggregatedEntry>();

    // Process practice logs
    for (const log of practiceLogs) {
      const user = log.users as any;
      if (!user) continue;

      const userKey = user.id;

      // Get meditation sessions for this user and date
      const sessionsForLog = meditationSessions
        .filter(s => s.user_id === user.id && s.practice_date === log.practice_date)
        .map(s => ({
          id: s.id,
          type: s.type as any,
          minutes: s.minutes
        }));

      // Calculate score for this day
      const practiceLog: PracticeLog = {
        priming: log.priming,
        surya_namaskaraya: log.surya_namaskaraya,
        kapalabhati: log.kapalabhati,
        bhastrika: log.bhastrika,
        nadi_shodhana: log.nadi_shodhana,
        bhramari: log.bhramari,
      };

      const dayScore = calculateDailyScore(practiceLog, sessionsForLog);

      // Check if any activity was done
      const hasPractice = log.priming || log.surya_namaskaraya ||
        log.kapalabhati || log.bhastrika ||
        log.nadi_shodhana || log.bhramari ||
        sessionsForLog.length > 0;

      if (hasPractice) {
        const existing = userMap.get(userKey) || {
          username: user.username,
          emoji: user.emoji,
          totalScore: 0,
          practiceDays: 0,
          totalMeditationMinutes: 0,
          pranayamaCount: 0,
        };

        existing.totalScore += dayScore;
        existing.practiceDays += 1;
        existing.totalMeditationMinutes += sessionsForLog.reduce((sum, s) => sum + s.minutes, 0);

        const pranayamaTechniques = [
          log.kapalabhati,
          log.bhastrika,
          log.nadi_shodhana,
          log.bhramari,
        ].filter(Boolean).length;
        existing.pranayamaCount += pranayamaTechniques;

        userMap.set(userKey, existing);
      }
    }

    // Convert to array and sort by total score
    return Array.from(userMap.values()).sort((a, b) => b.totalScore - a.totalScore);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("day");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("current");
  const [leaderboard, setLeaderboard] = useState<AggregatedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await calculateAggregatedScores(period, timeFrame);
      setLeaderboard(data);
      setLoading(false);
    }
    loadData();
  }, [period, timeFrame]);

  const periods: { key: Period; label: string }[] = [
    { key: "day", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  const timeFrames: { key: TimeFrame; label: string }[] = [
    { key: "current", label: "Current" },
    { key: "previous", label: "Previous" },
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
                <h1 className={`${typography.h2} uppercase`}>
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
        <div className="px-3 pb-2.5 space-y-2">
          {/* Period Selection */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {periods.map(({ key, label }) => {
              const isSelected = period === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
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

          {/* Timeframe Selection */}
          <div className="flex gap-1">
            {timeFrames.map(({ key, label }) => {
              const isSelected = timeFrame === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeFrame(key)}
                  className={`flex-1 rounded-lg px-2.5 py-1.5 transition-colors ${typography.bodyMedium}`}
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
        {loading ? (
          <GlassCard delay={0} className="p-6">
            <div className="text-center">
              <p className={typography.helper}>Loading...</p>
            </div>
          </GlassCard>
        ) : leaderboard.length > 0 ? (
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

                    {/* User info — score shares the username's baseline */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="self-center text-[18px] leading-none">{entry.emoji}</span>
                        <span className={`${typography.bodyMedium} min-w-0 flex-1 truncate`}>
                          {entry.username}
                        </span>
                        <span className={`shrink-0 ${typography.numberMedium}`} style={{
                          color: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#8B7BE3",
                        }}>
                          {entry.totalScore}
                          <span className={`ml-1 ${typography.helper}`}>pts</span>
                        </span>
                      </div>
                      <p className={`tnum mt-0.5 ${typography.helper}`}>
                        {entry.practiceDays} {entry.practiceDays === 1 ? "day" : "days"} · {entry.totalMeditationMinutes} min
                      </p>
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
