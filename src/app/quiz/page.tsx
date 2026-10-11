"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { CHAPTERS } from "@/data/chapters";
import {
  CORE_TOTAL,
  countQuestionsByType,
  countQuestionsFor,
  isCoreChapter,
} from "@/lib/content";
import { getQuizScores, PASS_MARK } from "@/lib/progress";

export default function QuizHomePage() {
  return (
    <AuthGuard allow={["student"]}>
      <QuizHomeContent />
    </AuthGuard>
  );
}

function QuizHomeContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string[]>([]); // for mixed mode

  useEffect(() => {
    if (!user) return;
    getQuizScores(user.username).then(setScores);
  }, [user]);

  function toggleSelected(slug: string) {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug]
    );
  }

  // The chosen chapters travel to the session page in the URL, e.g.
  //   /quiz/session?chapters=loops,arrays-1d
  // No global state needed, and the URL is shareable/refreshable.
  function startSingle(slug: string) {
    router.push(`/quiz/session?chapters=${slug}`);
  }

  function startMixed() {
    router.push(`/quiz/session?chapters=${selected.join(",")}`);
  }

  const passedCount = Object.entries(scores).filter(
    ([slug, score]) => isCoreChapter(slug) && score >= PASS_MARK
  ).length;

  return (
    <>
      <h1 className="text-3xl font-bold">✏️ Quizzes</h1>
      <p className="mb-8 mt-1 text-gray-500">
        {passedCount} of {CORE_TOTAL} syllabus quizzes passed. Single-chapter
        quizzes count towards progress ({PASS_MARK}% to pass); mixed mode is
        practice only and never saved.
      </p>

      <h2 className="mb-3 text-lg font-bold">By chapter</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        {CHAPTERS.map((chapter) => {
          const score = scores[chapter.slug];
          const passed = (score ?? 0) >= PASS_MARK;

          return (
            <button
              key={chapter.slug}
              onClick={() => startSingle(chapter.slug)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-amber-400 hover:shadow-sm"
            >
              <span className="text-2xl">{chapter.emoji}</span>

              <span className="flex-1">
                <span className="block font-medium">
                  {chapter.title}
                  {chapter.isBonus && (
                    <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                      Bonus
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {countQuestionsFor(chapter.slug)} questions
                  {countQuestionsByType(chapter.slug).short > 0 &&
                    ` · ${countQuestionsByType(chapter.slug).short} written ✍️`}
                  {countQuestionsByType(chapter.slug).code > 0 &&
                    ` · ${countQuestionsByType(chapter.slug).code} to code 💻`}
                </span>
              </span>

              {score === undefined ? (
                <span className="text-xs text-gray-400">Not attempted</span>
              ) : (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    passed
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Best {score}% {passed ? "✅" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <h2 className="mb-1 text-lg font-bold">Mixed mode</h2>
      <p className="mb-3 text-sm text-gray-500">
        Pick two or more chapters — questions get shuffled together.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {CHAPTERS.map((chapter) => (
          <button
            key={chapter.slug}
            onClick={() => toggleSelected(chapter.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              selected.includes(chapter.slug)
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-300 bg-white text-gray-600"
            }`}
          >
            {chapter.emoji} {chapter.title}
          </button>
        ))}
      </div>

      <button
        onClick={startMixed}
        disabled={selected.length === 0}
        className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Start mixed quiz ({selected.length} selected)
      </button>
    </>
  );
}
