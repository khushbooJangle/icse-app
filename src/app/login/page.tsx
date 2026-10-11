"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HOME_FOR_ROLE } from "@/lib/supabase/types";

// No password fields any more (APP_PLAN 11.3). The hardcoded users.ts list is
// retired — one Google button, nothing to remember, no passwords stored here.
export default function LoginPage() {
  const { status, user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  // Already signed in? Don't sit on the login screen.
  useEffect(() => {
    if (status === "ready" && user) router.replace(HOME_FOR_ROLE[user.role]);
    else if (status === "needs_signup") router.replace("/signup");
  }, [status, user, router]);

  async function handleSignIn() {
    setIsSending(true);
    try {
      await signInWithGoogle(); // leaves the page; Google takes over
    } catch {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">ICSE Class 10 📘</h1>
        <p className="mb-8 mt-1 text-sm text-gray-500">
          Computer Applications
        </p>

        <button
          onClick={handleSignIn}
          disabled={isSending || status === "loading"}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {/* Google's mark, inline so no external image request is needed. */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
          </svg>
          {isSending ? "Opening Google…" : "Sign in with Google"}
        </button>

        <p className="mt-6 text-xs text-gray-400">
          First time here? Sign in and we&apos;ll ask whether you&apos;re joining
          as a tutor or with a code.
        </p>
      </div>
    </div>
  );
}
