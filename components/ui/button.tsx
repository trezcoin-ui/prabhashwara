"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-sage-deep text-surface hover:bg-sage-deep/90",
    secondary: "hairline bg-surface text-ink hover:bg-ink/5",
    ghost: "text-ink hover:bg-ink/5",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]",
  };

  return (
    <button
      className={cn(
        "rounded-full font-medium transition-all duration-200",
        "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
