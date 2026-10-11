"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createDoubt } from "@/lib/doubts";

// The floating "Ask a doubt" button (APP_PLAN 12.3).
//
// WHERE IT APPEARS: Study chapter pages and Revision — anywhere the student is
// reading and a question might come up mid-way. Deliberately NOT during a quiz:
// a floating button mid-question is a distraction, and a quiz-related doubt can
// be raised afterwards from My Doubts.
//
// `fixed` not `absolute`, so it stays put while the page scrolls rather than
// sitting at the bottom of a long chapter where nobody would find it.
export default function AskDoubtButton({
  chapterSlug,
  chapterTitle,
}: {
  chapterSlug: string;
  chapterTitle: string;
}) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Only students raise doubts. A tutor previewing a chapter shouldn't see it.
  if (!user || user.role !== "student") return null;

  async function submit() {
    setError("");
    setIsSaving(true);
    try {
      // Pre-tagged with the chapter being read — the student never picks it.
      const { error: createError } = await createDoubt(user!.id, chapterSlug, text);
      if (createError) {
        setError(createError);
        return;
      }
      setIsSent(true);
      setText("");
    } finally {
      setIsSaving(false);
    }
  }

  function close() {
    setIsOpen(false);
    setIsSent(false);
    setError("");
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ask a doubt about this chapter"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
      >
        <span aria-hidden="true">🙋</span>
        <span className="hidden sm:inline">Ask a doubt</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          // Clicking the dark backdrop closes; clicks inside the card must not
          // bubble up to it, hence the stopPropagation below.
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            {isSent ? (
              <div className="text-center">
                <div className="text-4xl">✅</div>
                <h2 className="mt-3 text-lg font-bold">Sent to your tutor</h2>
                <p className="mt-1 text-sm text-gray-500">
                  You&apos;ll see their reply under My Doubts.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href="/doubts"
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    My Doubts
                  </Link>
                  <button
                    onClick={close}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Keep reading
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold">Ask a doubt</h2>
                <p className="mb-3 mt-1 text-sm text-gray-500">
                  About <span className="font-medium">{chapterTitle}</span>
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  autoFocus
                  placeholder="What's confusing you? Be as specific as you can — your tutor answers in writing."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                />

                {error && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={close}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={isSaving || text.trim().length < 5}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
                  >
                    {isSaving ? "Sending…" : "Send to tutor"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
