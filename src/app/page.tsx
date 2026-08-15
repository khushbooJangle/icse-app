"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// This is the "/" page. It doesn't show anything — it just decides where to
// send you: dashboard if you're logged in, login if you're not.
export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // still checking localStorage, wait
    router.replace(user ? "/dashboard" : "/login");
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-400">
      Loading…
    </div>
  );
}
