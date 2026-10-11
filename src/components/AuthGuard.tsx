"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HOME_FOR_ROLE, type Role } from "@/lib/supabase/types";
import Navbar from "./Navbar";
import ActivityHeartbeat from "./ActivityHeartbeat";

// Wrap any page that requires a signed-in user:
//   <AuthGuard> ...page content... </AuthGuard>
//
// Pass `allow` to also restrict by role:
//   <AuthGuard allow={["tutor", "super_admin"]}> ... </AuthGuard>
//
// The database is the real gate — RLS means a parent querying another
// student's rows gets nothing back regardless of what the UI does. This is
// about not showing someone a page that would only render empty for them.
export default function AuthGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { status, user } = useAuth();
  const router = useRouter();

  // WHY useEffect: you cannot redirect while React is rendering — it has to
  // happen after the render finishes. useEffect is that "after" slot.
  useEffect(() => {
    if (status === "loading") return;
    if (status === "signed_out") router.replace("/login");
    else if (status === "needs_signup") router.replace("/signup");
    else if (user && allow && !allow.includes(user.role)) {
      // Signed in, but this page isn't for their role — send them to their own
      // home rather than showing an error.
      router.replace(HOME_FOR_ROLE[user.role]);
    }
  }, [status, user, allow, router]);

  // Still checking, or about to redirect: render nothing rather than flashing
  // a page the user isn't allowed to keep.
  if (status !== "ready" || !user) return null;
  if (allow && !allow.includes(user.role)) return null;

  return (
    <>
      <Navbar />
      {/* Only students have time-on-task worth recording — a tutor reading
          their roster isn't studying. */}
      {user.role === "student" && <ActivityHeartbeat />}
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
