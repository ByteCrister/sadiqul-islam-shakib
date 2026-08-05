import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unauthorized } from "./api-helpers";

export type AuthResult =
  | { session: Session; error: null }
  | { session: null; error: ReturnType<typeof unauthorized> };

/**
 * Validates the incoming request has an active NextAuth session.
 *
 * Usage inside a route handler:
 * ```ts
 * const { session, error } = await requireAuth();
 * if (error) return error;
 * // session is now typed Session
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: unauthorized() };
  }
  return { session, error: null };
}
