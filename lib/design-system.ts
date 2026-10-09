/**
 * Design System — Professional Typography System
 * Consistent fonts, sizes, and weights throughout the app
 */

export const typography = {
  // Labels and tags (10px, always uppercase, semibold)
  label: "text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60",
  labelAccent: "text-[10px] font-semibold uppercase tracking-[0.18em]", // Color applied inline

  // Headings (Display font - Instrument Serif)
  h1: "font-[family-name:var(--font-display)] text-[28px] font-semibold leading-tight text-white/90",
  h2: "font-[family-name:var(--font-display)] text-[20px] font-semibold leading-tight text-white/90",
  h3: "font-[family-name:var(--font-display)] text-[15px] font-semibold leading-tight text-white/90",

  // Body text (Geist Sans)
  body: "text-[13px] font-normal leading-relaxed text-white/80",
  bodyMedium: "text-[12.5px] font-medium leading-relaxed text-white/80",
  bodySmall: "text-[11px] font-normal leading-normal text-white/65",

  // Helper text
  helper: "text-[10.5px] leading-snug text-white/45",
  helperStrong: "text-[10.5px] font-medium leading-snug text-white/45",

  // Numbers (Display font with tabular nums)
  numberLarge: "tnum font-[family-name:var(--font-display)] text-[32px] font-bold leading-none",
  numberMedium: "tnum font-[family-name:var(--font-display)] text-[20px] font-bold leading-none",
  numberSmall: "tnum font-[family-name:var(--font-display)] text-[18px] font-bold leading-none",

  // Buttons
  button: "text-[12px] font-semibold",
  buttonSmall: "text-[11px] font-semibold",

  // Links
  link: "text-[13px] font-medium underline-offset-2 hover:underline",
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
