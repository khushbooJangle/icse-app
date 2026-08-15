import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// layout.tsx wraps EVERY page in the app. Whatever you put around {children}
// here appears on all pages. This is where AuthProvider goes, so the logged-in
// user is available everywhere without passing props down.

export const metadata: Metadata = {
  title: "ICSE Class 10 — Computer Applications",
  description: "Study, quiz and revise for ICSE Class 10 Computer Applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
