"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { PAPERS } from "@/data/papers";
import { getPapersDone, togglePaperDone } from "@/lib/progress";

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

export default function PapersPage() {
  return (
    <AuthGuard>
      <PapersContent />
    </AuthGuard>
  );
}

function PapersContent() {
  const { user } = useAuth();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (user) setDone(getPapersDone(user.username));
  }, [user]);

  function handleToggle(id: string) {
    if (!user) return;
    togglePaperDone(user.username, id);
    setDone(getPapersDone(user.username)); // re-read so the screen matches storage
  }

  return (
    <>
      <h1 className="text-3xl font-bold">📄 Old Papers</h1>
      <p className="mb-6 mt-1 text-gray-500">
        {done.length} of {PAPERS.length} attempted. PDFs get added later — the
        links are placeholders for now.
      </p>

      <div className="space-y-3">
        {PAPERS.map((paper) => (
          <div
            key={paper.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-bold">ICSE {paper.year}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLE[paper.difficulty]}`}
            >
              {paper.difficulty}
            </span>

            <a
              href={paper.pdfUrl}
              className="text-sm text-emerald-600 hover:underline"
            >
              Open PDF ↗
            </a>

            <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={done.includes(paper.id)}
                onChange={() => handleToggle(paper.id)}
                className="h-4 w-4 accent-emerald-600"
              />
              I have attempted this
            </label>
            </div>

            {/* Only some years have a note (e.g. 2022's two-semester format). */}
            {paper.note && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                ℹ️ {paper.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
