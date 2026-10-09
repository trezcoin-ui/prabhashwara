import { SCORES, PRANAYAMA_TECHNIQUES } from "./constants";
import type { DailyLog, MeditationSession, PranayamaTechnique } from "./types";

/**
 * Calculate the score for a daily practice
 */
export function calculateDailyScore(
  log: Pick<
    DailyLog,
    | "priming"
    | "surya_namaskaraya"
    | "kapalabhati"
    | "bhastrika"
    | "nadi_shodhana"
    | "bhramari"
  >,
  meditationSessions: Pick<MeditationSession, "minutes">[]
): number {
  let score = 0;

  // Priming
  if (log.priming) {
    score += SCORES.PRIMING;
  }

  // Surya Namaskaraya
  if (log.surya_namaskaraya) {
    score += SCORES.SURYA_NAMASKARAYA;
  }

  // Pranayama (each technique)
  const pranayamaTechniques = PRANAYAMA_TECHNIQUES.filter(
    (technique) => log[technique]
  );
  score += pranayamaTechniques.length * SCORES.PRANAYAMA_EACH;

  // Meditation (capped at 60 per day)
  const totalMeditationMinutes = meditationSessions.reduce(
    (sum, session) => sum + session.minutes,
    0
  );
  const meditationScore = Math.min(
    totalMeditationMinutes * SCORES.MEDITATION_PER_MINUTE,
    60
  );
  score += meditationScore;

  // Full practice bonus (all four categories done)
  const hasAllCategories =
    log.priming &&
    log.surya_namaskaraya &&
    pranayamaTechniques.length > 0 &&
    meditationSessions.length > 0;

  if (hasAllCategories) {
    score += SCORES.FULL_PRACTICE_BONUS;
  }

  return score;
}

/**
 * Get completed pranayama techniques from a daily log
 */
export function getCompletedPranayama(
  log: Pick<DailyLog, "kapalabhati" | "bhastrika" | "nadi_shodhana" | "bhramari">
): PranayamaTechnique[] {
  return PRANAYAMA_TECHNIQUES.filter((technique) => log[technique]);
}

/**
 * Get pranayama progress (e.g., "2 of 4")
 */
export function getPranayamaProgress(
  log: Pick<DailyLog, "kapalabhati" | "bhastrika" | "nadi_shodhana" | "bhramari">
): string {
  const completed = getCompletedPranayama(log).length;
  return `${completed} of ${PRANAYAMA_TECHNIQUES.length}`;
}

/**
 * Check if all activities are completed (perfect practice day)
 */
export function isPerfectPractice(
  log: Pick<
    DailyLog,
    | "priming"
    | "surya_namaskaraya"
    | "kapalabhati"
    | "bhastrika"
    | "nadi_shodhana"
    | "bhramari"
  >,
  meditationSessions: MeditationSession[]
): boolean {
  const pranayamaTechniques = getCompletedPranayama(log);
  return (
    log.priming &&
    log.surya_namaskaraya &&
    pranayamaTechniques.length === PRANAYAMA_TECHNIQUES.length &&
    meditationSessions.length > 0
  );
}
