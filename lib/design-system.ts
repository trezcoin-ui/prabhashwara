/**
 * Design System — Typography and Spacing
 * Extracted from Let's Get Fit for consistency
 */

export const typography = {
  // Exact font sizes from Let's Get Fit
  label: "text-[10px] font-semibold uppercase tracking-[0.18em]",
  heading: "text-[15px] font-[family-name:var(--font-display)] font-semibold leading-tight text-white/90",
  secondary: "text-[12.5px]",
  helper: "text-[10.5px] leading-snug text-white/45",
  tiny: "text-[9px] font-semibold",
  number: "tnum text-2xl font-[family-name:var(--font-display)] font-bold",
  unit: "text-xs font-medium text-white/40",
};

export const colors = {
  text: {
    primary: "text-white/90",
    secondary: "text-white/80",
    tertiary: "text-white/65",
    muted: "text-white/45",
    ghost: "text-white/40",
    faint: "text-white/35",
    phantom: "text-white/25",
  },
};

export const spacing = {
  card: "p-3.5",
  cardWithExtra: "p-3.5 pb-5",
  gap: {
    tight: "gap-0.5",
    compact: "gap-1",
    normal: "gap-2",
    comfortable: "gap-2.5",
    spacious: "gap-3",
  },
  mt: {
    xs: "mt-1",
    sm: "mt-2",
    md: "mt-2.5",
    lg: "mt-3",
  },
};
