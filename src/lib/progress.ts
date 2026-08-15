// All progress (which chapters are done, quiz scores, papers attempted) lives in
// localStorage — no database, no API. Every key is prefixed with the username so
// two friends on the same browser don't overwrite each other.
//
// WHY the `typeof window` guard: Next.js runs this code on the SERVER first
// during rendering, and there is no localStorage on a server. Without the guard
// the app crashes at build/render time. Returning a safe empty value is enough —
// the real value gets read again on the browser once the page hydrates.

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Someone edited localStorage by hand, or the shape changed. Don't crash.
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// A chapter counts as "quiz done" only at 80% or better.
export const PASS_MARK = 80;

/* ---------- Study: a plain list of finished chapter slugs ---------- */

export function getStudyDone(username: string): string[] {
  return read<string[]>(`${username}_study`, []);
}

export function markStudyDone(username: string, slug: string) {
  const done = getStudyDone(username);
  if (done.includes(slug)) return; // already there, nothing to do
  write(`${username}_study`, [...done, slug]);
}

/* ---------- Quiz: a map of chapterSlug -> BEST score so far ---------- */

export function getQuizScores(username: string): Record<string, number> {
  return read<Record<string, number>>(`${username}_quizScores`, {});
}

// Best score wins: a bad retake never wipes out a good earlier attempt.
export function saveQuizScore(username: string, slug: string, newScore: number) {
  const scores = getQuizScores(username);
  const existing = scores[slug] ?? 0;
  if (newScore <= existing) return;
  write(`${username}_quizScores`, { ...scores, [slug]: newScore });
}

export function isQuizChapterDone(username: string, slug: string): boolean {
  return (getQuizScores(username)[slug] ?? 0) >= PASS_MARK;
}

/* ---------- Papers: a plain list of attempted paper ids ---------- */

export function getPapersDone(username: string): string[] {
  return read<string[]>(`${username}_papers`, []);
}

export function togglePaperDone(username: string, id: string) {
  const done = getPapersDone(username);
  const next = done.includes(id) ? done.filter((p) => p !== id) : [...done, id];
  write(`${username}_papers`, next);
}
