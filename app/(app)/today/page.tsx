"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { PrimingCard } from "@/components/activities/priming-card";
import { SuryaCard } from "@/components/activities/surya-card";
import { PranayamaCard } from "@/components/activities/pranayama-card";
import { MeditationCard } from "@/components/activities/meditation-card";
import { formatPracticeDate, getCurrentPracticeDate } from "@/lib/dates";
import { calculateDailyScore } from "@/lib/scoring";
import type { PranayamaTechnique, MeditationType, MeditationSession } from "@/lib/types";

// Mock data for demonstration (will be replaced with real data from Supabase)
const mockUser = {
  emoji: "🪷",
  username: "Nimal",
};

export default function TodayPage() {
  const [practiceDate, setPracticeDate] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock state (will be replaced with server data)
  const [log, setLog] = useState({
    priming: false,
    surya_namaskaraya: false,
    kapalabhati: false,
    bhastrika: false,
    nadi_shodhana: false,
    bhramari: false,
  });

  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  // Set practice date and load saved data on mount
  useEffect(() => {
    const date = getCurrentPracticeDate();
    setPracticeDate(date);

    // Load saved data from localStorage
    if (typeof window !== "undefined") {
      const savedLog = localStorage.getItem(`practice_log_${date}`);
      const savedSessions = localStorage.getItem(`meditation_sessions_${date}`);

      if (savedLog) {
        try {
          setLog(JSON.parse(savedLog));
        } catch (e) {
          console.error("Failed to parse saved log:", e);
        }
      }

      if (savedSessions) {
        try {
          setMeditationSessions(JSON.parse(savedSessions));
        } catch (e) {
          console.error("Failed to parse saved sessions:", e);
        }
      }
    }

    setIsLoaded(true);
  }, []);

  // Auto-save log to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && practiceDate && typeof window !== "undefined") {
      localStorage.setItem(`practice_log_${practiceDate}`, JSON.stringify(log));
    }
  }, [log, practiceDate, isLoaded]);

  // Auto-save meditation sessions to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && practiceDate && typeof window !== "undefined") {
      localStorage.setItem(`meditation_sessions_${practiceDate}`, JSON.stringify(meditationSessions));
    }
  }, [meditationSessions, practiceDate, isLoaded]);

  // Calculate current score
  const score = calculateDailyScore(log, meditationSessions);

  // Calculate progress (percentage of activities completed)
  const totalActivities = 4; // Priming, Surya, at least one Pranayama, at least one Meditation
  let completedActivities = 0;
  if (log.priming) completedActivities++;
  if (log.surya_namaskaraya) completedActivities++;
  if (log.kapalabhati || log.bhastrika || log.nadi_shodhana || log.bhramari) completedActivities++;
  if (meditationSessions.length > 0) completedActivities++;
  const progressPercentage = (completedActivities / totalActivities) * 100;

  // Mock handlers (will be replaced with server actions)
  const handlePrimingToggle = async (completed: boolean) => {
    setLog((prev) => ({ ...prev, priming: completed }));
  };

  const handleSuryaToggle = async (completed: boolean) => {
    setLog((prev) => ({ ...prev, surya_namaskaraya: completed }));
  };

  const handlePranayamaToggle = async (technique: PranayamaTechnique, completed: boolean) => {
    setLog((prev) => ({ ...prev, [technique]: completed }));
  };

  const handleAddMeditation = async (type: MeditationType, minutes: number) => {
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      user_id: "mock",
      practice_date: practiceDate,
      type,
      minutes,
      created_at: new Date().toISOString(),
    };
    setMeditationSessions((prev) => [...prev, newSession]);
  };

  const handleRemoveMeditation = async (sessionId: string) => {
    setMeditationSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Don't render until data is loaded
  if (!isLoaded || !practiceDate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/45">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AppHeader
        userName={mockUser.username}
        userEmoji={mockUser.emoji}
        memberSince="Oct 2024"
        score={score}
        currentDate="Today"
      />

      <div className="px-4 pt-4 pb-6">
        {/* Activity cards - matching Let's Get Fit spacing */}
        <div className="space-y-3">
          <PrimingCard
            initialCompleted={log.priming}
            onToggle={handlePrimingToggle}
            editable={true}
          />

          <SuryaCard
            initialCompleted={log.surya_namaskaraya}
            onToggle={handleSuryaToggle}
            editable={true}
          />

          <PranayamaCard
            initialTechniques={{
              kapalabhati: log.kapalabhati,
              bhastrika: log.bhastrika,
              nadi_shodhana: log.nadi_shodhana,
              bhramari: log.bhramari,
            }}
            onToggle={handlePranayamaToggle}
            editable={true}
          />

          <MeditationCard
            initialSessions={meditationSessions}
            onAddSession={handleAddMeditation}
            onRemoveSession={handleRemoveMeditation}
            editable={true}
          />
        </div>
      </div>
    </>
  );
}
