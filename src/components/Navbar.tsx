"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/supabase/types";

// Which links each role sees. A parent has no Study or Quiz pages to visit, so
// showing them would just be four dead ends.
const LINKS: Record<Role, { href: string; label: string }[]> = {
  student: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/study", label: "Study" },
    { href: "/quiz", label: "Quizzes" },
    { href: "/papers", label: "Papers" },
    { href: "/revision", label: "Revision" },
    { href: "/doubts", label: "My Doubts" },
  ],
  tutor: [{ href: "/tutor", label: "My Students" }],
  super_admin: [
    { href: "/admin", label: "All Tutors" },
    { href: "/tutor", label: "My Students" },
  ],
  parent: [{ href: "/parent", label: "Progress" }],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    // APP_PLAN 11.8: this must exist on every authenticated page. Without it a
    // student on a shared family computer has no way to end their session.
    await logout();
    router.replace("/login");
  }

  const links = user ? LINKS[user.role] : [];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-3">
        <span className="mr-4 text-lg font-bold text-indigo-600">ICSE 10 📘</span>

        {links.map((link) => {
          // startsWith so /study/oop-intro still highlights "Study"
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.displayName}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
