"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HOME_FOR_ROLE } from "@/lib/supabase/types";

// "/" shows nothing of its own. It waits for AuthContext to work out who you
// are, then sends you to the right place. Google also returns you here after
// sign-in, and the Supabase client picks the session out of the URL before this
// runs — which is why there is no separate /auth/callback page.
export default function HomePage() {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "signed_out") router.replace("/login");
    else if (status === "needs_signup") router.replace("/signup");
    else if (user) router.replace(HOME_FOR_ROLE[user.role]);
  }, [status, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-400">
      Loading…
    </div>
  );
}
