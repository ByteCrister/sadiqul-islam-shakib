import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DUser } from "@/types/dashboard.types";

// ─── State ────────────────────────────────────────────────────────────────────

interface UserState {
  // ── Session identity (populated by NextAuth) ─────────────────────────────
  id: string | null;
  name: string | null;
  email: string | null;

  // ── Full profile record (fetched from /api/v1/profile) ────────────────────
  profile: DUser | null;
  profileLoading: boolean;
  profileError: string | null;
  hasFetchedProfile: boolean;

  // ── Session helpers ───────────────────────────────────────────────────────
  setUser: (user: { id: string; name: string; email: string }) => void;
  clearUser: () => void;

  // ── Profile actions ───────────────────────────────────────────────────────
  fetchProfile: (force?: boolean) => Promise<void>;
  updateProfile: (
    data: Partial<DUser> & { currentPassword?: string; newPassword?: string }
  ) => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // ── Session identity ──────────────────────────────────────────────────
      id: null,
      name: null,
      email: null,

      // ── Profile ───────────────────────────────────────────────────────────
      profile: null,
      profileLoading: false,
      profileError: null,
      hasFetchedProfile: false,

      // ── Session helpers ───────────────────────────────────────────────────
      setUser: (user) =>
        set({ id: user.id, name: user.name, email: user.email }),
      clearUser: () =>
        set({ id: null, name: null, email: null, profile: null }),

      // ── fetchProfile ──────────────────────────────────────────────────────
      fetchProfile: async (force = false) => {
        const state = get();
        if (!force && state.hasFetchedProfile) return;
        set({ profileLoading: true, profileError: null });
        try {
          const res = await fetch("/api/v1/profile");
          if (!res.ok) throw new Error("Failed to fetch profile");
          const json = await res.json();
          const data: DUser = json.data;
          set({
            profile: data,
            // Keep session identity fields in sync
            id: data.id,
            name: data.name,
            email: data.email,
            hasFetchedProfile: true,
          });
        } catch (err: unknown) {
          set({
            profileError:
              err instanceof Error ? err.message : "Unknown error",
          });
        } finally {
          set({ profileLoading: false });
        }
      },

      // ── updateProfile ─────────────────────────────────────────────────────
      updateProfile: async (data) => {
        set({ profileLoading: true, profileError: null });
        try {
          const res = await fetch("/api/v1/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error ?? "Failed to update profile");
          }
          const json = await res.json();
          const updated: DUser = json.data;
          set({
            profile: updated,
            name: updated.name,
            email: updated.email,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          set({ profileError: message });
          throw err; // re-throw so the form can react
        } finally {
          set({ profileLoading: false });
        }
      },
    }),
    { name: "user-store" }
  )
);
