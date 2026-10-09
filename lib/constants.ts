// Scoring configuration
export const SCORES = {
  PRIMING: 20,
  SURYA_NAMASKARAYA: 20,
  PRANAYAMA_EACH: 10, // max 40 (4 techniques)
  MEDITATION_PER_MINUTE: 1, // capped at 60 per day
  FULL_PRACTICE_BONUS: 20,
} as const;

// Pranayama techniques
export const PRANAYAMA_TECHNIQUES = [
  "kapalabhati",
  "bhastrika",
  "nadi_shodhana",
  "bhramari",
] as const;

// Meditation types
export const MEDITATION_TYPES = ["anapanasati", "metta"] as const;

// Meditation slider configuration
export const MEDITATION_DURATION = {
  MIN: 5,
  MAX: 90,
  STEP: 5,
  DEFAULT: 15,
  MARKS: [15, 30, 45, 60],
} as const;

// Practice day timezone
export const PRACTICE_TIMEZONE = "Europe/London" as const;

// Emoji pool for user avatars
export const EMOJI_POOL = [
  "🪷", "🌿", "🌸", "🌙", "☀️", "🕊️", "🍃", "🌊",
  "🌺", "🦋", "🌻", "🐚", "🌾", "🌼", "🪴", "🐢",
  "🦢", "🌕", "⛰️", "🌱",
] as const;

// Weak PINs that cannot be chosen
export const WEAK_PINS = [
  "000000",
  "123456",
  "111111",
  "222222",
  "333333",
  "444444",
  "555555",
  "666666",
  "777777",
  "888888",
  "999999",
  "654321",
] as const;
