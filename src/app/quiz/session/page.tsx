"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import QuizQuestion from "@/components/QuizQuestion";
import { useAuth } from "@/context/AuthContext";
import type { QuizQuestion as QuizQuestionType } from "@/data/quizzes";
import { getChapter, getQuestionsForChapters } from "@/lib/content";
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
    <AuthGuard>
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

  const score = Math.round((correctCount / questions.length) * 100);

  function handlePick(optionIndex: number) {
    setPicked(optionIndex);
    if (optionIndex === questions[index].correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    const isLastQuestion = index === questions.length - 1;

    if (!isLastQuestion) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }

    // Last question answered. correctCount is already up to date here: the pick
    // happened in an earlier click, so React has re-rendered since then.
    // Mixed mode is practice only — it never writes to progress.
    if (!isMixed && user) {
      saveQuizScore(user.username, slugs[0], score);
    }
    setIsFinished(true);
  }

  function handleRetry() {
    setQuestions(shuffle(questions));
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setIsFinished(false);
  }

  if (isFinished) {
    const passed = score >= PASS_MARK;
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="text-5xl">{passed ? "🎉" : "💪"}</div>
        <h1 className="mt-3 text-2xl font-bold">
          {correctCount} / {questions.length} correct
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-semibold text-gray-700">{chapterTitle}</span>
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <QuizQuestion
          question={questions[index]}
          pickedIndex={picked}
          onPick={handlePick}
        />
      </div>

      {picked !== null && (
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
