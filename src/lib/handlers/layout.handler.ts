/**
 * layout.handler.ts
 *
 * Server-side data fetchers for the root layout (Header + Footer).
 * Queries the DB directly (no HTTP) so they work reliably during SSR/ISR
 * even without an auth session.
 */

import { db } from "@/db";
import { resume, socialLink, user, asset, assetFile } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { DSocialLink, SocialLinkContext, IconPlatform } from "@/types/dashboard.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LayoutUser {
  name: string;
  email: string;
}

export interface LayoutResume {
  /** Direct Cloudinary URL of the active resume PDF */
  url: string;
  label: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/** Returns the first user's name and email (the portfolio owner). */
export async function getLayoutUser(): Promise<LayoutUser | null> {
  try {
    const [row] = await db
      .select({ name: user.name, email: user.email })
      .from(user)
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("[layout.handler] getLayoutUser error:", error);
    return null;
  }
}

/** Returns the active resume's Cloudinary URL, or null if none is set. */
export async function getActiveResume(): Promise<LayoutResume | null> {
  try {
    const rows = await db
      .select({
        label: resume.label,
        url: assetFile.url,
      })
      .from(resume)
      .innerJoin(asset, eq(resume.assetId, asset.id))
      .innerJoin(assetFile, eq(asset.assetFileId, assetFile.id))
      .where(eq(resume.isActive, true))
      .limit(1);

    const row = rows[0];
    if (!row?.url) return null;
    return { url: row.url, label: row.label };
  } catch (error) {
    console.error("[layout.handler] getActiveResume error:", error);
    return null;
  }
}

/**
 * Returns social links for a given context (e.g. "footer" or "contact"),
 * ordered by sortOrder.
 */
export async function getSocialLinksByContext(context: SocialLinkContext): Promise<DSocialLink[]> {
  try {
    const rows = await db
      .select()
      .from(socialLink)
      .where(eq(socialLink.context, context))
      .orderBy(asc(socialLink.sortOrder));
    return rows.map(toSocialLink);
  } catch (error) {
    console.error("[layout.handler] getSocialLinksByContext error:", error);
    return [];
  }
}

/** Convenience: fetch everything needed by the root layout in one call. */
export async function getLayoutData() {
  const [layoutUser, activeResume, footerSocialLinks] = await Promise.all([
    getLayoutUser(),
    getActiveResume(),
    getSocialLinksByContext("footer"),
  ]);

  return { layoutUser, activeResume, footerSocialLinks };
}
