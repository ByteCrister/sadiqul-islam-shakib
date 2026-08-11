import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project } from "@/db/schema";

/**
 * Re-numbers ALL projects sequentially starting at 0,
 * preserving their relative order. Called after every
 * create / update / delete to guarantee a gap-free sequence.
 */
export async function compactProjectOrders(): Promise<void> {
  const rows = await db
    .select({ id: project.id, sortOrder: project.sortOrder })
    .from(project)
    .orderBy(asc(project.sortOrder));

  await Promise.all(
    rows.map((row, idx) =>
      db.update(project).set({ sortOrder: idx }).where(eq(project.id, row.id))
    )
  );
}

/**
 * Moves a specific project to a new sort order, shifting everything
 * else appropriately to make room, then saves the new gaps-free sequence.
 */
export async function reorderProjects(id: string, newOrder: number): Promise<void> {
  const rows = await db
    .select({ id: project.id, sortOrder: project.sortOrder })
    .from(project)
    .orderBy(asc(project.sortOrder));

  // Find the item to move
  const currentIndex = rows.findIndex((r) => r.id === id);
  if (currentIndex === -1) return;

  const [item] = rows.splice(currentIndex, 1);

  // Clamp the new index
  const safeNewIndex = Math.max(0, Math.min(newOrder, rows.length));

  // Insert at the new position
  rows.splice(safeNewIndex, 0, item);

  // Update all rows with their new array index as the sortOrder
  await Promise.all(
    rows.map((row, idx) =>
      db.update(project).set({ sortOrder: idx }).where(eq(project.id, row.id))
    )
  );
}

/**
 * Returns the next available sort order (max existing + 1, or 0 if empty).
 * Used when the caller hasn't specified a desired position.
 */
export async function nextProjectOrder(): Promise<number> {
  const rows = await db
    .select({ sortOrder: project.sortOrder })
    .from(project)
    .orderBy(asc(project.sortOrder));

  if (rows.length === 0) return 0;
  return rows[rows.length - 1].sortOrder + 1;
}
