"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import InvitePanel from "@/components/InvitePanel";
import TutorDoubtsPanel from "@/components/TutorDoubtsPanel";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { CORE_TOTAL } from "@/lib/content";
import {
  formatDuration,
  formatLastActive,
  loadStats,
  QUIZ_PERCENT_FOOTNOTE,
  type StudentStats,
} from "@/lib/stats";

// The roster view. A Super Admin opens someone else's roster with ?id=<tutorId>
// — it is the SAME view a regular tutor sees, per APP_PLAN 11.3, rather than a
// separate admin-only screen.
export default function TutorPage() {
  return (
    <AuthGuard allow={["tutor", "super_admin"]}>
      <Suspense fallback={<p className="text-gray-400">Loading…</p>}>
        <TutorContent />
      </Suspense>
    </AuthGuard>
  );
}

type Student = { id: string; display_name: string; created_at: string };

// A compact "4 / 16" plus a thin bar — a full ProgressBar is too tall for a
// table row and its own label would be redundant against the column heading.
function Meter({
  done,
  percent,
  colour,
}: {
  done: number;
  percent: number;
  colour: string;
}) {
  return (
    <div className="w-24">
      <span className="text-xs text-gray-600">
        {done} / {CORE_TOTAL}
      </span>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full ${colour}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function TutorContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // No ?id means "my own roster".
  const viewingId = searchParams.get("id") ?? user?.id ?? null;
  const isOwnRoster = viewingId === user?.id;

  const [tutorName, setTutorName] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Map<string, StudentStats>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !viewingId) return;
    let cancelled = false;

    async function load() {
      const [{ data: tutorRow }, { data: roster }] = await Promise.all([
        supabase
          .from("tutors")
          .select("display_name, invite_code")
          .eq("id", viewingId!)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("id, display_name, created_at")
          .eq("tutor_id", viewingId!)
          .order("display_name"),
      ]);

      if (cancelled) return;
      setTutorName(tutorRow?.display_name ?? null);
      setInviteCode(tutorRow?.invite_code ?? null);

      const list = (roster as Student[]) ?? [];
      setStudents(list);
      setStats(await loadStats(list.map((s) => s.id)));
      if (!cancelled) setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, viewingId]);

  if (!user) return null;

  return (
    <>
      {!isOwnRoster && (
        <Link href="/admin" className="text-sm text-indigo-600 hover:underline">
          ← All tutors
        </Link>
      )}

      <h1 className="mt-2 text-3xl font-bold">
        {isOwnRoster ? "My Students" : `${tutorName ?? "Tutor"}'s students`}
      </h1>
      <p className="mb-6 mt-1 text-gray-500">
        {isLoading
          ? "Loading…"
          : `${students.length} student${students.length === 1 ? "" : "s"}`}
      </p>

      {/* Only offer the invite tools on your own roster — a Super Admin looking
          at someone else's shouldn't be handing out that tutor's code. */}
      {isOwnRoster && (
        <div className="mb-6">
          <InvitePanel kind="student" code={inviteCode} ownerId={user.id} />
        </div>
      )}

      {/* Doubts above the roster: an unanswered question is more urgent than
          a progress percentage. */}
      <div className="mb-6">
        <TutorDoubtsPanel students={students} canReply={isOwnRoster} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Roster</h2>

        {students.length === 0 ? (
          <p className="text-sm text-gray-500">
            {isOwnRoster
              ? "Nobody has joined yet. Share your code above and students appear here as soon as they sign in."
              : "This tutor has no students yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="pb-2 pr-4 font-semibold">Student</th>
                  <th className="pb-2 pr-4 font-semibold">Chapters</th>
                  <th className="pb-2 pr-4 font-semibold">Quizzes passed</th>
                  <th className="pb-2 pr-4 font-semibold">Today</th>
                  <th className="pb-2 pr-4 font-semibold">7-day avg</th>
                  <th className="pb-2 font-semibold">Last active</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const s = stats.get(student.id);
                  return (
                    <tr key={student.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-800">
                        {student.display_name}
                      </td>
                      <td className="py-3 pr-4">
                        <Meter
                          done={s?.chaptersStudied ?? 0}
                          percent={s?.chaptersPercent ?? 0}
                          colour="bg-blue-500"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <Meter
                          done={s?.quizzesPassed ?? 0}
                          percent={s?.quizPercent ?? 0}
                          colour="bg-amber-500"
                        />
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {formatDuration(s?.secondsToday ?? 0)}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {formatDuration(s?.secondsPerDay7 ?? 0)}
                      </td>
                      <td className="py-3 text-gray-500">
                        {formatLastActive(s?.lastActive ?? null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && (
          <p className="mt-4 text-xs text-gray-400">{QUIZ_PERCENT_FOOTNOTE}</p>
        )}
      </div>
    </>
  );
}
