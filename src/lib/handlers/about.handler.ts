import { db } from "@/db";
import { counter, experience, skill } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { DCounter, DExperience, DSkill, IconPlatform, SkillCategory } from "@/types/dashboard.types";

export async function getCounters(): Promise<DCounter[]> {
  try {
    const rows = await db.select().from(counter).orderBy(asc(counter.sortOrder));
    return rows.map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      iconName: row.iconName,
      iconPlatform: row.iconPlatform as IconPlatform,
      sortOrder: row.sortOrder,
    }));
  } catch (error) {
    console.error("[about.handler] getCounters error:", error);
    return [];
  }
}

export async function getExperiences(): Promise<DExperience[]> {
  try {
    const rows = await db.select().from(experience).orderBy(asc(experience.sortOrder));
    return rows.map((row) => ({
      id: row.id,
      role: row.role,
      org: row.org,
      period: row.period,
      description: row.description,
      points: row.points,
      iconName: row.iconName,
      iconPlatform: row.iconPlatform as IconPlatform,
      sortOrder: row.sortOrder,
    }));
  } catch (error) {
    console.error("[about.handler] getExperiences error:", error);
    return [];
  }
}

export async function getSkills(): Promise<DSkill[]> {
  try {
    const rows = await db.select().from(skill).orderBy(asc(skill.sortOrder));
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category as SkillCategory,
      iconName: row.iconName,
      iconPlatform: row.iconPlatform as IconPlatform,
      sortOrder: row.sortOrder,
    }));
  } catch (error) {
    console.error("[about.handler] getSkills error:", error);
    return [];
  }
}

export async function getAboutData() {
  const [counters, experiences, skills] = await Promise.all([
    getCounters(),
    getExperiences(),
    getSkills(),
  ]);

  return { counters, experiences, skills };
}
