"use client";

// THE ONE RULE, unchanged from APP_PLAN 5: this file is the only place that
// talks to Supabase Auth. AuthGuard, Navbar and every page ask this context
// instead — so there is never a second opinion about who is signed in.
//
// What changed in v2: the source of truth moved from localStorage to a real
// Supabase session, and a user now also has a ROLE. The field names `username`
// and `displayName` are kept exactly as they were so existing pages need no edits.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toAppUser, type AppUser, type ProfileRow, type Role } from "@/lib/supabase/types";

// Four states, and the difference between them matters:
//   "loading"      — still checking; render nothing rather than flashing a login screen
//   "signed_out"   — no Supabase session
//   "needs_signup" — signed in with Google, but no profile row yet
//                    (this is the "Join as Tutor / I have a code" screen)
//   "ready"        — signed in AND has a profile
export type AuthStatus = "loading" | "signed_out" | "needs_signup" | "ready";

type AuthValue = {
  status: AuthStatus;
  user: AppUser | null;
  email: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  /** Re-read the profile after signup, so the app can route to the new role. */
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AppUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Given a live session, work out whether this person has a profile yet.
  const loadProfile = useCallback(async (userId: string, sessionEmail: string) => {
    // ensure_profile() is a database function (supabase/schema.sql). It creates
    // a profile ONLY in the two cases APP_PLAN 11.3 says are automatic — a
    // Super Admin allowlist hit, or a pending email invite — and otherwise
    // reports needs_signup. Doing this in the database, not here, is what stops
    // someone handing themselves the super_admin role from the browser.
    const { error: rpcError } = await supabase.rpc("ensure_profile");
    if (rpcError) {
      console.error("ensure_profile failed:", rpcError.message);
    }

    // ALWAYS filter by id — do not rely on RLS to narrow this to one row.
    // The profiles_read policy deliberately returns MORE than your own row:
    // a tutor also sees their roster, and a super admin sees everyone. Without
    // this .eq(), maybeSingle() gets several rows, errors, and the app wrongly
    // concludes you have no profile and sends you to the signup screen.
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, display_name, tutor_id, parent_of, parent_invite_code, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Could not load profile:", error.message);
    }

    if (data) {
      setUser(toAppUser(data as ProfileRow, sessionEmail));
      setStatus("ready");
    } else {
      setUser(null);
      setStatus("needs_signup");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function apply(userId: string | null, sessionEmail: string | null) {
      if (cancelled) return;
      if (!userId || !sessionEmail) {
        setUser(null);
        setEmail(null);
        setStatus("signed_out");
        return;
      }
      setEmail(sessionEmail);
      await loadProfile(userId, sessionEmail);
    }

    // 1. Whatever session already exists when the app loads.
    supabase.auth.getSession().then(({ data }) => {
      apply(data.session?.user.id ?? null, data.session?.user.email ?? null);
    });

    // 2. Then keep up with changes — signing in, signing out, and the token
    //    refresh that happens automatically. APP_PLAN 11.8 asks specifically
    //    that a session expiring mid-use drops the user back to signed out
    //    rather than leaving a half-broken page.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        apply(null, null);
        return;
      }
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        apply(session?.user.id ?? null, session?.user.email ?? null);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      // Come back to the site root; page.tsx then sends each role to its own
      // home. window.location.origin keeps this working on both localhost and
      // the deployed URL without a second code path.
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setEmail(null);
    setStatus("signed_out");
  }

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;
    if (sessionUser?.id && sessionUser.email) {
      await loadProfile(sessionUser.id, sessionUser.email);
    }
  }

  return (
    <AuthContext.Provider
      value={{ status, user, email, signInWithGoogle, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

// Convenience for pages that should only be reachable by certain roles.
export function hasRole(user: AppUser | null, ...roles: Role[]): boolean {
  return !!user && roles.includes(user.role);
}
