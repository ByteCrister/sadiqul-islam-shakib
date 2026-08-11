import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { skill } from "@/db/schema";

export async function compactSkillOrders(): Promise<void> {
  const rows = await db
    .select({ id: skill.id, sortOrder: skill.sortOrder })
    .from(skill)
    .orderBy(asc(skill.sortOrder));

  await Promise.all(
    rows.map((row, idx) =>
      db.update(skill).set({ sortOrder: idx }).where(eq(skill.id, row.id))
    )
  );
}

export async function reorderSkills(id: string, newOrder: number): Promise<void> {
  const rows = await db
    .select({ id: skill.id, sortOrder: skill.sortOrder })
    .from(skill)
    .orderBy(asc(skill.sortOrder));

  const currentIndex = rows.findIndex((r) => r.id === id);
  if (currentIndex === -1) return;

  const [item] = rows.splice(currentIndex, 1);
  const safeNewIndex = Math.max(0, Math.min(newOrder, rows.length));
  rows.splice(safeNewIndex, 0, item);

  await Promise.all(
    rows.map((row, idx) =>
      db.update(skill).set({ sortOrder: idx }).where(eq(skill.id, row.id))
    )
  );
}

export async function nextSkillOrder(): Promise<number> {
  const rows = await db
    .select({ sortOrder: skill.sortOrder })
    .from(skill)
    .orderBy(asc(skill.sortOrder));

  if (rows.length === 0) return 0;
  return rows[rows.length - 1].sortOrder + 1;
}
