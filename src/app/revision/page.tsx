"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AskDoubtButton from "@/components/AskDoubtButton";
import AuthGuard from "@/components/AuthGuard";
import Flashcard from "@/components/Flashcard";
import { useAuth } from "@/context/AuthContext";
import { getChapter, getRevisionCard } from "@/lib/content";
import { getStudyDone } from "@/lib/progress";

export default function RevisionPage() {
  return (
    <AuthGuard allow={["student"]}>
      <RevisionContent />
    </AuthGuard>
  );
}

function RevisionContent() {
  const { user } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isDoneRevising, setIsDoneRevising] = useState(false);

  // Only revise chapters already marked done in Study.
  useEffect(() => {
    if (!user) return;
    getStudyDone(user.username).then(setSlugs);
  }, [user]);

  // useCallback so these keep the same identity between renders — the keyboard
  // useEffect below depends on them and would otherwise re-subscribe every render.
  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, slugs.length - 1));
  }, [slugs.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Left/right arrow keys move between cards.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    // Always clean up listeners, or they pile up every time you visit the page.
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (slugs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="text-4xl">🔁</div>
        <h1 className="mt-3 text-xl font-bold">Complete some chapters first!</h1>
        <p className="mt-1 text-gray-500">
          Flashcards appear here once you mark a chapter as done in Study.
        </p>
        <Link
          href="/study"
          className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700"
        >
          Go to Study
        </Link>
      </div>
    );
  }

  if (isDoneRevising) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="text-4xl">✅</div>
        <h1 className="mt-3 text-xl font-bold">Revision done!</h1>
        <button
          onClick={() => {
            setIndex(0);
            setIsDoneRevising(false);
          }}
          className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700"
        >
          Revise again
        </button>
      </div>
    );
  }

  const slug = slugs[index];
  const card = getRevisionCard(slug);
  const title = getChapter(slug)?.title ?? slug;
  const isLast = index === slugs.length - 1;

  if (!card) return <p className="text-gray-500">No flashcard for this chapter yet.</p>;

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-4 text-center text-sm text-gray-500">
        Card {index + 1} of {slugs.length} · use ← → keys
      </p>

      <Flashcard card={card} title={title} />

      {/* Progress dots */}
      <div className="mt-5 flex justify-center gap-2">
        {slugs.map((s, i) => (
          <span
            key={s}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-purple-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={() => setIsDoneRevising(true)}
            className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            Done revising ✅
          </button>
        ) : (
          <button
            onClick={goNext}
            className="rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700"
          >
            Next →
          </button>
        )}
      </div>

      {/* Tagged with whichever card is on screen right now, so a doubt raised
          mid-revision lands on the right chapter. */}
      <AskDoubtButton chapterSlug={slug} chapterTitle={title} />
    </div>
  );
}
