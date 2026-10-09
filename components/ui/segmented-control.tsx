"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  variant?: "priming" | "surya" | "pranayama" | "meditation" | "default";
}

export function SegmentedControl({
  options,
  value,
  onChange,
  variant = "default",
}: SegmentedControlProps) {
  const variantClasses = {
    priming: "bg-priming text-surface",
    surya: "bg-surya text-surface",
    pranayama: "bg-pranayama text-surface",
    meditation: "bg-meditation text-surface",
    default: "bg-sage text-surface",
  };

  return (
    <div className="hairline rounded-full bg-surface p-1 flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            "min-h-[40px]",
            value === option.value
              ? variantClasses[variant]
              : "text-ink-muted hover:text-ink"
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
