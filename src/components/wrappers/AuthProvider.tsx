"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/global/toast";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
