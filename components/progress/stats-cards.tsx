"use client";

import { useState, useEffect } from "react";
import { format, subDays, parseISO } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";
import { calculateDailyScore } from "@/lib/scoring";
import { getCurrentPracticeDate } from "@/lib/dates";
import type { MeditationSession } from "@/lib/types";
import { Flame, Trophy, Calendar, Clock } from "lucide-react";

interface Stats {
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeDays: number;
  totalMeditationMinutes: number;
  averageScore: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPracticeDays: 0,
    totalMeditationMinutes: 0,
    averageScore: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = getCurrentPracticeDate();
    let totalScore = 0;
    let totalMeditationMinutes = 0;
    let totalPracticeDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakActive = true;

    // Look back up to 365 days for comprehensive stats
    const LOOKBACK_DAYS = 365;

    for (let i = 0; i < LOOKBACK_DAYS; i++) {
      const date = format(subDays(parseISO(today), i), "yyyy-MM-dd");

      const savedLog = localStorage.getItem(`practice_log_${date}`);
      const savedSessions = localStorage.getItem(`meditation_sessions_${date}`);

      let dayScore = 0;
      let hasPractice = false;

      if (savedLog && savedSessions) {
        try {
          const log = JSON.parse(savedLog);
          const sessions: MeditationSession[] = JSON.parse(savedSessions);
          dayScore = calculateDailyScore(log, sessions);

          // Count as practice day if any activity was done
          hasPractice = log.priming || log.surya_namaskaraya ||
            log.kapalabhati || log.bhastrika ||
            log.nadi_shodhana || log.bhramari ||
            sessions.length > 0;

          // Add meditation minutes
          totalMeditationMinutes += sessions.reduce((sum, s) => sum + s.minutes, 0);
        } catch (e) {
          // Failed to parse
        }
      }

      totalScore += dayScore;

      if (hasPractice) {
        totalPracticeDays++;

        // Update current streak (only if consecutive from today)
        if (currentStreakActive) {
          currentStreak++;
        }

        // Track longest streak
        let tempStreak = 1;
        for (let j = i + 1; j < LOOKBACK_DAYS; j++) {
          const checkDate = format(subDays(parseISO(today), j), "yyyy-MM-dd");
          const checkLog = localStorage.getItem(`practice_log_${checkDate}`);
          const checkSessions = localStorage.getItem(`meditation_sessions_${checkDate}`);

          let hasCheckPractice = false;
          if (checkLog && checkSessions) {
            try {
              const log = JSON.parse(checkLog);
              const sessions: MeditationSession[] = JSON.parse(checkSessions);
              hasCheckPractice = log.priming || log.surya_namaskaraya ||
                log.kapalabhati || log.bhastrika ||
                log.nadi_shodhana || log.bhramari ||
                sessions.length > 0;
            } catch (e) {
              // Failed to parse
            }
          }

          if (hasCheckPractice) {
            tempStreak++;
          } else {
            break;
          }
        }

        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        // Streak broken
        currentStreakActive = false;
      }
    }

    const averageScore = totalPracticeDays > 0
      ? Math.round(totalScore / totalPracticeDays)
      : 0;

    setStats({
      totalScore,
      currentStreak,
      longestStreak,
      totalPracticeDays,
      totalMeditationMinutes,
      averageScore,
    });
  }, []);

  const statCards = [
    {
      icon: Trophy,
      label: "Total Score",
      value: stats.totalScore,
      color: "#F59E0B",
      delay: 0,
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? "day" : "days"}`,
      color: "#EF4444",
      delay: 0.05,
    },
    {
      icon: Calendar,
      label: "Practice Days",
      value: stats.totalPracticeDays,
      color: "#8B7BE3",
      delay: 0.1,
    },
    {
      icon: Clock,
      label: "Meditation Time",
      value: `${stats.totalMeditationMinutes} min`,
      color: "#60A5FA",
      delay: 0.15,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {statCards.map((stat) => (
        <GlassCard key={stat.label} delay={stat.delay} className="p-2.5">
          <div className="flex items-start gap-2">
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{ background: `${stat.color}26` }}
            >
              <stat.icon size={16} strokeWidth={2.5} style={{ color: stat.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${typography.numberMedium} truncate`} style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className={`${typography.helper} text-white/50 uppercase`}>
                {stat.label}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
