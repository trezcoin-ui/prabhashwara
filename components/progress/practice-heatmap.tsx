"use client";

import { useState, useEffect } from "react";
import { format, subDays, parseISO, getDay } from "date-fns";
import { GlassCard } from "@/components/ui/glass-card";
import { typography } from "@/lib/design-system";
import { calculateDailyScore } from "@/lib/scoring";
import { getCurrentPracticeDate } from "@/lib/dates";
import type { MeditationSession } from "@/lib/types";

const WEEKS = 8;
const DAYS_PER_WEEK = 7;
const TOTAL_DAYS = WEEKS * DAYS_PER_WEEK;

interface DayData {
  date: string;
  score: number;
  displayDate: string;
}

export function PracticeHeatmap() {
  const [heatmapData, setHeatmapData] = useState<DayData[]>([]);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = getCurrentPracticeDate();
    const data: DayData[] = [];

    // Generate data for the last TOTAL_DAYS days
    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      const date = format(subDays(parseISO(today), i), "yyyy-MM-dd");

      // Load practice data from localStorage
      const savedLog = localStorage.getItem(`practice_log_${date}`);
      const savedSessions = localStorage.getItem(`meditation_sessions_${date}`);

      let score = 0;
      if (savedLog && savedSessions) {
        try {
          const log = JSON.parse(savedLog);
          const sessions: MeditationSession[] = JSON.parse(savedSessions);
          score = calculateDailyScore(log, sessions);
        } catch (e) {
          // Failed to parse, score remains 0
        }
      }

      data.push({
        date,
        score,
        displayDate: format(parseISO(date), "MMM d"),
      });
    }

    setHeatmapData(data);
  }, []);

  // Get color intensity based on score
  const getColor = (score: number) => {
    if (score === 0) return "rgba(255, 255, 255, 0.05)";
    if (score < 40) return "rgba(139, 123, 227, 0.2)";
    if (score < 80) return "rgba(139, 123, 227, 0.4)";
    if (score < 120) return "rgba(139, 123, 227, 0.6)";
    return "rgba(139, 123, 227, 0.9)";
  };

  // Calculate grid starting position to align weeks properly
  const firstDayOfWeek = heatmapData.length > 0 ? getDay(parseISO(heatmapData[0].date)) : 0;
  const offset = (firstDayOfWeek + 6) % 7; // Convert Sunday=0 to Monday=0

  return (
    <GlassCard delay={0.1} className="p-2.5">
      <div className="mb-2">
        <p className={`${typography.bodyMedium} font-semibold uppercase`}>Practice Heatmap</p>
        <p className={typography.helper}>last 8 weeks of activity</p>
      </div>

      <div className="relative">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div
              key={i}
              className={`${typography.helper} text-center text-white/40`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`offset-${i}`} />
          ))}

          {/* Actual days */}
          {heatmapData.map((day) => (
            <div
              key={day.date}
              className="relative aspect-square rounded transition-all"
              style={{
                background: getColor(day.score),
                border: hoveredDay?.date === day.date
                  ? "1px solid #8B7BE3"
                  : "1px solid transparent",
              }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            />
          ))}
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 rounded-lg bg-[#8B7BE3] text-[#0B0F17] whitespace-nowrap z-10"
            style={{ pointerEvents: "none" }}
          >
            <p className={`${typography.bodyMedium} font-semibold`}>
              {hoveredDay.displayDate}
            </p>
            <p className={typography.helper} style={{ color: "#0B0F17", opacity: 0.7 }}>
              {hoveredDay.score} points
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/8">
        <span className={`${typography.helper} text-white/40`}>less</span>
        <div className="flex gap-1">
          {[0, 40, 80, 120, 160].map((score, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded"
              style={{ background: getColor(score === 160 ? 160 : score) }}
            />
          ))}
        </div>
        <span className={`${typography.helper} text-white/40`}>more</span>
      </div>
    </GlassCard>
  );
}
