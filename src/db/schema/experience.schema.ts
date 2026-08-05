import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { iconPlatformEnum } from "./skill.schema";

/**
 * experience — maps to `experiences` array in parameter.about.ts
 *
 * points:        JSONB array of bullet strings
 * icon_name:     e.g. "Briefcase", "GraduationCap", "BookOpen", "Code"
 * icon_platform: "lucide" for all current entries (lucide-react imports)
 */
export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: text("role").notNull(),
  org: text("org"),
  period: text("period").notNull(),
  description: text("description").notNull(),
  points: jsonb("points").$type<string[]>().notNull().default([]),
  iconName: text("icon_name").notNull(),
  iconPlatform: iconPlatformEnum("icon_platform").notNull().default("lucide"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;
