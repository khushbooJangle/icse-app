"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { HOME_FOR_ROLE } from "@/lib/supabase/types";

// Shown once, to someone who has signed in with Google but has no profile yet.
// Two routes, not three (APP_PLAN 11.3): join as a tutor, or type a code.
//
// The person entering a code never has to say whether they are a student or a
// parent — the code they were given already implies it, and the database works
// out which. One field, one button, less to get wrong.
export default function SignupPage() {
  const { status, user, email, refresh, logout } = useAuth();
  const router = useRouter();

  const [choice, setChoice] = useState<"none" | "tutor" | "code">("none");
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  // Bounce anyone who shouldn't be here: not signed in, or already set up.
  useEffect(() => {
    if (status === "signed_out") router.replace("/login");
    else if (status === "ready" && user) router.replace(HOME_FOR_ROLE[user.role]);
  }, [status, user, router]);

  // Seed the name box from the Google address, so most people just press Continue.
  useEffect(() => {
    if (email && !displayName) setDisplayName(email.split("@")[0]);
  }, [email, displayName]);

  async function submit(kind: "tutor" | "code") {
    setError("");
    setIsBusy(true);
    try {
      // Both of these are database functions, not table writes — see
      // supabase/schema.sql. They are the only way a profile gets created.
      const { error: rpcError } =
        kind === "tutor"
          ? await supabase.rpc("join_as_tutor", { p_display_name: displayName })
          : await supabase.rpc("redeem_invite_code", {
              p_code: code,
              p_display_name: displayName,
            });

      if (rpcError) {
        // The database raises readable messages for the cases that matter —
        // unknown code, self-linking — so show them as-is.
        setError(rpcError.message);
        return;
      }

      // Profile now exists; re-read it so "/" can route us by role.
      await refresh();
      router.replace("/");
    } finally {
      setIsBusy(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">Almost there 👋</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">
          Signed in as {email}. How are you joining?
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Your name
        </label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
          placeholder="e.g. Aryan"
        />

        {choice === "none" && (
          <div className="space-y-3">
            <button
              onClick={() => setChoice("code")}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              I have a code
            </button>
            <button
              onClick={() => setChoice("tutor")}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Join as a Tutor
            </button>
            <p className="pt-2 text-center text-xs text-gray-400">
              Students and parents both use a code — whoever gave it to you
              decides which one you become.
            </p>
          </div>
        )}

        {choice === "code" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Your code
            </label>
            <input
              value={code}
              // Codes are stored uppercase; upper-casing as they type means a
              // lowercase paste still matches.
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-center font-mono text-2xl tracking-[0.3em] outline-none focus:border-indigo-500"
              placeholder="ABC123"
            />
            <button
              onClick={() => submit("code")}
              disabled={isBusy || code.trim().length < 6 || !displayName.trim()}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {isBusy ? "Checking…" : "Continue"}
            </button>
          </div>
        )}

        {choice === "tutor" && (
          <div>
            <p className="mb-4 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-800">
              You&apos;ll get your own invite code to share with students. Each
              student then gets their own code to share with a parent.
            </p>
            <button
              onClick={() => submit("tutor")}
              disabled={isBusy || !displayName.trim()}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {isBusy ? "Creating…" : "Create my tutor account"}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-between text-xs">
          {choice !== "none" ? (
            <button
              onClick={() => {
                setChoice("none");
                setError("");
              }}
              className="text-gray-500 hover:underline"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {/* Wrong Google account is an easy mistake to make and otherwise a
              dead end, since there's no other way off this screen. */}
          <button onClick={logout} className="text-gray-400 hover:underline">
            Sign in with a different account
          </button>
        </div>
      </div>
    </div>
  );
}
