import Link from "next/link";
import type { Chapter } from "@/data/chapters";
import { getChapterNumber } from "@/lib/content";

export default function ChapterCard({
  chapter,
  isDone,
}: {
  chapter: Chapter;
  isDone: boolean;
}) {
  // Syllabus chapters get a number; bonus chapters get a "Bonus" label instead,
  // so the numbering stays 1..16 and matches the ICSE syllabus order.
  const number = getChapterNumber(chapter.slug);

  return (
    <Link
      href={`/study/${chapter.slug}`}
      className={`block rounded-xl border bg-white p-5 transition hover:shadow-md ${
        chapter.isBonus
          ? "border-purple-200 hover:border-purple-400"
          : "border-gray-200 hover:border-blue-400"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <span className="text-3xl">{chapter.emoji}</span>
        {isDone ? (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            Done ✅
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
            Not started
          </span>
        )}
      </div>

      {number === null ? (
        <p className="text-xs font-semibold text-purple-500">
          Bonus · not in syllabus
        </p>
      ) : (
        <p className="text-xs font-semibold text-blue-500">Chapter {number}</p>
      )}

      <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
      <p className="mt-1 text-sm text-gray-500">
        ~{chapter.estimatedMinutes} min read
      </p>
    </Link>
  );
}
