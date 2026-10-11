"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";

// Super Admin: every tutor on the platform, including yourself if you also
// teach. Clicking any tutor — your own row included — opens that tutor's roster
// at /tutor?id=…, which is the identical view a regular tutor sees. There is
// deliberately no separate "my students" shortcut here (APP_PLAN 11.3).
export default function AdminPage() {
  return (
    <AuthGuard allow={["super_admin"]}>
      <AdminContent />
    </AuthGuard>
  );
}

type TutorRow = { id: string; display_name: string; created_at: string };

function AdminContent() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Only a Super Admin's RLS policy returns more than their own row here.
      const { data: tutorRows } = await supabase
        .from("tutors")
        .select("id, display_name, created_at")
        .order("display_name");

      // One query for every student on the platform, counted up in JS. With a
      // handful of tutors that beats a per-tutor count query each.
      const { data: studentRows } = await supabase
        .from("profiles")
        .select("tutor_id")
        .eq("role", "student");

      if (cancelled) return;

      const tally: Record<string, number> = {};
      for (const row of studentRows ?? []) {
        const id = row.tutor_id as string | null;
        if (id) tally[id] = (tally[id] ?? 0) + 1;
      }

      setTutors((tutorRows as TutorRow[]) ?? []);
      setCounts(tally);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalStudents = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <h1 className="text-3xl font-bold">All Tutors</h1>
      <p className="mb-6 mt-1 text-gray-500">
        {isLoading
          ? "Loading…"
          : `${tutors.length} tutor${tutors.length === 1 ? "" : "s"}, ${totalStudents} student${totalStudents === 1 ? "" : "s"} across the platform`}
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {tutors.length === 0 && !isLoading ? (
          <p className="text-sm text-gray-500">No tutors yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tutors.map((tutor) => (
              <li key={tutor.id}>
                <Link
                  href={`/tutor?id=${tutor.id}`}
                  className="-mx-3 flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-gray-50"
                >
                  <span>
                    <span className="font-medium text-gray-800">
                      {tutor.display_name}
                    </span>
                    {tutor.id === user?.id && (
                      <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        you
                      </span>
                    )}
                    <span className="block text-xs text-gray-400">
                      joined {new Date(tutor.created_at).toLocaleDateString()}
                    </span>
                  </span>

                  <span className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {counts[tutor.id] ?? 0} student
                      {(counts[tutor.id] ?? 0) === 1 ? "" : "s"}
                    </span>
                    <span className="text-gray-300">›</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
