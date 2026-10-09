"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  accent?: string;
  delay?: number;
  className?: string;
}

export function GlassCard({
  children,
  accent,
  delay = 0,
  className,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 380, damping: 34 }}
      className={cn(
        "rounded-2xl border bg-white/[0.03] backdrop-blur-sm",
        className
      )}
      style={{
        borderColor: accent
          ? `${accent}33`
          : "rgba(255, 255, 255, 0.12)",
        boxShadow: accent
          ? `0 0 24px -12px ${accent}44`
          : "none",
      }}
    >
      {children}
    </motion.div>
  );
}
