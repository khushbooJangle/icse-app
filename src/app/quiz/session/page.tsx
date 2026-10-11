"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import QuizQuestion from "@/components/QuizQuestion";
import CodeAnswer from "@/components/CodeAnswer";
import ShortAnswer from "@/components/ShortAnswer";
import { useAuth } from "@/context/AuthContext";
import type { QuizQuestion as QuizQuestionType } from "@/data/quizzes";
import { getChapter, getQuestionsForChapters } from "@/lib/content";
import type { CodeCheckResult } from "@/lib/codeCheck";
import { PASS_MARK, saveQuizScore } from "@/lib/progress";

// Fisher-Yates shuffle. Copies the array first so the original data is untouched.
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizSessionPage() {
  return (
    <AuthGuard allow={["student"]}>
      {/* useSearchParams needs a <Suspense> boundary in the App Router.
          Next.js refuses to build without it. */}
      <Suspense fallback={<p className="text-gray-400">Loading quiz…</p>}>
        <QuizSessionContent />
      </Suspense>
    </AuthGuard>
  );
}

function QuizSessionContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // "?chapters=loops,arrays-1d" → ["loops", "arrays-1d"]
  const chaptersParam = searchParams.get("chapters") ?? "";
  const slugs = chaptersParam.split(",").filter(Boolean);
  const isMixed = slugs.length > 1;

  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  // Each question type records "answered" differently:
  //   mcq   -> which option was picked
  //   code  -> the line-diff result
  //   short -> what the student marked themselves
  const [codeResult, setCodeResult] = useState<CodeCheckResult | null>(null);
  const [selfMark, setSelfMark] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Shuffle in useEffect, not during render: Math.random() during render would
  // give the server and the browser different orders (a hydration mismatch).
  useEffect(() => {
    setQuestions(shuffle(getQuestionsForChapters(slugs)));
    // chaptersParam (a string) is a stable dependency; slugs is a new array every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersParam]);

  if (questions.length === 0) {
    return (
      <div>
        <p className="mb-3 text-gray-600">No questions found for this selection.</p>
        <Link href="/quiz" className="text-indigo-600 underline">
          ← Back to quiz home
        </Link>
      </div>
    );
  }

  // SCORING RULE (APP_PLAN 10.2): only objectively-graded questions count.
  // "short" questions are self-marked, so a student could unlock "chapter done"
  // just by claiming they were right. They stay fully visible and practiceable
  // and still show ✅/❌ feedback — they simply don't move the score, which
  // means they're excluded from the denominator as well as the numerator.
  const gradedQuestions = questions.filter((q) => q.type !== "short");
  const gradedTotal = gradedQuestions.length;
  const score =
    gradedTotal === 0 ? 0 : Math.round((correctCount / gradedTotal) * 100);

  const shortCount = questions.length - gradedTotal;
  const current = questions[index];

  // MCQ path: student clicked an option.
  function handlePick(optionIndex: number) {
    setPicked(optionIndex);
    // Inside this branch TypeScript knows `current` is an McqQuestion,
    // so correctIndex is safe to read.
    if (current.type === "mcq" && optionIndex === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  // Code path: student pressed "Check my answer".
  // A code question scores exactly like an MCQ — one right or wrong — so it
  // flows into the same correctCount and the same saveQuizScore call.
  function handleCodeCheck(result: CodeCheckResult) {
    setCodeResult(result);
    if (result.isCorrect) {
      setCorrectCount((c) => c + 1);
    }
  }

  // Short path: student judged their own answer against the model answer.
  // Deliberately does NOT touch correctCount — see the scoring rule above.
  // It only records the mark so the UI can show ✅/❌ back to the student.
  function handleSelfMark(wasRight: boolean) {
    setSelfMark(wasRight);
  }

  async function handleNext() {
    const isLastQuestion = index === questions.length - 1;

    if (!isLastQuestion) {
      setIndex(index + 1);
      setPicked(null);
      setCodeResult(null);
      setSelfMark(null);
      return;
    }

    // Last question answered. correctCount is already up to date here: the pick
    // happened in an earlier click, so React has re-rendered since then.
    // Two reasons we might not save:
    //   - mixed mode is practice only
    //   - a session of nothing but self-marked questions has no real score
    if (!isMixed && user && gradedTotal > 0) {
      // Record WHICH auto-graded types made up this score, so a parent or tutor
      // can see the mix behind the percentage (APP_PLAN 11.4).
      await saveQuizScore(user.username, slugs[0], score, {
        mcq: gradedQuestions.filter((q) => q.type === "mcq").length,
        code: gradedQuestions.filter((q) => q.type === "code").length,
      });
    }
    setIsFinished(true);
  }

  function handleRetry() {
    setQuestions(shuffle(questions));
    setIndex(0);
    setPicked(null);
    setCodeResult(null);
    setSelfMark(null);
    setCorrectCount(0);
    setIsFinished(false);
  }

  if (isFinished) {
    const passed = score >= PASS_MARK;
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="text-5xl">{passed ? "🎉" : "💪"}</div>
        <h1 className="mt-3 text-2xl font-bold">
          {correctCount} / {gradedTotal} correct
        </h1>
        <p
          className={`mt-1 text-4xl font-bold ${
            passed ? "text-green-600" : "text-amber-600"
          }`}
        >
          {score}%
        </p>

        <p className="mt-4 text-sm text-gray-600">
          {isMixed
            ? "Mixed mode is practice only — this score isn't saved."
            : passed
              ? "Passed! This chapter is marked done ✅"
              : `You need ${PASS_MARK}% to mark this chapter done. Your best score is kept, so a retake can only help.`}
        </p>

        {/* Be explicit about why the totals don't match the question count,
            otherwise "8 / 10" after answering 12 questions looks like a bug. */}
        {shortCount > 0 && (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            {shortCount} short-answer question{shortCount > 1 ? "s" : ""}{" "}
            {shortCount > 1 ? "were" : "was"} practice only — self-marked answers
            don&apos;t count towards the score.
          </p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleRetry}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <Link
            href="/quiz"
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to quiz home
          </Link>
        </div>
      </div>
    );
  }

  const chapterTitle = isMixed
    ? "Mixed practice"
    : (getChapter(slugs[0])?.title ?? "Quiz");

  // "Has this question been answered?" means something different for each of
  // the three types, so work it out once and reuse it for the Next button.
  let hasAnswered = false;
  if (current.type === "mcq") hasAnswered = picked !== null;
  else if (current.type === "short") hasAnswered = selfMark !== null;
  else hasAnswered = codeResult !== null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-semibold text-gray-700">
          {chapterTitle}
          {current.type === "code" && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Write a program
            </span>
          )}
          {current.type === "short" && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              Short answer · practice
            </span>
          )}
        </span>
        <span className="text-sm text-gray-500">
          Q {index + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-amber-500 transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* The two question types render completely differently. Checking
          `current.type` lets TypeScript narrow the union, so each component
          receives exactly the shape it expects. */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {current.type === "mcq" && (
          <QuizQuestion
            question={current}
            pickedIndex={picked}
            onPick={handlePick}
          />
        )}

        {current.type === "short" && (
          // key forces a fresh box per question, so the previous answer
          // doesn't linger when moving on.
          <ShortAnswer
            key={index}
            question={current}
            selfMark={selfMark}
            onSelfMark={handleSelfMark}
          />
        )}

        {current.type === "code" && (
          <CodeAnswer
            key={index}
            question={current}
            result={codeResult}
            onCheck={handleCodeCheck}
          />
        )}
      </div>

      {hasAnswered && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-xl bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600"
        >
          {index === questions.length - 1 ? "See my score →" : "Next question →"}
        </button>
      )}
    </div>
  );
}
