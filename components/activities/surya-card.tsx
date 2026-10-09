"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Check, RotateCcw } from "lucide-react";
import { SCORES } from "@/lib/constants";
import { typography } from "@/lib/design-system";

const ACCENT = "#F59E0B";

interface SuryaCardProps {
  initialCompleted: boolean;
  onToggle: (completed: boolean) => Promise<void>;
  editable: boolean;
}

export function SuryaCard({ initialCompleted, onToggle, editable }: SuryaCardProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!editable) return;

    setLoading(true);
    const newState = !completed;
    setCompleted(newState); // Optimistic update

    try {
      await onToggle(newState);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      // Rollback on error
      setCompleted(!newState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard accent={ACCENT} delay={0.05} className="p-3.5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p
            className={typography.labelAccent}
            style={{ color: ACCENT }}
          >
            Surya Namaskaraya · +{SCORES.SURYA_NAMASKARAYA}
          </p>
          {completed && (
            <h2 className={`mt-1 ${typography.h3}`}>
              Sun salutation complete
            </h2>
          )}
        </div>
        {completed ? (
          <span
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: `${ACCENT}22`, color: ACCENT }}
          >
            <Check size={12} strokeWidth={3} />
            Done
          </span>
        ) : (
          <span className={`shrink-0 text-white/25 ${typography.numberMedium}`}>
            +{SCORES.SURYA_NAMASKARAYA}
          </span>
        )}
      </header>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className={typography.helper}>
          {completed ? `${SCORES.SURYA_NAMASKARAYA} points earned for this day.` : "Greet the sun with your practice."}
        </p>
        {completed ? (
          <button
            type="button"
            onClick={handleToggle}
            disabled={!editable || loading}
            className={`flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1.5 text-white/45 transition hover:text-white/65 active:scale-95 disabled:opacity-35 ${typography.button}`}
          >
            <RotateCcw size={11} />
            Undo
          </button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handleToggle}
            disabled={!editable || loading}
            className={`shrink-0 rounded-xl border px-3 py-1.5 transition active:scale-95 disabled:opacity-35 ${typography.button}`}
            style={{ borderColor: `${ACCENT}66`, color: ACCENT }}
          >
            {loading ? "..." : "Mark as done"}
          </motion.button>
        )}
      </div>
    </GlassCard>
  );
}
