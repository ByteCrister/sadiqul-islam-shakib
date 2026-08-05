"use client";

import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-neutral-200/60 dark:border-neutral-800/60 rounded-[2rem] bg-neutral-50/30 dark:bg-neutral-900/30 backdrop-blur-sm">
      <div className="w-16 h-16 bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700/50 rounded-2xl flex items-center justify-center mb-5">
        <PackageOpen className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
