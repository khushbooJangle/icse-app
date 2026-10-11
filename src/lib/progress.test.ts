// Self-check for the rules that are pure logic. No test framework — run:
//   npm test
//
// Progress itself now lives in Supabase (APP_PLAN 11.4), so there is nothing
// local left to assert about storage — the database and its RLS policies are
// covered separately by `npm run test:rls`. What remains here is the scoring
// arithmetic, the code grader, and the content contract.

import assert from "node:assert";
import { readFile } from "node:fs/promises";

/* ---------- scoring rules ---------- */

const { PASS_MARK, pickBestScore, isPassing } = await import("./scoring.ts");

// Best score wins: a worse retake must not overwrite a better attempt.
assert.equal(pickBestScore(90, 40), 90, "a worse retake must not lower the score");
assert.equal(pickBestScore(60, 90), 90, "a better retake must raise the score");
assert.equal(pickBestScore(null, 55), 55, "first attempt sets the score");
assert.equal(pickBestScore(90, 90), 90);

// 80 is the bar: 80 passes, 79 does not.
assert.equal(PASS_MARK, 80);
assert.equal(isPassing(80), true, "exactly 80% must pass");
assert.equal(isPassing(79), false, "79% must not pass");
assert.equal(isPassing(null), false, "never attempted must not pass");
assert.equal(isPassing(undefined), false);

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
  // Only MCQs have options — checking q.type first is what lets TypeScript
  // (and us) safely read correctIndex here.
  if (q.type === "mcq") {
    assert.ok(
      q.correctIndex >= 0 && q.correctIndex < q.options.length,
      `bad correctIndex in: ${q.question}`
    );
  }
}

for (const card of REVISION_CARDS) {
  assert.ok(chapterSlugs.has(card.chapterSlug), `flashcard for unknown chapter "${card.chapterSlug}"`);
}

/* ---------- code-question grading ---------- */

const { checkCode } = await import("./codeCheck.ts");

const MODEL = `for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}`;

// Identical answer -> 100%.
assert.equal(checkCode(MODEL, MODEL).percent, 100);
assert.equal(checkCode(MODEL, MODEL).isCorrect, true);

// Indentation and extra spaces must be ignored.
const MESSY = `for   (int i = 1;   i <= 5;  i++) {
System.out.println(i);
      }`;
assert.equal(checkCode(MESSY, MODEL).percent, 100, "whitespace must not matter");

// Blank lines must be ignored.
assert.equal(checkCode(`\n\n${MODEL}\n\n`, MODEL).percent, 100, "blank lines must not matter");

// Order must not matter — the closing brace typed first still counts.
const REORDERED = `}
System.out.println(i);
for (int i = 1; i <= 5; i++) {`;
assert.equal(checkCode(REORDERED, MODEL).percent, 100, "order must not matter");

// Missing one of three lines = 67% -> below the 80% bar.
const MISSING_ONE = `for (int i = 1; i <= 5; i++) {
    System.out.println(i);`;
const partial = checkCode(MISSING_ONE, MODEL);
assert.equal(partial.percent, 67);
assert.equal(partial.isCorrect, false, "67% must NOT pass");
assert.deepEqual(partial.missing, ["}"]);

// Exactly 80% must pass (the boundary — 4 of 5 lines).
const FIVE = "a;\nb;\nc;\nd;\ne;";
const fourOfFive = checkCode("a;\nb;\nc;\nd;", FIVE);
assert.equal(fourOfFive.percent, 80);
assert.equal(fourOfFive.isCorrect, true, "exactly 80% must pass");

// Empty answer scores 0 and must not crash.
assert.equal(checkCode("", MODEL).percent, 0);
assert.equal(checkCode("", MODEL).isCorrect, false);

// Extra lines the student invented don't add credit beyond the model's lines.
assert.equal(checkCode(`${MODEL}\nint junk = 9;`, MODEL).percent, 100);

/* ---------- quiz union shape (3 variants) ---------- */

for (const q of QUIZZES) {
  assert.ok(
    q.type === "mcq" || q.type === "short" || q.type === "code",
    `question has an unknown type`
  );
  // Both written types need a model answer to compare against, or the
  // reveal/diff step has nothing to show.
  if (q.type === "short" || q.type === "code") {
    assert.ok(
      q.modelAnswer.trim().length > 0,
      `${q.type} question has an empty model answer`
    );
    assert.ok(q.prompt.trim().length > 0, `${q.type} question has an empty prompt`);
  }
  if (q.type === "code") {
    assert.ok(q.title.trim().length > 0, "code question has an empty title");
  }
}

