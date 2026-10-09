"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Heart, X, Plus } from "lucide-react";
import { MEDITATION_DURATION, SCORES } from "@/lib/constants";
import type { MeditationType, MeditationSession } from "@/lib/types";
import { typography } from "@/lib/design-system";

const ACCENT = "#EC4899";

interface MeditationCardProps {
  initialSessions: MeditationSession[];
  onAddSession: (type: MeditationType, minutes: number) => Promise<void>;
  onRemoveSession: (sessionId: string) => Promise<void>;
  editable: boolean;
}

export function MeditationCard({
  initialSessions,
  onAddSession,
  onRemoveSession,
  editable,
}: MeditationCardProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [type, setType] = useState<MeditationType>("anapanasati");
  const [duration, setDuration] = useState<number>(MEDITATION_DURATION.DEFAULT);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAddSession = async () => {
    if (!editable) return;

    try {
      await onAddSession(type, duration);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      console.error("Failed to add meditation session:", error);
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (!editable) return;

    setRemovingId(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId)); // Optimistic update

    try {
      await onRemoveSession(sessionId);
    } catch (error) {
      // Rollback on error - we'd need to refetch from server
      console.error("Failed to remove meditation session:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const totalPoints = Math.min(totalMinutes * SCORES.MEDITATION_PER_MINUTE, 60);

  return (
    <GlassCard accent={ACCENT} delay={0.15} className="p-2.5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p
            className={typography.labelAccent}
            style={{ color: ACCENT }}
          >
            Meditation · +{SCORES.MEDITATION_PER_MINUTE}/min (max 60)
          </p>
          {totalMinutes > 0 && (
            <h2 className={`mt-1 ${typography.h3} uppercase`}>
              {totalMinutes} minutes today
            </h2>
          )}
        </div>
        <div className={`shrink-0 text-right ${typography.numberMedium}`} style={{ color: totalPoints > 0 ? ACCENT : "rgba(255,255,255,0.25)" }}>
          +{totalPoints}
        </div>
      </header>

      {/* Type selector */}
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1">
        {(
          [
            { id: "anapanasati", label: "අනාපානසති" },
            { id: "metta", label: "මෛත්‍රී භාවනාව" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setType(m.id)}
            aria-pressed={type === m.id}
            className={`rounded-lg py-2 transition-colors ${typography.bodyMedium}`}
            style={{
              background: type === m.id ? ACCENT : "transparent",
              color: type === m.id ? "#0B0F17" : "rgba(255,255,255,0.6)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Duration slider with add button */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className={typography.helper}>duration</span>
          <div className="flex items-center gap-2">
            <div className={`text-right ${typography.numberMedium}`} style={{ color: ACCENT }}>
              {duration}
              <span className={`${typography.helper} ml-1`}>min</span>
            </div>
            <button
              type="button"
              onClick={handleAddSession}
              disabled={!editable}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all active:scale-90 disabled:opacity-35"
              style={{ background: ACCENT, color: "#0B0F17" }}
              aria-label="Add meditation session"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={MEDITATION_DURATION.MIN}
          max={MEDITATION_DURATION.MAX}
          step={MEDITATION_DURATION.STEP}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          aria-label="Meditation duration"
          style={{ ["--track-accent" as string]: ACCENT }}
          className="w-full"
        />
        <div className={`tnum mt-1 flex justify-between ${typography.label} lowercase`} style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>{MEDITATION_DURATION.MIN}</span>
          <span>{MEDITATION_DURATION.MARKS[0]}</span>
          <span>{MEDITATION_DURATION.MARKS[1]}</span>
          <span>{MEDITATION_DURATION.MARKS[2]}</span>
          <span>{MEDITATION_DURATION.MARKS[3]}</span>
          <span>{MEDITATION_DURATION.MAX}</span>
        </div>
      </div>

      {/* Today's sessions list */}
      <AnimatePresence>
        {sessions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5">
              <h4 className={`${typography.helper} font-medium`}>today's sessions</h4>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] py-1.5 pl-2.5 pr-1"
                >
                  <Heart size={14} className="shrink-0" style={{ color: ACCENT }} />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate ${typography.bodyMedium} uppercase`}>
                      {session.type}
                    </span>
                    <span className={`tnum block ${typography.helper}`}>
                      {session.minutes} min
                    </span>
                  </span>
                  {editable && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSession(session.id)}
                      disabled={removingId === session.id}
                      aria-label={`Remove ${session.type} session`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/35 transition active:scale-90 disabled:opacity-35"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`mt-2 ${typography.helper}`}>
        {totalMinutes >= 60
          ? "maximum 60 points per day from meditation."
          : "each minute earns a point, up to 60 points per day."}
      </p>
    </GlassCard>
  );
}
