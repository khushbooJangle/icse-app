// The pure scoring rules, kept free of any Supabase import.
//
// WHY A SEPARATE FILE: progress.ts talks to the database, so importing it
// outside a browser pulls in the Supabase client and its env vars. These two
// rules are the part worth testing, and keeping them here lets the node-based
// self-check (progress.test.ts) import them with no setup at all.

/** A chapter counts as "quiz done" only at this percentage or above. */
export const PASS_MARK = 80;

/**
 * Best score wins: a worse retake must never overwrite a better earlier attempt.
 * `existing` is null when the chapter has never been quizzed.
 */
export function pickBestScore(existing: number | null, incoming: number): number {
  return Math.max(existing ?? 0, incoming);
}

/** Derived, not stored — "done" is always computed from the best score. */
export function isPassing(score: number | null | undefined): boolean {
  return (score ?? 0) >= PASS_MARK;
}
