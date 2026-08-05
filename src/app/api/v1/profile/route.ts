import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { user } from "@/db/schema";
import type { DUser } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, apiError, notFound, serverError } from "@/app/api/lib/api-helpers";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Strip password before returning to client */
function toPublicUser(row: typeof user.$inferSelect): DUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// ── GET /api/v1/profile ────────────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db.select().from(user).limit(1);
    if (!rows.length) return notFound("Profile not found");
    return ok<DUser>(toPublicUser(rows[0]));
  } catch (err) {
    return serverError(err);
  }
}

// ── PATCH /api/v1/profile ──────────────────────────────────────────────────────

interface ProfilePatchBody {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: ProfilePatchBody = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    const rows = await db.select().from(user).limit(1);
    if (!rows.length) return notFound("Profile not found");
    const existing = rows[0];

    // Password change requested — verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return apiError("currentPassword is required to set a new password", 422);
      }
      const match = await bcrypt.compare(currentPassword, existing.password);
      if (!match) {
        return apiError("Current password is incorrect", 422);
      }
    }

    const updates: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (newPassword) updates.password = await bcrypt.hash(newPassword, 12);

    const updated = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, existing.id))
      .returning()
      .then((r) => r[0]);

    if (!updated) return notFound("Profile not found");
    
    return ok<DUser>(toPublicUser(updated));
  } catch (err) {
    return serverError(err);
  }
}
