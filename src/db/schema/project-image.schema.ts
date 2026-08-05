import {
  pgTable,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { project } from "./project.schema";
import { asset } from "./asset.schema";

/**
 * project_image — junction table linking projects to their gallery images.
 *
 * Each row = one image in a project's gallery (the `images[]` array from the
 * original Project interface in parameter.projects.ts).
 *
 * sort_order controls the display order within a project's gallery.
 *
 * Using asset references means:
 *   - The same image can appear in multiple project galleries.
 *   - Updating the underlying asset_file automatically reflects everywhere.
 */
export const projectImage = pgTable("project_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => asset.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type ProjectImage = typeof projectImage.$inferSelect;
export type NewProjectImage = typeof projectImage.$inferInsert;
