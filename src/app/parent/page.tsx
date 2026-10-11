"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import ProgressBar from "@/components/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { CHAPTERS } from "@/data/chapters";
import { CORE_TOTAL } from "@/lib/content";
import { PASS_MARK } from "@/lib/progress";
import {
  formatDuration,
  formatLastActive,
  loadStats,
  QUIZ_PERCENT_FOOTNOTE,
  type StudentStats,
} from "@/lib/stats";

// Read-only view of exactly one student (APP_PLAN 11.5). No editing controls,
// no quiz content, and — per 12.2 — no sight of the doubts table at all.
export default function ParentPage() {
  return (
    <AuthGuard allow={["parent"]}>
      <ParentContent />
    </AuthGuard>
  );
}

type RecentRow = { chapter_slug: string; studied: boolean; quiz_best_score: number; last_active: string };

function ParentContent() {
  const { user } = useAuth();
  const [childName, setChildName] = useState<string | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const childId = user?.parentOf;
    if (!childId) return;
    let cancelled = false;

    async function load() {
      // RLS lets a parent read exactly one profile row and that student's
      // progress — querying anything else simply returns nothing.
      const [{ data: child }, statsMap, { data: rows }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", childId!).maybeSingle(),
        loadStats([childId!]),
        supabase
          .from("progress")
          .select("chapter_slug, studied, quiz_best_score, last_active")
          .eq("student_id", childId!)
          .order("last_active", { ascending: false })
          .limit(6),
      ]);

      if (cancelled) return;
      setChildName(child?.display_name ?? null);
      setStats(statsMap.get(childId!) ?? null);
      setRecent((rows as RecentRow[]) ?? []);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const titleFor = (slug: string) =>
    CHAPTERS.find((c) => c.slug === slug)?.title ?? slug;

  if (isLoading) {
    return <p className="text-gray-400">Loading…</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold">
        {childName ? `${childName}'s progress` : "Progress"}
      </h1>
      <p className="mb-6 mt-1 text-gray-500">
        A read-only view. Last active: {formatLastActive(stats?.lastActive ?? null)}.
      </p>

      <div className="mb-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
        <ProgressBar
          label="Chapters studied"
          done={stats?.chaptersStudied ?? 0}
          total={CORE_TOTAL}
          colour="bg-blue-500"
        />
        <ProgressBar
          label={`Quizzes passed (${PASS_MARK}%+)`}
          done={stats?.quizzesPassed ?? 0}
          total={CORE_TOTAL}
          colour="bg-amber-500"
        />
        {/* APP_PLAN 11.5 asks for this specifically, next to the quiz figure:
            a parent should not read a lower % as missed work. */}
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
          ℹ️ {QUIZ_PERCENT_FOOTNOTE}
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Time spent today</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatDuration(stats?.secondsToday ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">7-day daily average</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatDuration(stats?.secondsPerDay7 ?? 0)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Averaged over all 7 days, including days with no study.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">Nothing recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((row) => (
              <li
                key={row.chapter_slug}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <span className="font-medium text-gray-800">
                  {titleFor(row.chapter_slug)}
                </span>
                <span className="flex items-center gap-2 text-xs">
                  {row.studied && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">
                      Studied
                    </span>
                  )}
                  {row.quiz_best_score > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        row.quiz_best_score >= PASS_MARK
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      Quiz {row.quiz_best_score}%
                    </span>
                  )}
                  <span className="text-gray-400">
                    {formatLastActive(row.last_active)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
