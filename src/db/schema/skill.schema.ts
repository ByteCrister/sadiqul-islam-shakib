import {
  pgTable,
  uuid,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * Icon platform enum — which icon library the icon_name string belongs to.
 *
 * - "react-icons"  → import from "react-icons/si", "react-icons/fa", etc.
 *                    e.g. icon_name = "SiReact", icon_platform = "react-icons"
 * - "lucide"       → import from "lucide-react"
 *                    e.g. icon_name = "Award", icon_platform = "lucide"
 *
 * This flag is shared across several schemas (skill, experience, counter,
 * social_link, nav_item) via the same enum type defined once here.
 */
export const iconPlatformEnum = pgEnum("icon_platform", [
  "react-icons",
  "lucide",
]);

export const skillCategoryEnum = pgEnum("skill_category", [
  "Frontend",
  "Backend",
  "Database",
  "Programming",
  "Tools",
]);

/**
 * skill — maps to `skills` array in parameter.about.ts
 *
 * icon_name:     raw string of the icon identifier, e.g. "SiReact", "FaBolt"
 * icon_platform: which library to load it from ("react-icons" | "lucide")
 */
export const skill = pgTable("skill", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: skillCategoryEnum("category").notNull(),
  iconName: text("icon_name").notNull(),     // e.g. "SiReact", "FaBolt"
  iconPlatform: iconPlatformEnum("icon_platform").notNull().default("react-icons"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Skill = typeof skill.$inferSelect;
export type NewSkill = typeof skill.$inferInsert;
