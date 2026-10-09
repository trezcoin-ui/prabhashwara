"use client";

import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  variant?: "priming" | "surya" | "pranayama" | "meditation" | "default";
}

export function Chip({
  children,
  active = false,
  variant = "default",
  className,
  ...props
}: ChipProps) {
  const variantClasses = {
    priming: active ? "bg-priming text-surface" : "bg-priming/10 text-priming",
    surya: active ? "bg-surya text-surface" : "bg-surya/10 text-surya",
    pranayama: active ? "bg-pranayama text-surface" : "bg-pranayama/10 text-pranayama",
    meditation: active ? "bg-meditation text-surface" : "bg-meditation/10 text-meditation",
    default: active ? "bg-sage text-surface" : "bg-sage/10 text-sage",
  };

  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "min-h-[44px] min-w-[44px]",
        variantClasses[variant],
        className
      )}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}
