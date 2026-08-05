import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteConfig } from "@/db/schema";
import type { DSiteConfig, DSiteConfigInput } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";

function toSiteConfig(row: typeof siteConfig.$inferSelect): DSiteConfig {
  return {
    id: row.id,
    key: row.key,
    value: row.value,
    updatedAt: row.updatedAt.toISOString(),
  };
}

// ── GET /api/v1/site-config ───────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db.select().from(siteConfig);
    return ok<DSiteConfig[]>(rows.map(toSiteConfig));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/site-config — upsert by key ─────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DSiteConfigInput = await req.json();

    // Drizzle onConflictDoUpdate — upsert on unique key
    const upserted = await db
      .insert(siteConfig)
      .values({
        key: body.key,
        value: body.value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteConfig.key,
        set: {
          value: body.value,
          updatedAt: new Date(),
        },
      })
      .returning()
      .then((r) => r[0]);

    return ok<DSiteConfig>(toSiteConfig(upserted));
  } catch (err) {
    return serverError(err);
  }
}
