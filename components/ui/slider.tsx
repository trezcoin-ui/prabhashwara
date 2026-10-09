"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
  marks?: number[];
  variant?: "priming" | "surya" | "pranayama" | "meditation" | "default";
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step,
  label,
  marks = [],
  variant = "default",
}: SliderProps) {
  const variantClasses = {
    priming: "accent-priming",
    surya: "accent-surya",
    pranayama: "accent-pranayama",
    meditation: "accent-meditation",
    default: "accent-sage",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-medium text-ink">{label}</label>}
        <div className="text-3xl font-mono font-semibold tabular-nums text-ink">
          {value}
          <span className="text-lg text-ink-muted ml-1">min</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-2 bg-sage/20 rounded-full appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-focus",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:h-6",
            "[&::-webkit-slider-thumb]:w-6",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-sage",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-transform",
            "[&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:h-6",
            "[&::-moz-range-thumb]:w-6",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-sage",
            "[&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:cursor-pointer",
            variantClasses[variant]
          )}
        />

        {marks.length > 0 && (
          <div className="relative mt-2">
            <div className="flex justify-between px-1">
              {marks.map((mark) => (
                <div
                  key={mark}
                  className="flex flex-col items-center"
                  style={{
                    position: "absolute",
                    left: `${((mark - min) / (max - min)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="w-0.5 h-2 bg-hairline" />
                  <span className="text-xs text-ink-muted mt-1">{mark}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
