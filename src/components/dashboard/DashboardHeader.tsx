"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export default function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
  return (
    <header className="bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800 z-30 relative sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 transition-colors">
            Portfolio <span className="text-neutral-500 dark:text-neutral-400">Admin</span>
          </Link>
          <div className="hidden sm:block h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Welcome, {userName}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors hidden sm:inline-block"
          >
            View Live Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl transition-all active:scale-[0.98] border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
