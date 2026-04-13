/**
 * Admin root layout
 *
 * Provides a simple shell for the private editorial workspace under /admin.
 */
import type { ReactNode } from "react";
import Link from "next/link";

import "@/app/globals.css";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-transparent text-[var(--foreground)] antialiased">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3">
            <Link href="/admin/entities" className="text-sm font-semibold">
              Admin CMS
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/admin/entities" className="hover:underline">
                Entities
              </Link>
              <Link href="/en" className="hover:underline">
                View site
              </Link>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
