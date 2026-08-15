"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study", label: "Study" },
  { href: "/quiz", label: "Quizzes" },
  { href: "/papers", label: "Papers" },
  { href: "/revision", label: "Revision" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // current URL, used to highlight the active link
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-3">
        <Link href="/dashboard" className="mr-4 text-lg font-bold text-indigo-600">
          ICSE 10 📘
        </Link>

        {LINKS.map((link) => {
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
