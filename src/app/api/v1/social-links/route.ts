import { NextRequest } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { socialLink } from "@/db/schema";
import type {
  DSocialLink,
  DSocialLinkInput,
  IconPlatform,
  SocialLinkContext,
} from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";
import { compactSocialLinkOrders, nextSocialLinkOrder } from "./order.utils";

function toSocialLink(row: typeof socialLink.$inferSelect): DSocialLink {
  return {
    id: row.id,
    name: row.name,
    href: row.href,
    iconName: row.iconName,
    iconPlatform: row.iconPlatform as IconPlatform,
    context: row.context as SocialLinkContext,
    sortOrder: row.sortOrder,
  };
}

// ── GET /api/v1/social-links ──────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(socialLink)
      .orderBy(asc(socialLink.sortOrder));
    return ok<DSocialLink[]>(rows.map(toSocialLink));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/social-links ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DSocialLinkInput = await req.json();

    // Determine the correct sort-order.
    // If the caller provided one, honour it but we still compact afterwards.
    // If omitted (or invalid), assign the next available slot.
    const desiredOrder =
      typeof body.sortOrder === "number" && body.sortOrder >= 0
        ? body.sortOrder
        : await nextSocialLinkOrder();

    const [inserted] = await db
      .insert(socialLink)
      .values({
        name: body.name,
        href: body.href,
        iconName: body.iconName,
        iconPlatform: body.iconPlatform,
        context: body.context,
        sortOrder: desiredOrder,
      })
      .returning();

    // Compact to resolve any gaps or duplicates introduced by the insert
    await compactSocialLinkOrders();

    // Re-fetch the row so we return the final (compacted) sortOrder
    const allRows = await db
      .select()
      .from(socialLink)
      .orderBy(asc(socialLink.sortOrder));

    const fresh = allRows.find((r) => r.id === inserted.id) ?? inserted;
    return ok<DSocialLink>(toSocialLink(fresh), 201);
  } catch (err) {
    return serverError(err);
  }
}
