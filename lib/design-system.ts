/**
 * Design System — Typography
 *
 * One family (Geist) for text and numbers; Sinhala falls back to Noto Sans Sinhala.
 * Scale: 11 · 12 · 14 · 15 · 17 · 22 · 28 px. Weights: 400 / 500 / 600 only.
 * All numbers use tabular lining figures so columns and scores line up.
 */

export const typography = {
  // Eyebrow labels (11px, uppercase, tracked)
  label: "text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-white/55",
  labelAccent: "text-[11px] font-semibold uppercase leading-4 tracking-[0.08em]", // Color applied inline

  // Headings
  h1: "text-[28px] font-semibold leading-8 tracking-[-0.02em] text-white/95",
  h2: "text-[17px] font-semibold leading-6 tracking-[-0.01em] text-white/95",
  h3: "text-[15px] font-semibold leading-5 tracking-[-0.005em] text-white/90",

  // Body text
  body: "text-[14px] font-normal leading-5 text-white/80",
  bodyMedium: "text-[14px] font-medium leading-5 text-white/85",
  bodySmall: "text-[12px] font-medium leading-4 text-white/65",

  // Helper text
  helper: "text-[12px] font-normal leading-4 text-white/45",
  helperStrong: "text-[12px] font-medium leading-4 text-white/45",

  // Numbers (same family, tabular lining figures)
  numberLarge: "tnum text-[22px] font-semibold leading-7 tracking-[-0.01em]",
  numberMedium: "tnum text-[15px] font-semibold leading-5",
  numberSmall: "tnum text-[12px] font-semibold leading-4",

  // Buttons
  button: "text-[14px] font-semibold leading-5",
  buttonSmall: "text-[12px] font-semibold leading-4",

  // Links
  link: "text-[14px] font-medium underline-offset-2 hover:underline",

  // Form inputs
  input: "text-[16px] font-normal leading-6",
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
