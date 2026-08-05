import {
  pgTable,
  uuid,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { iconPlatformEnum } from "./skill.schema";

export const socialLinkContextEnum = pgEnum("social_link_context", [
  "header",
  "footer",
  "contact",
]);

/**
 * social_link — maps to:
 *   - `socials` in parameter.footer.ts
 *   - `contactParams` in parameter.contact.ts
 *
 * context: where this link appears (footer / contact — both used currently).
 *          header context reserved for future use.
 *
 * icon_name:     e.g. "Github", "Linkedin", "Mail", "Facebook", "Instagram"
 * icon_platform: "lucide" for all current entries (lucide-react imports)
 */
export const socialLink = pgTable("social_link", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),             // e.g. "GitHub", "LinkedIn"
  href: text("href").notNull(),
  iconName: text("icon_name").notNull(),
  iconPlatform: iconPlatformEnum("icon_platform").notNull().default("lucide"),
  context: socialLinkContextEnum("context").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type SocialLink = typeof socialLink.$inferSelect;
export type NewSocialLink = typeof socialLink.$inferInsert;
