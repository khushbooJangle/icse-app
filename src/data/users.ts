// The whole "user database" is this file.
// There is no backend, so these passwords are visible in the browser.
// That's a deliberate trade-off for a friends-only study app (see APP_PLAN section 8.10).
// To add a friend: add one more object to this array. Nothing else to change.

export type User = {
  username: string;
  password: string;
  displayName: string;
};

export const USERS: User[] = [
  { username: "aryan", password: "study123", displayName: "Aryan" },
  { username: "riya", password: "riya456", displayName: "Riya" },
];
