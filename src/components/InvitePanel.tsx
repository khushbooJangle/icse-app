"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type InviteRow = {
  id: string;
  email: string;
  status: "pending" | "accepted";
  created_at: string;
};

// Two ways to bring someone in (APP_PLAN 11.3), side by side:
//
//   1. A CODE — just tell them out loud. They type it on the signup screen.
//   2. AN EMAIL INVITE — for when you know exactly who it is. At their first
//      sign-in the app matches their address and links them automatically,
//      with no code to type. Invites take priority over codes.
//
// Used by the tutor (inviting students) and by a student (inviting a parent).
export default function InvitePanel({
  kind,
  code,
  ownerId,
}: {
  kind: "student" | "parent";
  code: string | null;
  /** The tutor's id for student invites, or the student's id for parent invites. */
  ownerId: string;
}) {
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const noun = kind === "student" ? "student" : "parent";

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("invites")
      .select("id, email, status, created_at")
      .eq("role", kind)
      .order("created_at", { ascending: false });
    setInvites((data as InviteRow[]) ?? []);
  }, [kind]);

  useEffect(() => {
    load();
  }, [load]);

  async function copy(text: string, what: "code" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard needs a secure context and permission; if it's refused the
      // code is on screen anyway, so this isn't worth an error message.
    }
  }

  async function sendInvite() {
    setError("");
    setNotice("");
    const address = email.trim().toLowerCase();
    if (!address.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }

    setIsBusy(true);
    try {
      // Exactly one of tutor_id / student_id is set, decided by the role. The
      // database has a CHECK constraint that rejects any other combination.
      const { error: insertError } = await supabase.from("invites").insert({
        email: address,
        role: kind,
        tutor_id: kind === "student" ? ownerId : null,
        student_id: kind === "parent" ? ownerId : null,
      });

      if (insertError) {
        // The unique index on pending emails surfaces as a duplicate-key error.
        setError(
          insertError.code === "23505"
            ? "There's already a pending invite for that address."
            : insertError.message
        );
        return;
      }

      setEmail("");
      setNotice(`Invite recorded for ${address}.`);
      await load();
    } finally {
      setIsBusy(false);
    }
  }

  async function cancelInvite(id: string) {
    await supabase.from("invites").delete().eq("id", id);
    await load();
  }

  const appUrl = typeof window === "undefined" ? "" : window.location.origin;
  const pending = invites.filter((i) => i.status === "pending");
  const accepted = invites.filter((i) => i.status === "accepted");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold">Add a {noun}</h2>

      {/* ---- Option 1: the code ---- */}
      <p className="mb-2 mt-4 text-sm font-medium text-gray-700">
        Option 1 — give them your code
      </p>
      {code ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-xl bg-indigo-50 px-4 py-2 font-mono text-2xl tracking-[0.2em] text-indigo-700">
            {code}
          </span>
          <button
            onClick={() => copy(code, "code")}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied === "code" ? "Copied ✅" : "Copy code"}
          </button>
          <button
            onClick={() => copy(appUrl, "link")}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied === "link" ? "Copied ✅" : "Copy app link"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">No code available.</p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        They open the app, sign in with Google, choose “I have a code” and type
        it in. The code says what they become — no need for them to pick.
      </p>

      {/* ---- Option 2: email invite ---- */}
      <p className="mb-2 mt-6 text-sm font-medium text-gray-700">
        Option 2 — invite a specific email
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`${noun}@example.com`}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          onClick={sendInvite}
          disabled={isBusy || !email.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {isBusy ? "Saving…" : "Add invite"}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        No email is sent automatically yet — send them the app link yourself.
        When they sign in with <em>this exact address</em>, they&apos;re linked
        straight away with no code to type.
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {notice}
        </p>
      )}

      {pending.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Waiting to join ({pending.length})
          </p>
          <ul className="space-y-2">
            {pending.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="text-gray-700">{invite.email}</span>
                <button
                  onClick={() => cancelInvite(invite.id)}
                  className="text-xs text-gray-400 hover:text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {accepted.length > 0 && (
        <p className="mt-4 text-xs text-gray-400">
          {accepted.length} invite{accepted.length > 1 ? "s" : ""} already accepted.
        </p>
      )}
    </div>
  );
}
