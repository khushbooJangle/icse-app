// Tiny self-check for the progress rules. No test framework — just run:
//   npm test
// It fails loudly if the "best score wins" or "80% = done" rules ever break.

import assert from "node:assert";

// Fake localStorage so this can run in Node, where there is no browser.
const store = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
};

const { getQuizScores, saveQuizScore, isQuizChapterDone, getStudyDone, markStudyDone } =
  await import("./progress.ts");

// A retake that scores worse must NOT overwrite the better score.
saveQuizScore("aryan", "loops", 60);
saveQuizScore("aryan", "loops", 90);
saveQuizScore("aryan", "loops", 40);
assert.equal(getQuizScores("aryan").loops, 90, "best score should win");

// 80 is the pass mark: 80 passes, 79 does not.
saveQuizScore("aryan", "arrays-1d", 80);
saveQuizScore("aryan", "methods", 79);
assert.equal(isQuizChapterDone("aryan", "arrays-1d"), true);
assert.equal(isQuizChapterDone("aryan", "methods"), false);
assert.equal(isQuizChapterDone("aryan", "never-attempted"), false);

// Two users must not share progress.
assert.deepEqual(getQuizScores("riya"), {});

// Marking a chapter done twice shouldn't create a duplicate.
markStudyDone("aryan", "oop-intro");
markStudyDone("aryan", "oop-intro");
assert.deepEqual(getStudyDone("aryan"), ["oop-intro"]);

/* ---------- content contract ----------
   These guard the things a future content drop can quietly break:
   a chapter with no questions, a flashcard pointing at a deleted slug, or the
   bonus flag going missing (which would make the progress bar read "x / 17"). */

const { CHAPTERS } = await import("../data/chapters.ts");
const { QUIZZES } = await import("../data/quizzes.ts");
const { REVISION_CARDS } = await import("../data/revision.ts");

const chapterSlugs = new Set(CHAPTERS.map((c) => c.slug));
const bonusSlugs = CHAPTERS.filter((c) => c.isBonus).map((c) => c.slug);

assert.deepEqual(bonusSlugs, ["data-structures"], "only Stack & Queue is bonus");
assert.equal(
  CHAPTERS.length - bonusSlugs.length,
  16,
  "16 syllabus chapters drive the progress denominator"
);

for (const chapter of CHAPTERS) {
  assert.ok(
    QUIZZES.some((q) => q.chapterSlug === chapter.slug),
    `chapter "${chapter.slug}" has no quiz questions`
  );
  assert.ok(
    REVISION_CARDS.some((r) => r.chapterSlug === chapter.slug),
    `chapter "${chapter.slug}" has no flashcard`
  );
}

for (const q of QUIZZES) {
  assert.ok(chapterSlugs.has(q.chapterSlug), `question points at unknown chapter "${q.chapterSlug}"`);
  // correctIndex must actually be a real option, or scoring silently breaks.
  assert.ok(
    q.correctIndex >= 0 && q.correctIndex < q.options.length,
    `bad correctIndex in: ${q.question}`
  );
}

for (const card of REVISION_CARDS) {
  assert.ok(chapterSlugs.has(card.chapterSlug), `flashcard for unknown chapter "${card.chapterSlug}"`);
}

console.log(
  `✅ all checks passed — ${CHAPTERS.length} chapters (${bonusSlugs.length} bonus), ${QUIZZES.length} questions, ${REVISION_CARDS.length} cards`
);
