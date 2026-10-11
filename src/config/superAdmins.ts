// Super Admin allowlist (APP_PLAN 11.3).
//
// A Super Admin is NOT a role anyone can sign up into or be promoted to — it is
// this fixed list of email addresses, checked at first sign-in.
//
// IMPORTANT: this file is the UI copy. The list that actually ENFORCES the rule
// lives in the database, in the `is_super_admin_email()` function in
// supabase/schema.sql. That one is authoritative because a list living only in
// the browser bundle could be bypassed by calling the API directly.
//
// Keep the two in sync. If they disagree, the database wins.

// TODO: replace with your real Google sign-in address before first sign-in,
// and make the same edit in supabase/schema.sql.
export const SUPER_ADMIN_EMAILS: string[] = ["khushboojangle@gmail.com"];

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.some(
    (allowed) => allowed.toLowerCase() === email.toLowerCase()
  );
}
