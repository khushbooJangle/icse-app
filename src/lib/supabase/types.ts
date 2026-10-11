// Shapes that mirror the database (supabase/schema.sql).
// Hand-written rather than generated: there are only a few tables, and a small
// honest file is easier to read than a large generated one.

export type Role = "super_admin" | "tutor" | "student" | "parent";

// One row of `profiles`, in the snake_case the database actually returns.
export type ProfileRow = {
  id: string;
  role: Role;
  display_name: string;
  tutor_id: string | null;
  parent_of: string | null;
  parent_invite_code: string | null;
  created_at: string;
};

// What the app passes around. Deliberately keeps `username` and `displayName`
// from the old localStorage-era user object, so every existing page
// (`getStudyDone(user.username)`, `Hey {user.displayName}`) keeps working
// untouched while auth moves to Supabase underneath.
//
// `username` is the Supabase user id, which makes the localStorage progress
// keys unique per account instead of per typed-in name.
export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  tutorId: string | null;
  parentOf: string | null;
  parentInviteCode: string | null;
};

export function toAppUser(row: ProfileRow, email: string): AppUser {
  return {
    id: row.id,
    username: row.id,
    displayName: row.display_name,
    email,
    role: row.role,
    tutorId: row.tutor_id,
    parentOf: row.parent_of,
    parentInviteCode: row.parent_invite_code,
  };
}

// Where each role lands after signing in.
export const HOME_FOR_ROLE: Record<Role, string> = {
  super_admin: "/admin",
  tutor: "/tutor",
  student: "/dashboard",
  parent: "/parent",
};
