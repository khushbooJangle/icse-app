"use client";

import { createClient } from "@supabase/supabase-js";

// One Supabase client for the whole browser session.
//
// WHY a single shared instance: the client holds the signed-in session in
// memory and keeps it refreshed. Creating a new one per component would give
// you several copies disagreeing about who is logged in — the same problem
// AuthContext was written to avoid in APP_PLAN 5.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail loudly and early. Without this you get a confusing "Invalid API key"
// from deep inside a network call instead of "you forgot .env.local".
if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy .env.local.example to .env.local and fill it in (see supabase/SETUP.md), " +
      "then restart `npm run dev` — Next.js only reads env files at startup."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // Keep the session in localStorage so a refresh doesn't log you out.
    persistSession: true,
    autoRefreshToken: true,
    // After Google sends the user back, the session arrives in the URL.
    // This tells the client to pick it up and then clean the URL.
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
