import { PRANAYAMA_TECHNIQUES, MEDITATION_TYPES } from "./constants";

export type PranayamaTechnique = typeof PRANAYAMA_TECHNIQUES[number];
export type MeditationType = typeof MEDITATION_TYPES[number];

export interface User {
  id: string;
  username: string;
  username_lower: string;
  emoji: string;
  pin_hash: string | null;
  pin_reset_at: string | null;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  practice_date: string; // YYYY-MM-DD
  priming: boolean;
  surya_namaskaraya: boolean;
  kapalabhati: boolean;
  bhastrika: boolean;
  nadi_shodhana: boolean;
  bhramari: boolean;
  score: number;
  updated_at: string;
}

// Practice log without DB-specific fields (for local use)
export interface PracticeLog {
  priming: boolean;
  surya_namaskaraya: boolean;
  kapalabhati: boolean;
  bhastrika: boolean;
  nadi_shodhana: boolean;
  bhramari: boolean;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  practice_date: string; // YYYY-MM-DD
  type: MeditationType;
  minutes: number;
  created_at: string;
}

// Meditation session without DB-specific fields (for client use)
export interface ClientMeditationSession {
  id: string;
  type: MeditationType;
  minutes: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  emoji: string;
  score: number;
  priming: boolean;
  surya_namaskaraya: boolean;
  pranayama_techniques: PranayamaTechnique[];
  meditation_sessions: {
    type: MeditationType;
    minutes: number;
  }[];
  earliest_completion: string;
}

export interface Streak {
  current: number;
  longest: number;
}
