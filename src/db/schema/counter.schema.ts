import {
  pgTable,
  uuid,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { iconPlatformEnum } from "./skill.schema";

/**
 * counter — maps to `counterData` array in parameter.about.ts
 *
 * icon_name:     e.g. "Calendar", "Award", "Star"
 * icon_platform: "lucide" for all current entries
 */
export const counter = pgTable("counter", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  value: integer("value").notNull(),
  iconName: text("icon_name").notNull(),
  iconPlatform: iconPlatformEnum("icon_platform").notNull().default("lucide"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Counter = typeof counter.$inferSelect;
export type NewCounter = typeof counter.$inferInsert;
