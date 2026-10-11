"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import ChapterCard from "@/components/ChapterCard";
import { useAuth } from "@/context/AuthContext";
import { BONUS_CHAPTERS, CORE_CHAPTERS, CORE_TOTAL, countCore } from "@/lib/content";
import { getStudyDone } from "@/lib/progress";

export default function StudyPage() {
  return (
    <AuthGuard allow={["student"]}>
      <StudyContent />
    </AuthGuard>
  );
}

function StudyContent() {
  const { user } = useAuth();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    // Reading progress is a network call now, so it can't happen inline —
    // declare an async function inside the effect and call it.
    if (!user) return;
    getStudyDone(user.username).then(setDone);
  }, [user]);

  return (
    <>
      <h1 className="text-3xl font-bold">📚 Study</h1>
      <p className="mb-6 mt-1 text-gray-500">
        {countCore(done)} of {CORE_TOTAL} syllabus chapters done
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_CHAPTERS.map((chapter) => (
          <ChapterCard
            key={chapter.slug}
            chapter={chapter}
            isDone={done.includes(chapter.slug)}
          />
        ))}
      </div>

      {/* Bonus chapters sit below the syllabus ones so it's obvious they're extra. */}
      {BONUS_CHAPTERS.length > 0 && (
        <>
          <h2 className="mb-1 mt-10 text-xl font-bold">✨ Bonus</h2>
          <p className="mb-4 text-sm text-gray-500">
            Not on the ICSE Class 10 syllabus — read it for interest. It doesn&apos;t
            count towards your progress.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BONUS_CHAPTERS.map((chapter) => (
              <ChapterCard
                key={chapter.slug}
                chapter={chapter}
                isDone={done.includes(chapter.slug)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
