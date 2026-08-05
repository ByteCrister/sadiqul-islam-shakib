import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { experience } from "@/db/schema";

export async function compactExperienceOrders(): Promise<void> {
  const rows = await db
    .select({ id: experience.id, sortOrder: experience.sortOrder })
    .from(experience)
    .orderBy(asc(experience.sortOrder));

  await Promise.all(
    rows.map((row, idx) =>
      db.update(experience).set({ sortOrder: idx }).where(eq(experience.id, row.id))
    )
  );
}

export async function reorderExperiences(id: string, newOrder: number): Promise<void> {
  const rows = await db
    .select({ id: experience.id, sortOrder: experience.sortOrder })
    .from(experience)
    .orderBy(asc(experience.sortOrder));

  const currentIndex = rows.findIndex((r) => r.id === id);
  if (currentIndex === -1) return;

  const [item] = rows.splice(currentIndex, 1);
  const safeNewIndex = Math.max(0, Math.min(newOrder, rows.length));
  rows.splice(safeNewIndex, 0, item);

  await Promise.all(
    rows.map((row, idx) =>
      db.update(experience).set({ sortOrder: idx }).where(eq(experience.id, row.id))
    )
  );
}

export async function nextExperienceOrder(): Promise<number> {
  const rows = await db
    .select({ sortOrder: experience.sortOrder })
    .from(experience)
    .orderBy(asc(experience.sortOrder));

  if (rows.length === 0) return 0;
  return rows[rows.length - 1].sortOrder + 1;
}
