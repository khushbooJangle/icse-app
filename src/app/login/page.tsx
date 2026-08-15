"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { USERS } from "@/data/users";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  // One useState per input field. React calls these "controlled inputs":
  // the value comes from state, and onChange puts it back into state.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    // Without this, the browser reloads the whole page on submit and
    // everything we just did is lost.
    event.preventDefault();

    const match = USERS.find(
      (u) => u.username === username.trim().toLowerCase() && u.password === password
    );

    if (!match) {
      setError("Wrong username or password. Try again.");
      return;
    }

    login({ username: match.username, displayName: match.displayName });
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-gray-900">ICSE Class 10 📘</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">
          Computer Applications — log in to continue
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
          placeholder="aryan"
          autoComplete="username"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
