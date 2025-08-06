"use client";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { UserInitializer } from "./UserInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserInitializer />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {/* renders toast containers at top-right by default */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
