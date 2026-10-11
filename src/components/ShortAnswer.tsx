"use client";

import { useState } from "react";
import type { ShortQuestion } from "@/lib/content";

// Section A Q2 style: expression evaluation, code tracing, "differentiate X and Y".
//
// WHY no automatic marking here (unlike code questions): a correct answer can be
// phrased many valid ways — "it stores 5" and "the value 5 is assigned" are both
// right. Diffing text would fail honest answers and teach the student to guess
// wording instead of understanding. So the student marks themselves, exactly
// like flipping a revision flashcard and being honest about whether they knew it.
//
// The self-mark is worth the same as any other question: one right or wrong.
export default function ShortAnswer({
  question,
  selfMark,
  onSelfMark,
}: {
  question: ShortQuestion;
  selfMark: boolean | null; // null = not marked yet
  onSelfMark: (wasRight: boolean) => void;
}) {
  const [typed, setTyped] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const hasMarked = selfMark !== null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {question.prompt}
      </h2>

      <label className="mb-1 block text-sm font-medium text-gray-600">
        Your answer
      </label>
      <textarea
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        readOnly={isRevealed}
        rows={4}
        placeholder="Write your answer here, then reveal the model answer to compare…"
        className="w-full rounded-xl border border-gray-300 p-3 font-mono text-sm outline-none focus:border-indigo-500 read-only:bg-gray-50"
      />

      {!isRevealed && (
        <button
          onClick={() => setIsRevealed(true)}
          className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
          disabled={typed.trim().length === 0}
        >
          Reveal answer
        </button>
      )}

      {isRevealed && (
        <div className="mt-5 space-y-4">
          {/* Side by side on wide screens, stacked on a phone. */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Your answer
              </p>
              <p className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                {typed}
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-green-600">
                Model answer
              </p>
              <p className="whitespace-pre-wrap font-mono text-sm text-green-900">
                {question.modelAnswer}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-sm text-indigo-800">{question.explanation}</p>
          </div>

          {!hasMarked ? (
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="mb-3 font-semibold text-gray-800">
                Did you get it right?
              </p>
              <p className="mb-3 text-sm text-gray-500">
                This is for your own tracking — self-marked answers don&apos;t
                count towards the chapter score, so answer honestly and use it to
                spot what still needs a re-read.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onSelfMark(true)}
                  className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
                >
                  I got it right ✅
                </button>
                <button
                  onClick={() => onSelfMark(false)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  I got it wrong ❌
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`rounded-xl px-4 py-3 font-semibold ${
                selfMark
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {selfMark ? "Marked correct ✅" : "Marked incorrect — worth a re-read 📖"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
