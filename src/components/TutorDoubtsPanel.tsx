"use client";

import { useCallback, useEffect, useState } from "react";
import { CHAPTERS } from "@/data/chapters";
import {
  isOpenish,
  listDoubtsForStudents,
  replyToDoubt,
  STATUS_LABEL,
  STATUS_STYLE,
  type Doubt,
} from "@/lib/doubts";

// The tutor's "Open Doubts" panel on the roster dashboard (APP_PLAN 12.3).
//
// Grouped per student, counting `open` + `discuss` — the two states that still
// need something from the tutor. Resolved ones collapse into a history toggle
// rather than disappearing.
export default function TutorDoubtsPanel({
  students,
  canReply,
}: {
  students: { id: string; display_name: string }[];
  /** False when a Super Admin is looking at someone else's roster — read only. */
  canReply: boolean;
}) {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const studentKey = students.map((s) => s.id).join(",");

  const load = useCallback(async () => {
    const ids = studentKey ? studentKey.split(",") : [];
    setDoubts(await listDoubtsForStudents(ids));
    setIsLoading(false);
  }, [studentKey]);

  useEffect(() => {
    load();
  }, [load]);

  const nameFor = (id: string) =>
    students.find((s) => s.id === id)?.display_name ?? "Student";
  const titleFor = (slug: string) =>
    CHAPTERS.find((c) => c.slug === slug)?.title ?? slug;

  const needsAttention = doubts.filter((d) => isOpenish(d.status));
  const resolved = doubts.filter((d) => d.status === "resolved");

  // Per-student counts for the summary line.
  const perStudent = students
    .map((s) => ({
      ...s,
      count: needsAttention.filter((d) => d.student_id === s.id).length,
    }))
    .filter((s) => s.count > 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-400">
        Loading doubts…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">
          Open Doubts
          {needsAttention.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-700">
              {needsAttention.length}
            </span>
          )}
        </h2>
        {resolved.length > 0 && (
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {showHistory ? "Hide" : "Show"} history ({resolved.length})
          </button>
        )}
      </div>

      {perStudent.length > 0 && (
        <p className="mb-4 text-sm text-gray-500">
          {perStudent.map((s, i) => (
            <span key={s.id}>
              {i > 0 && " · "}
              <span className="font-medium text-gray-700">{s.display_name}</span>{" "}
              {s.count}
            </span>
          ))}
        </p>
      )}

      {needsAttention.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nothing outstanding. Doubts your students raise while studying appear
          here.
        </p>
      ) : (
        <div className="space-y-4">
          {needsAttention.map((doubt) => (
            <DoubtRow
              key={doubt.id}
              doubt={doubt}
              studentName={nameFor(doubt.student_id)}
              chapterTitle={titleFor(doubt.chapter_slug)}
              canReply={canReply}
              onReplied={load}
            />
          ))}
        </div>
      )}

      {showHistory && resolved.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
          {resolved.map((doubt) => (
            <DoubtRow
              key={doubt.id}
              doubt={doubt}
              studentName={nameFor(doubt.student_id)}
              chapterTitle={titleFor(doubt.chapter_slug)}
              canReply={false}
              onReplied={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DoubtRow({
  doubt,
  studentName,
  chapterTitle,
  canReply,
  onReplied,
}: {
  doubt: Doubt;
  studentName: string;
  chapterTitle: string;
  canReply: boolean;
  onReplied: () => void;
}) {
  const [reply, setReply] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setError("");
    setIsSaving(true);
    try {
      const { error: replyError } = await replyToDoubt(doubt.id, reply);
      if (replyError) {
        setError(replyError);
        return;
      }
      setReply("");
      onReplied();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm">
          <span className="font-semibold text-gray-800">{studentName}</span>
          <span className="text-gray-400"> · {chapterTitle}</span>
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[doubt.status]}`}
        >
          {STATUS_LABEL[doubt.status]}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm text-gray-700">
        {doubt.question_text}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        asked {new Date(doubt.created_at).toLocaleDateString()}
      </p>

      {doubt.tutor_reply && (
        <div className="mt-3 rounded-lg bg-indigo-50 p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-500">
            Your reply
          </p>
          <p className="whitespace-pre-wrap text-sm text-indigo-900">
            {doubt.tutor_reply}
          </p>
        </div>
      )}

      {/* One reply only — no threading (APP_PLAN 12.4). Once answered, the box
          is gone and it's the student's move. */}
      {canReply && doubt.status === "open" && (
        <div className="mt-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Write one clear answer — there's no back-and-forth in the app."
            className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-indigo-500"
          />
          {error && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}
          <button
            onClick={send}
            disabled={isSaving || reply.trim().length < 2}
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
          >
            {isSaving ? "Sending…" : "Send reply"}
          </button>
        </div>
      )}

      {doubt.status === "discuss" && (
        <p className="mt-3 rounded-lg bg-purple-50 px-3 py-2 text-xs text-purple-800">
          {studentName} has asked to talk this through in person. Bring it up at
          your next session — only they can mark it resolved afterwards.
        </p>
      )}
    </div>
  );
}
