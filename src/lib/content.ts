// Lookup helpers and the "core vs bonus" rule.
//
// WHY this file exists: src/data/*.ts holds pure content and is replaced
// wholesale whenever new content is written. Keeping helpers OUT of those files
// means a content update is a plain copy-paste, with nothing to merge by hand.

import { CHAPTERS, type Chapter } from "@/data/chapters";
import { QUIZZES, type QuizQuestion } from "@/data/quizzes";
import { REVISION_CARDS, type RevisionCard } from "@/data/revision";

// Bonus chapters (currently just Stack & Queue) are shown in Study and Quiz,
// and can be marked done — but they are NOT part of the ICSE Class 10 syllabus,
// so they must never count towards the progress percentages. Otherwise the bar
// could read "17 of 16" or stall below 100% after finishing the real syllabus.
export const CORE_CHAPTERS: Chapter[] = CHAPTERS.filter((c) => !c.isBonus);
export const BONUS_CHAPTERS: Chapter[] = CHAPTERS.filter((c) => c.isBonus);
export const CORE_TOTAL = CORE_CHAPTERS.length;

const CORE_SLUGS = new Set(CORE_CHAPTERS.map((c) => c.slug));

export function isCoreChapter(slug: string): boolean {
  return CORE_SLUGS.has(slug);
}

// Given a list of done slugs, count only the syllabus ones.
export function countCore(slugs: string[]): number {
  return slugs.filter((slug) => CORE_SLUGS.has(slug)).length;
}

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

// Chapters are numbered 1..16 across the syllabus only; a bonus chapter has no
// number, so the card shows a "Bonus" badge instead.
export function getChapterNumber(slug: string): number | null {
  const index = CORE_CHAPTERS.findIndex((c) => c.slug === slug);
  return index === -1 ? null : index + 1;
}

export function getQuestionsForChapters(slugs: string[]): QuizQuestion[] {
  return QUIZZES.filter((q) => slugs.includes(q.chapterSlug));
}

export function countQuestionsFor(slug: string): number {
  return QUIZZES.filter((q) => q.chapterSlug === slug).length;
}

export function getRevisionCard(slug: string): RevisionCard | undefined {
  return REVISION_CARDS.find((card) => card.chapterSlug === slug);
}
