"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AskDoubtButton from "@/components/AskDoubtButton";
import AuthGuard from "@/components/AuthGuard";
import CodeBlock from "@/components/CodeBlock";
import VisualSlot from "@/components/visuals/VisualSlot";
import { useAuth } from "@/context/AuthContext";
import { getChapter, getChapterNumber } from "@/lib/content";
import { getStudyDone, markStudyDone } from "@/lib/progress";

// The folder name [slug] makes this page match ANY url like /study/loops.
// useParams() gives you whatever was in that slot: { slug: "loops" }.
export default function ChapterPage() {
  return (
    <AuthGuard allow={["student"]}>
      <ChapterContent />
    </AuthGuard>
  );
}

function ChapterContent() {
  const { user } = useAuth();
  const params = useParams();
  const slug = String(params.slug);
  const chapter = getChapter(slug);

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!user) return;
    getStudyDone(user.username).then((done) => setIsDone(done.includes(slug)));
  }, [user, slug]);

  // Someone typed a url that doesn't match any chapter.
  if (!chapter) {
    return (
      <div>
        <p className="text-gray-600">Chapter not found.</p>
        <Link href="/study" className="text-indigo-600 underline">
          ← Back to all chapters
        </Link>
      </div>
    );
  }

  async function handleMarkDone() {
    if (!user) return;
    // Show it as done immediately rather than waiting for the round trip —
    // the write is reliable and the alternative is a visibly laggy button.
    setIsDone(true);
    await markStudyDone(user.username, slug);
  }

  return (
    <>
      <Link href="/study" className="text-sm text-indigo-600 hover:underline">
        ← All chapters
      </Link>

      <h1 className="mt-3 text-3xl font-bold">
        {chapter.emoji} {chapter.title}
      </h1>
      <p className="mb-8 mt-1 text-sm text-gray-500">
        {getChapterNumber(slug) === null
          ? "Bonus chapter — not on the ICSE syllabus"
          : `Chapter ${getChapterNumber(slug)}`}{" "}
        · ~{chapter.estimatedMinutes} min read
      </p>

      <div className="space-y-6">
        {chapter.sections.map((section, index) => (
          <section
            key={index}
            className={`rounded-2xl border p-6 ${
              section.isAnalogy
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              {section.heading}
            </h2>

            {/* Infographic for this section, if one has been built.
                Unknown/missing ids render nothing — never breaks the page. */}
            <VisualSlot visualId={section.visualId} />

            {section.content && (
              <p className="leading-relaxed text-gray-700">{section.content}</p>
            )}

            {section.bullets && (
              <ul className="space-y-2">
                {section.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="text-blue-500">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Read-only syntax-highlighted editor (APP_PLAN 10.2) —
                closer to what BlueJ looks like than a plain <pre>. */}
            {section.code && <CodeBlock code={section.code} />}
          </section>
        ))}
      </div>

      <div className="mt-8">
        {isDone ? (
          <p className="rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700">
            Marked as done ✅
          </p>
        ) : (
          <button
            onClick={handleMarkDone}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Mark as Done ✅
          </button>
        )}
      </div>

      {/* Pre-tagged with the chapter being read, so the student never picks it. */}
      <AskDoubtButton chapterSlug={slug} chapterTitle={chapter.title} />
    </>
  );
}
