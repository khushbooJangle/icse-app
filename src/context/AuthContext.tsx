"use client";
// 'use client' means: run this in the browser, not on the server.
// Anything using useState, useEffect, or localStorage needs it.

// THE ONE RULE: this file is the only place that touches localStorage for auth.
// AuthGuard, Navbar and every page ask this context instead of reading
// localStorage themselves — so there's never two places disagreeing about
// who is logged in.

import { createContext, useContext, useEffect, useState } from "react";

export type CurrentUser = {
  username: string;
  displayName: string;
};

// `undefined` is a real, meaningful third state here:
//   undefined = we haven't checked localStorage yet ("still loading")
//   null      = we checked, nobody is logged in
//   object    = logged in
// Without the "still loading" state, every page would flash the login screen
// for a split second before finding the saved user.
type AuthValue = {
  user: CurrentUser | undefined | null;
  login: (user: CurrentUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | undefined | null>(undefined);

  // Empty [] means: run once, right after this component first appears.
  useEffect(() => {
    const stored = window.localStorage.getItem("currentUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  function login(nextUser: CurrentUser) {
    window.localStorage.setItem("currentUser", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function logout() {
    window.localStorage.removeItem("currentUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Every component calls this instead of importing the context directly.
export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) {
    // This only fires if you forgot to wrap the app in <AuthProvider>.
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return value;
}
