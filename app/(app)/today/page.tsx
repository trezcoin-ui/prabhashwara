"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { PrimingCard } from "@/components/activities/priming-card";
import { SuryaCard } from "@/components/activities/surya-card";
import { PranayamaCard } from "@/components/activities/pranayama-card";
import { MeditationCard } from "@/components/activities/meditation-card";
import { formatPracticeDate, getCurrentPracticeDate } from "@/lib/dates";
import { calculateDailyScore } from "@/lib/scoring";
import { useUser } from "@/lib/user-context";
import { typography } from "@/lib/design-system";
import {
  getPracticeLog,
  getMeditationSessions,
  toggleActivity,
  togglePranayama,
  addMeditationSession,
  removeMeditationSession,
} from "@/lib/db";
import type { PranayamaTechnique, MeditationType, ClientMeditationSession } from "@/lib/types";

export default function TodayPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [practiceDate, setPracticeDate] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [log, setLog] = useState({
    priming: false,
    surya_namaskaraya: false,
    kapalabhati: false,
    bhastrika: false,
    nadi_shodhana: false,
    bhramari: false,
  });

  const [meditationSessions, setMeditationSessions] = useState<ClientMeditationSession[]>([]);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      if (userLoading) return;

      if (!user) {
        router.push("/auth");
        return;
      }

      const date = getCurrentPracticeDate();
      setPracticeDate(date);

      try {
        // Load practice log from Supabase
        const practiceLog = await getPracticeLog(user.id, date);
        if (practiceLog) {
          setLog({
            priming: practiceLog.priming,
            surya_namaskaraya: practiceLog.surya_namaskaraya,
            kapalabhati: practiceLog.kapalabhati,
            bhastrika: practiceLog.bhastrika,
            nadi_shodhana: practiceLog.nadi_shodhana,
            bhramari: practiceLog.bhramari,
          });
        }

        // Load meditation sessions from Supabase
        const sessions = await getMeditationSessions(user.id, date);
        setMeditationSessions(sessions);
      } catch (error) {
        console.error("Error loading practice data:", error);
      }

      setIsLoaded(true);
    }

    loadData();
  }, [user, userLoading, router]);

  // Calculate current score
  const score = calculateDailyScore(log, meditationSessions);

  // Handlers that save to Supabase
  const handlePrimingToggle = async (completed: boolean) => {
    if (!user) return;

    setLog((prev) => ({ ...prev, priming: completed }));

    try {
      await toggleActivity(user.id, practiceDate, "priming", completed);
    } catch (error) {
      console.error("Error toggling priming:", error);
      // Rollback on error
      setLog((prev) => ({ ...prev, priming: !completed }));
    }
  };

  const handleSuryaToggle = async (completed: boolean) => {
    if (!user) return;

    setLog((prev) => ({ ...prev, surya_namaskaraya: completed }));

    try {
      await toggleActivity(user.id, practiceDate, "surya_namaskaraya", completed);
    } catch (error) {
      console.error("Error toggling surya namaskaraya:", error);
      // Rollback on error
      setLog((prev) => ({ ...prev, surya_namaskaraya: !completed }));
    }
  };

  const handlePranayamaToggle = async (technique: PranayamaTechnique, completed: boolean) => {
    if (!user) return;

    setLog((prev) => ({ ...prev, [technique]: completed }));

    try {
      await togglePranayama(user.id, practiceDate, technique, completed);
    } catch (error) {
      console.error(`Error toggling ${technique}:`, error);
      // Rollback on error
      setLog((prev) => ({ ...prev, [technique]: !completed }));
    }
  };

  const handleAddMeditation = async (type: MeditationType, minutes: number) => {
    if (!user) return;

    try {
      const newSession = await addMeditationSession(user.id, practiceDate, type, minutes);

      // Add to local state
      setMeditationSessions((prev) => [
        ...prev,
        {
          id: newSession.id,
          type: newSession.type,
          minutes: newSession.minutes,
        },
      ]);
    } catch (error) {
      console.error("Error adding meditation session:", error);
    }
  };

  const handleRemoveMeditation = async (sessionId: string) => {
    if (!user) return;

    // Optimistic update
    setMeditationSessions((prev) => prev.filter((s) => s.id !== sessionId));

    try {
      await removeMeditationSession(sessionId);
    } catch (error) {
      console.error("Error removing meditation session:", error);
      // Reload sessions on error
      const sessions = await getMeditationSessions(user.id, practiceDate);
      setMeditationSessions(sessions);
    }
  };

  // Don't render until data is loaded
  if (!isLoaded || !practiceDate || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className={typography.helper}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AppHeader
        userName={user.username}
        userEmoji={user.emoji}
        memberSince="Oct 2024"
        score={score}
        currentDate="Today"
      />

      <div className="px-3 pt-3 pb-4">
        {/* Activity cards */}
        <div className="space-y-2">
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
