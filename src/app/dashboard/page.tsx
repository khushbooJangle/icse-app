"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import ProgressBar from "@/components/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { PAPERS } from "@/data/papers";
import { CORE_TOTAL, countCore, isCoreChapter } from "@/lib/content";
import {
  getPapersDone,
  getQuizScores,
  getStudyDone,
  PASS_MARK,
} from "@/lib/progress";

const SECTIONS = [
  { href: "/study", emoji: "📚", title: "Study", blurb: "Learn with analogies", colour: "hover:border-blue-400" },
  { href: "/quiz", emoji: "✏️", title: "Quizzes", blurb: "Test what you know", colour: "hover:border-amber-400" },
  { href: "/papers", emoji: "📄", title: "Old Papers", blurb: "Practice real exams", colour: "hover:border-emerald-400" },
  { href: "/revision", emoji: "🔁", title: "Revision", blurb: "Quick flashcard review", colour: "hover:border-purple-400" },
];

// The page component is thin: it only supplies the AuthGuard wrapper.
// The real content is a separate component so it can safely assume a user exists.
export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  // WHY read progress inside useEffect instead of directly in the component:
  // localStorage only exists in the browser. Reading it during the first render
  // would make the server and browser disagree ("hydration error"). useEffect
  // runs only in the browser, after the first render — which is exactly right.
  const [studyDone, setStudyDone] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [papersDone, setPapersDone] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setStudyDone(getStudyDone(user.username));
    setQuizScores(getQuizScores(user.username));
    setPapersDone(getPapersDone(user.username));
  }, [user]);

  // Bonus chapters are excluded from both counts — see lib/content.ts for why.
  const studyDoneCount = countCore(studyDone);
  const quizzesPassed = Object.entries(quizScores).filter(
    ([slug, score]) => isCoreChapter(slug) && score >= PASS_MARK
  ).length;

  const stats: Record<string, string> = {
    "/study": `${studyDoneCount} / ${CORE_TOTAL} chapters done`,
    "/quiz": `${quizzesPassed} / ${CORE_TOTAL} quizzes passed`,
    "/papers": `${papersDone.length} / ${PAPERS.length} papers attempted`,
    "/revision": `${studyDone.length} cards ready`,
  };

  return (
    <>
      <h1 className="text-3xl font-bold">
        Hey {user?.displayName} 👋 Let&apos;s get that 85%!
      </h1>

      <div className="my-8 space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
        <ProgressBar
          label="Study progress"
          done={studyDoneCount}
          total={CORE_TOTAL}
          colour="bg-blue-500"
        />
        <ProgressBar
          label={`Quiz progress (${PASS_MARK}%+ to pass)`}
          done={quizzesPassed}
          total={CORE_TOTAL}
          colour="bg-amber-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-md ${section.colour}`}
          >
            <div className="text-4xl">{section.emoji}</div>
            <h2 className="mt-3 text-xl font-bold">{section.title}</h2>
            <p className="text-sm text-gray-500">{section.blurb}</p>
            <p className="mt-3 text-sm font-medium text-gray-700">
              {stats[section.href]}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