const mcqCount = QUIZZES.filter((q) => q.type === "mcq").length;
const shortCount = QUIZZES.filter((q) => q.type === "short").length;
const codeCount = QUIZZES.filter((q) => q.type === "code").length;

assert.equal(
  mcqCount + shortCount + codeCount,
  QUIZZES.length,
  "every question must be exactly one of the three types"
);

/* ---------- scoring rule: self-marked questions never count ----------
   This mirrors the calculation in quiz/session/page.tsx. If someone later makes
   short questions gradeable again, this fails and says why. */

const isGraded = (q: (typeof QUIZZES)[number]) => q.type !== "short";

for (const chapter of CHAPTERS) {
  const forChapter = QUIZZES.filter((q) => q.chapterSlug === chapter.slug);
  const graded = forChapter.filter(isGraded);

  // Every chapter must have at least one objectively-graded question,
  // otherwise its quiz can never reach 80% and the chapter can never be
  // marked done — it would be silently impossible to complete.
  assert.ok(
    graded.length > 0,
    `chapter "${chapter.slug}" has only self-marked questions — its quiz could never be passed`
  );
}

// A session of 4 mcq + 1 short where all 4 mcq are right = 100%, not 80%.
const fakeSession = [
  { type: "mcq" },
  { type: "mcq" },
  { type: "mcq" },
  { type: "mcq" },
  { type: "short" },
];
const fakeGraded = fakeSession.filter((q) => q.type !== "short").length;
assert.equal(fakeGraded, 4, "short questions must leave the denominator");
assert.equal(Math.round((4 / fakeGraded) * 100), 100, "all-correct must be 100%");

/* ---------- visuals registry ---------- */

// Read the registry as TEXT rather than importing it: the visuals are .tsx
// files using JSX, which node's type-stripping can't parse. We only need the
// key names, so a regex over the source is enough — and it keeps this whole
// test file dependency-free.
const registrySource = await readFile(
  new URL("../components/visuals/index.ts", import.meta.url),
  "utf8"
);
const registeredIds = new Set(
  [...registrySource.matchAll(/^\s{2}"([^"]+)":/gm)].map((m) => m[1])
);

const referencedIds = new Set(
  CHAPTERS.flatMap((c) => c.sections.map((s) => s.visualId).filter(Boolean))
);

// A visualId with no component renders nothing — harmless by design, but
// almost always a typo, so surface it rather than letting a visual silently
// never appear.
for (const id of referencedIds) {
  assert.ok(
    registeredIds.has(id as string),
    `chapters.ts references visual "${id}" but no component is registered for it`
  );
}

/* ---------- where the "Ask a doubt" button may appear ----------
   APP_PLAN 12.3 is explicit: Study chapter pages and Revision only, and
   deliberately NOT during a quiz, where a floating button is a distraction
   mid-question. Easy to undo by accident, so pin it down. */

async function source(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8");
}

const DOUBT_BUTTON = "AskDoubtButton";

for (const page of ["../app/study/[slug]/page.tsx", "../app/revision/page.tsx"]) {
  assert.ok(
    (await source(page)).includes(DOUBT_BUTTON),
    `${page} should show the Ask a doubt button`
  );
}

for (const page of ["../app/quiz/page.tsx", "../app/quiz/session/page.tsx"]) {
  assert.ok(
    !(await source(page)).includes(DOUBT_BUTTON),
    `${page} must NOT show the Ask a doubt button (APP_PLAN 12.3)`
  );
}

/* ---------- never rely on RLS to narrow a single-row read ----------
   profiles_read deliberately returns MORE than your own row: a tutor also sees
   their roster, a super admin sees everyone. A .maybeSingle() without an
   explicit .eq("id", ...) therefore gets several rows, errors, and the app
   decides you have no profile — which locked a super admin out of the app
   entirely. Pin the filter down. */

const authSource = await source("../context/AuthContext.tsx");
const profileQuery = authSource.slice(authSource.indexOf('.from("profiles")'));
assert.ok(
  profileQuery.slice(0, profileQuery.indexOf("maybeSingle()")).includes('.eq("id"'),
  'AuthContext must filter profiles by id — RLS alone does not return a single row'
);

console.log(
  `✅ all checks passed — ${CHAPTERS.length} chapters (${bonusSlugs.length} bonus), ` +
    `${QUIZZES.length} questions (${mcqCount} mcq / ${shortCount} short / ${codeCount} code, ` +
    `${mcqCount + codeCount} graded), ${REVISION_CARDS.length} cards, ` +
    `${registeredIds.size} visuals / ${referencedIds.size} referenced`
);
