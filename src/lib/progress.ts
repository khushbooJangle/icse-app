// Progress now lives in Supabase instead of localStorage (APP_PLAN 11.4).
//
// WHAT CHANGED FOR CALLERS: every function here is now `async`, because talking
// to a database takes time where reading localStorage did not. The names and
// the shapes they return are deliberately unchanged, so each call site only
// needed an `await` added — nothing had to be restructured.
//
// The student id passed in is the Supabase user id (`user.username`, kept under
// that name so the existing pages read the same). Row Level Security means a
// student can only ever read or write their own rows regardless of what id the
// app passes, so these functions are a convenience, not the security boundary.

import { supabase } from "@/lib/supabase/client";
import { PASS_MARK, pickBestScore } from "@/lib/scoring";

// Re-exported so the many pages already importing PASS_MARK from here keep
// working. The rules themselves live in scoring.ts, which has no database
// import and so can be unit-tested directly.
export { PASS_MARK, pickBestScore };

/* ---------- which subject ---------- */

// There is exactly one subject today (APP_PLAN 11.6 keeps the door open for
// more). Fetched once and remembered, so every page isn't re-asking.
let cachedSubjectId: string | null = null;

export async function getSubjectId(): Promise<string | null> {
  if (cachedSubjectId) return cachedSubjectId;
  const { data } = await supabase
    .from("subjects")
    .select("id")
    .eq("slug", "computer-applications")
    .maybeSingle();
  cachedSubjectId = data?.id ?? null;
  return cachedSubjectId;
}

/* ---------- study ---------- */

export async function getStudyDone(studentId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("chapter_slug")
    .eq("student_id", studentId)
    .eq("studied", true);

  if (error) {
    console.error("getStudyDone:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.chapter_slug as string);
}

export async function markStudyDone(studentId: string, slug: string): Promise<void> {
  const subjectId = await getSubjectId();
  if (!subjectId) return;

  // upsert, not insert: the row may already exist from a quiz attempt on this
  // chapter. onConflict names the primary key so the existing row is updated
  // rather than the insert failing.
  const { error } = await supabase.from("progress").upsert(
    {
      student_id: studentId,
      subject_id: subjectId,
      chapter_slug: slug,
      studied: true,
      last_active: new Date().toISOString(),
    },
    { onConflict: "student_id,subject_id,chapter_slug" }
  );

  if (error) console.error("markStudyDone:", error.message);
}

/* ---------- quiz ---------- */

export async function getQuizScores(
  studentId: string
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("progress")
    .select("chapter_slug, quiz_best_score")
    .eq("student_id", studentId);

  if (error) {
    console.error("getQuizScores:", error.message);
    return {};
  }

  const scores: Record<string, number> = {};
  for (const row of data ?? []) {
    // A chapter marked studied but never quizzed sits at 0; leaving it out
    // keeps "not attempted" distinguishable from "attempted and scored 0".
    if (row.quiz_best_score > 0) {
      scores[row.chapter_slug as string] = row.quiz_best_score as number;
    }
  }
  return scores;
}

export async function saveQuizScore(
  studentId: string,
  slug: string,
  newScore: number,
  breakdown: { mcq: number; code: number } = { mcq: 0, code: 0 }
): Promise<void> {
  const subjectId = await getSubjectId();
  if (!subjectId) return;

  // Best score wins: a bad retake must never wipe out a good earlier attempt.
  // Read first, then write only if this attempt beat it.
  const { data: existing } = await supabase
    .from("progress")
    .select("quiz_best_score, studied")
    .eq("student_id", studentId)
    .eq("subject_id", subjectId)
    .eq("chapter_slug", slug)
    .maybeSingle();

  const best = pickBestScore(existing?.quiz_best_score ?? null, newScore);

  const { error } = await supabase.from("progress").upsert(
    {
      student_id: studentId,
      subject_id: subjectId,
      chapter_slug: slug,
      // Don't clobber a chapter already marked studied.
      studied: existing?.studied ?? false,
      quiz_best_score: best,
      quiz_type_breakdown: breakdown,
      last_active: new Date().toISOString(),
    },
    { onConflict: "student_id,subject_id,chapter_slug" }
  );

  if (error) console.error("saveQuizScore:", error.message);
}

export function isQuizChapterDone(
  scores: Record<string, number>,
  slug: string
): boolean {
  return (scores[slug] ?? 0) >= PASS_MARK;
}

/* ---------- papers ---------- */

export async function getPapersDone(studentId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("paper_attempts")
    .select("paper_id")
    .eq("student_id", studentId);

  if (error) {
    console.error("getPapersDone:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.paper_id as string);
}

export async function togglePaperDone(
  studentId: string,
  paperId: string
): Promise<void> {
  const subjectId = await getSubjectId();
  if (!subjectId) return;

  const done = await getPapersDone(studentId);

  if (done.includes(paperId)) {
    await supabase
      .from("paper_attempts")
      .delete()
      .eq("student_id", studentId)
      .eq("subject_id", subjectId)
      .eq("paper_id", paperId);
  } else {
    await supabase
      .from("paper_attempts")
      .insert({ student_id: studentId, subject_id: subjectId, paper_id: paperId });
  }
}
