"use client";

import { useCallback, useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { CHAPTERS } from "@/data/chapters";
import {
  createDoubt,
  isOpenish,
  listMyDoubts,
  setDoubtStatus,
  STATUS_LABEL,
  STATUS_STYLE,
  type Doubt,
} from "@/lib/doubts";

// "My Doubts" does two jobs (APP_PLAN 12.3):
//   1. every doubt this student has raised, with status and the tutor's reply
//   2. a way to raise a NEW one, picking the chapter from a dropdown
// That second job is the entry point for anything the floating button can't
// cover — quiz-related doubts in particular, since the button is deliberately
// absent during a quiz.
export default function DoubtsPage() {
  return (
    <AuthGuard allow={["student"]}>
      <DoubtsContent />
    </AuthGuard>
  );
}

function DoubtsContent() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAsking, setIsAsking] = useState(false);
  const [newChapter, setNewChapter] = useState(CHAPTERS[0]?.slug ?? "");
  const [newText, setNewText] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setDoubts(await listMyDoubts(user.id));
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const titleFor = (slug: string) =>
    CHAPTERS.find((c) => c.slug === slug)?.title ?? slug;

  async function submitNew() {
    if (!user) return;
    setError("");
    setIsSaving(true);
    try {
      const { error: createError } = await createDoubt(user.id, newChapter, newText);
      if (createError) {
        setError(createError);
        return;
      }
      setNewText("");
      setIsAsking(false);
      await load();
    } finally {
      setIsSaving(false);
    }
  }

  async function close(doubt: Doubt, status: "resolved" | "discuss") {
    const { error: updateError } = await setDoubtStatus(doubt.id, status);
    if (updateError) {
      setError(updateError);
      return;
    }
    await load();
  }

  const active = doubts.filter((d) => isOpenish(d.status));
  const resolved = doubts.filter((d) => d.status === "resolved");

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">🙋 My Doubts</h1>
          <p className="mt-1 text-gray-500">
            {isLoading
              ? "Loading…"
              : `${active.length} open, ${resolved.length} resolved`}
          </p>
        </div>
        <button
          onClick={() => setIsAsking((v) => !v)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          {isAsking ? "Cancel" : "Ask a new doubt"}
        </button>
      </div>

      {isAsking && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Which chapter?
          </label>
          <select
            value={newChapter}
            onChange={(e) => setNewChapter(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
          >
            {CHAPTERS.map((chapter) => (
              <option key={chapter.slug} value={chapter.slug}>
                {chapter.emoji} {chapter.title}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Your question
          </label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={4}
            placeholder="What's confusing you?"
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
          />

          <button
            onClick={submitNew}
            disabled={isSaving || newText.trim().length < 5}
            className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
          >
            {isSaving ? "Sending…" : "Send to tutor"}
          </button>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && doubts.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="text-4xl">🙋</div>
          <h2 className="mt-3 text-xl font-bold">No doubts yet</h2>
          <p className="mt-1 text-gray-500">
            While reading a chapter, tap the <strong>Ask a doubt</strong> button
            in the corner — or start one here.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-8 space-y-4">
          {active.map((doubt) => (
            <DoubtCard
              key={doubt.id}
              doubt={doubt}
              title={titleFor(doubt.chapter_slug)}
              onClose={close}
            />
          ))}
        </div>
      )}

      {/* Resolved ones collapse out of the way but stay readable. */}
      {resolved.length > 0 && (
        <details className="rounded-2xl border border-gray-200 bg-white p-6">
          <summary className="cursor-pointer font-semibold text-gray-700">
            Resolved ({resolved.length})
          </summary>
          <div className="mt-4 space-y-4">
            {resolved.map((doubt) => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                title={titleFor(doubt.chapter_slug)}
                onClose={close}
              />
            ))}
          </div>
        </details>
      )}
    </>
  );
}

function DoubtCard({
  doubt,
  title,
  onClose,
}: {
  doubt: Doubt;
  title: string;
  onClose: (doubt: Doubt, status: "resolved" | "discuss") => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-gray-800">{title}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[doubt.status]}`}
        >
          {STATUS_LABEL[doubt.status]}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-gray-700">{doubt.question_text}</p>
      <p className="mt-1 text-xs text-gray-400">
        asked {new Date(doubt.created_at).toLocaleDateString()}
      </p>

      {doubt.tutor_reply && (
        <div className="mt-4 rounded-xl bg-indigo-50 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-500">
            Your tutor
          </p>
          <p className="whitespace-pre-wrap text-sm text-indigo-900">
            {doubt.tutor_reply}
          </p>
        </div>
      )}

      {/* Straight after a reply: did that land, or do you need to talk it over? */}
      {doubt.status === "replied" && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => onClose(doubt, "resolved")}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Understood ✅
          </button>
          <button
            onClick={() => onClose(doubt, "discuss")}
            className="rounded-xl border border-purple-300 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
          >
            Let&apos;s discuss 💬
          </button>
        </div>
      )}

      {/* Flagged for a live conversation. Nothing closes this automatically —
          only the student knows whether the conversation actually happened. */}
      {doubt.status === "discuss" && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-gray-500">
            Flagged for your next session with your tutor. Once you&apos;ve
            talked it through, close it off here.
          </p>
          <button
            onClick={() => onClose(doubt, "resolved")}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            We discussed it — resolved ✅
          </button>
        </div>
      )}

      {doubt.status === "open" && (
        <p className="mt-4 text-sm text-gray-400">
          Waiting for your tutor to reply.
        </p>
      )}
    </div>
  );
}
