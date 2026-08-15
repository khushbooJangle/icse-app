"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";

// Wrap any page that requires login:
//   <AuthGuard> ...page content... </AuthGuard>
// It also renders the Navbar, since every protected page wants one and /login doesn't.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  // WHY useEffect: you can't redirect while React is rendering — it has to
  // happen *after* the render finishes. useEffect is that "after" slot.
  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  // user === undefined → still checking localStorage
  // user === null      → no user, redirect already queued above
  // Either way, render nothing rather than flashing the page.
  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
