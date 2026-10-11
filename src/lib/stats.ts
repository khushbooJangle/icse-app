// Turns raw progress / activity rows into the figures the three dashboards
// show (APP_PLAN 11.5). Written once here rather than three times, so a tutor
// and a parent can never disagree about the same student's numbers.
//
// Row Level Security does the access control: a tutor's query returns only
// their roster, a parent's only their one child. These functions just do the
// arithmetic on whatever came back.

import { supabase } from "@/lib/supabase/client";
import { CORE_CHAPTERS, CORE_TOTAL } from "@/lib/content";
import { PASS_MARK } from "@/lib/progress";

const CORE_SLUGS = new Set(CORE_CHAPTERS.map((c) => c.slug));

export type StudentStats = {
  studentId: string;
  chaptersStudied: number;
  chaptersPercent: number;
  quizzesPassed: number;
  quizPercent: number;
  /** Auto-graded question counts behind the quiz figure (mcq + code). */
  gradedQuestions: number;
  secondsToday: number;
  /** Mean over the last 7 calendar days, including days with no activity. */
  secondsPerDay7: number;
  lastActive: string | null;
};

function emptyStats(studentId: string): StudentStats {
  return {
    studentId,
    chaptersStudied: 0,
    chaptersPercent: 0,
    quizzesPassed: 0,
    quizPercent: 0,
    gradedQuestions: 0,
    secondsToday: 0,
    secondsPerDay7: 0,
    lastActive: null,
  };
}

// Local calendar dates, so "today" means the student's today rather than UTC's.
function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/**
 * Stats for one or many students in two queries total, rather than two queries
 * per student — a roster of twenty would otherwise be forty round trips.
 */
export async function loadStats(studentIds: string[]): Promise<Map<string, StudentStats>> {
  const result = new Map<string, StudentStats>();
  for (const id of studentIds) result.set(id, emptyStats(id));
  if (studentIds.length === 0) return result;

  const today = isoDate(new Date());
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6); // 7 days inclusive of today

  const [{ data: progressRows }, { data: activityRows }] = await Promise.all([
    supabase
      .from("progress")
      .select("student_id, chapter_slug, studied, quiz_best_score, quiz_type_breakdown, last_active")
      .in("student_id", studentIds),
    supabase
      .from("daily_activity")
      .select("student_id, activity_date, seconds_active")
      .in("student_id", studentIds)
      .gte("activity_date", isoDate(weekAgo)),
  ]);

  for (const row of progressRows ?? []) {
    const stats = result.get(row.student_id as string);
    // Bonus chapters are excluded from every percentage, exactly as they are
    // on the student's own dashboard (APP_PLAN guardrail 11).
    if (!stats || !CORE_SLUGS.has(row.chapter_slug as string)) continue;

    if (row.studied) stats.chaptersStudied += 1;
    if ((row.quiz_best_score as number) >= PASS_MARK) stats.quizzesPassed += 1;

    const breakdown = (row.quiz_type_breakdown ?? {}) as { mcq?: number; code?: number };
    stats.gradedQuestions += (breakdown.mcq ?? 0) + (breakdown.code ?? 0);

    const seen = row.last_active as string | null;
    if (seen && (!stats.lastActive || seen > stats.lastActive)) {
      stats.lastActive = seen;
    }
  }

  for (const row of activityRows ?? []) {
    const stats = result.get(row.student_id as string);
    if (!stats) continue;
    const seconds = row.seconds_active as number;
    if ((row.activity_date as string) === today) stats.secondsToday += seconds;
    stats.secondsPerDay7 += seconds;
  }

  // forEach rather than `for...of result.values()`: this project compiles to
  // ES5, where iterating a Map directly needs an extra compiler flag.
  result.forEach((stats) => {
    stats.chaptersPercent = Math.round((stats.chaptersStudied / CORE_TOTAL) * 100);
    stats.quizPercent = Math.round((stats.quizzesPassed / CORE_TOTAL) * 100);
    // Divide by 7 days, not by the number of days that happen to have rows —
    // otherwise one keen day after a quiet week reads as a 7-day average.
    stats.secondsPerDay7 = Math.round(stats.secondsPerDay7 / 7);
  });

  return result;
}

/** 4500 -> "1h 15m", 90 -> "1m", 0 -> "—" */
export function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** "2026-10-04T…" -> "today" / "yesterday" / "4 Oct" / "—" */
export function formatLastActive(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso);
  const days = Math.floor(
    (new Date(isoDate(new Date())).getTime() - new Date(isoDate(then)).getTime()) /
      86_400_000
  );
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// Shown next to every quiz percentage a parent or tutor sees (APP_PLAN 11.5).
// Without it, a lower number looks like missed work rather than a deliberate
// scoring rule.
export const QUIZ_PERCENT_FOOTNOTE =
  "Covers auto-graded questions only (multiple-choice and write-the-program). " +
  "Short written answers are self-marked, so they are practised but never counted " +
  "towards this figure.";
