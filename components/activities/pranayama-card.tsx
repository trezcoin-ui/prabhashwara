"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Wind } from "lucide-react";
import { getPranayamaProgress } from "@/lib/scoring";
import { SCORES } from "@/lib/constants";
import type { PranayamaTechnique } from "@/lib/types";
import { typography } from "@/lib/design-system";

const ACCENT = "#60A5FA";

interface PranayamaCardProps {
  initialTechniques: {
    kapalabhati: boolean;
    bhastrika: boolean;
    nadi_shodhana: boolean;
    bhramari: boolean;
  };
  onToggle: (technique: PranayamaTechnique, completed: boolean) => Promise<void>;
  editable: boolean;
}

const techniques: { key: PranayamaTechnique; label: string }[] = [
  { key: "kapalabhati", label: "Kapalabhati" },
  { key: "bhastrika", label: "Bhastrika" },
  { key: "nadi_shodhana", label: "Nadi Shodhana" },
  { key: "bhramari", label: "Bhramari" },
];

export function PranayamaCard({
  initialTechniques,
  onToggle,
  editable,
}: PranayamaCardProps) {
  const [state, setState] = useState(initialTechniques);
  const [loading, setLoading] = useState<PranayamaTechnique | null>(null);

  const handleToggle = async (technique: PranayamaTechnique) => {
    if (!editable) return;

    setLoading(technique);
    const newValue = !state[technique];
    setState((prev) => ({ ...prev, [technique]: newValue })); // Optimistic update

    try {
      await onToggle(technique, newValue);
      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      // Rollback on error
      setState((prev) => ({ ...prev, [technique]: !newValue }));
    } finally {
      setLoading(null);
    }
  };

  const progress = getPranayamaProgress(state);
  const completedCount = techniques.filter((t) => state[t.key]).length;
  const totalPoints = completedCount * SCORES.PRANAYAMA_EACH;

  return (
    <GlassCard accent={ACCENT} delay={0.1} className="p-2.5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p
            className={typography.labelAccent}
            style={{ color: ACCENT }}
          >
            Pranayama · +{SCORES.PRANAYAMA_EACH} each
          </p>
          <h2 className={`mt-1 ${typography.h3}`}>
            {progress}
          </h2>
        </div>
        <div className={`shrink-0 text-right ${typography.numberMedium}`} style={{ color: totalPoints > 0 ? ACCENT : "rgba(255,255,255,0.25)" }}>
          +{totalPoints}
        </div>
      </header>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {techniques.map((technique) => {
          const on = state[technique.key];
          return (
            <motion.button
              key={technique.key}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleToggle(technique.key)}
              disabled={!editable || loading === technique.key}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-colors disabled:opacity-35 ${typography.bodyMedium}`}
              style={{
                borderColor: on ? ACCENT : "rgba(255,255,255,0.12)",
                background: on ? `${ACCENT}1a` : "rgba(255,255,255,0.03)",
                color: on ? ACCENT : "rgba(255,255,255,0.65)",
              }}
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                style={{ background: on ? ACCENT : `${ACCENT}26`, color: on ? "#0B0F17" : ACCENT }}
              >
                <Wind size={13} strokeWidth={2.5} />
              </span>
              <span className="truncate">{technique.label}</span>
            </motion.button>
          );
        })}
      </div>

      <p className={`mt-2 ${typography.helper}`}>
        Each technique earns {SCORES.PRANAYAMA_EACH} points. Practice them all for {SCORES.PRANAYAMA_EACH * 4} points total.
      </p>
    </GlassCard>
  );
}
