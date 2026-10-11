// Reading and writing doubts (APP_PLAN Section 12).
//
// A lightweight async Q&A channel: one question, one tutor reply, no threading.
//
// WHAT THIS FILE DOES NOT DO: enforce who may do what. That lives in the
// database — the RLS policies decide which rows you can see, and the
// `guard_doubt_update` trigger rejects an illegal status change or a student
// trying to edit the tutor's reply. These functions would fail loudly if they
// tried to cheat, which is the point of putting the rules down there.

import { supabase } from "@/lib/supabase/client";
import { getSubjectId } from "@/lib/progress";

export type DoubtStatus = "open" | "replied" | "resolved" | "discuss";

export type Doubt = {
  id: string;
  student_id: string;
  chapter_slug: string;
  question_text: string;
  tutor_reply: string | null;
  status: DoubtStatus;
  created_at: string;
  replied_at: string | null;
};

const COLUMNS =
  "id, student_id, chapter_slug, question_text, tutor_reply, status, created_at, replied_at";

/** A doubt still needing someone's attention — the tutor's or the student's. */
export function isOpenish(status: DoubtStatus): boolean {
  return status !== "resolved";
}

export const STATUS_LABEL: Record<DoubtStatus, string> = {
  open: "Waiting for tutor",
  replied: "Tutor replied",
  discuss: "To discuss in person",
  resolved: "Resolved",
};

export const STATUS_STYLE: Record<DoubtStatus, string> = {
  open: "bg-amber-100 text-amber-700",
  replied: "bg-blue-100 text-blue-700",
  discuss: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
};

/* ---------- student ---------- */

export async function createDoubt(
  studentId: string,
  chapterSlug: string,
  questionText: string
): Promise<{ error: string | null }> {
  const subjectId = await getSubjectId();
  if (!subjectId) return { error: "Could not work out the subject." };

  const { error } = await supabase.from("doubts").insert({
    student_id: studentId,
    subject_id: subjectId,
    chapter_slug: chapterSlug,
    question_text: questionText.trim(),
    status: "open",
  });

  return { error: error?.message ?? null };
}

export async function listMyDoubts(studentId: string): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from("doubts")
    .select(COLUMNS)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listMyDoubts:", error.message);
    return [];
  }
  return (data as Doubt[]) ?? [];
}

/**
 * The student closing a doubt out. Only three moves are legal, and the database
 * trigger is what actually enforces that:
 *   replied -> resolved  ("Understood")
 *   replied -> discuss   ("Let's discuss")
 *   discuss -> resolved  (after the live conversation happened)
 */
export async function setDoubtStatus(
  doubtId: string,
  status: Extract<DoubtStatus, "resolved" | "discuss">
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("doubts")
    .update({ status })
    .eq("id", doubtId);
  return { error: error?.message ?? null };
}

/* ---------- tutor ---------- */

export async function listDoubtsForStudents(studentIds: string[]): Promise<Doubt[]> {
  if (studentIds.length === 0) return [];

  const { data, error } = await supabase
    .from("doubts")
    .select(COLUMNS)
    .in("student_id", studentIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listDoubtsForStudents:", error.message);
    return [];
  }
  return (data as Doubt[]) ?? [];
}

/** One reply, no threading. Also stamps the status and the time. */
export async function replyToDoubt(
  doubtId: string,
  reply: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("doubts")
    .update({
      tutor_reply: reply.trim(),
      status: "replied",
      replied_at: new Date().toISOString(),
    })
    .eq("id", doubtId);
  return { error: error?.message ?? null };
}
