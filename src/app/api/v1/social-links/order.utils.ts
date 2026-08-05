import { asc, ne, eq } from "drizzle-orm";
import { db } from "@/db";
import { socialLink } from "@/db/schema";

/**
 * Compact sort-orders after any mutation so they are always 0-based, sequential, and gap-free.
 * e.g.  [0, 2, 5, 7] → [0, 1, 2, 3]
 *
 * @param excludeId  Optionally skip one row (used during PATCH so the row
 *                   being updated doesn't conflict with itself mid-reorder).
 */
export async function compactSocialLinkOrders(excludeId?: string): Promise<void> {
  const rows = await db
    .select({ id: socialLink.id, sortOrder: socialLink.sortOrder })
    .from(socialLink)
    .orderBy(asc(socialLink.sortOrder));

  // Assign sequential integers starting at 0
  await Promise.all(
    rows.map((row, idx) =>
      db.update(socialLink).set({ sortOrder: idx }).where(eq(socialLink.id, row.id))
    )
  );
}

export async function reorderSocialLinks(id: string, newOrder: number): Promise<void> {
  const rows = await db
    .select({ id: socialLink.id, sortOrder: socialLink.sortOrder })
    .from(socialLink)
    .orderBy(asc(socialLink.sortOrder));

  const currentIndex = rows.findIndex((r) => r.id === id);
  if (currentIndex === -1) return;

  const [item] = rows.splice(currentIndex, 1);
  const safeNewIndex = Math.max(0, Math.min(newOrder, rows.length));
  rows.splice(safeNewIndex, 0, item);

  await Promise.all(
    rows.map((row, idx) =>
      db.update(socialLink).set({ sortOrder: idx }).where(eq(socialLink.id, row.id))
    )
  );
}

/**
 * Returns the next available sort-order (max existing + 1, or 0 for empty table).
 */
export async function nextSocialLinkOrder(): Promise<number> {
  const rows = await db
    .select({ sortOrder: socialLink.sortOrder })
    .from(socialLink)
    .orderBy(asc(socialLink.sortOrder));

  if (rows.length === 0) return 0;
  return rows[rows.length - 1].sortOrder + 1;
}
