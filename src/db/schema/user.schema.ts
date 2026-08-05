import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * user — stores the admin user (you) for the portfolio dashboard.
 *
 * Since this is a personal portfolio, there will likely only be one user.
 * We use this primarily for authentication to the admin panel.
 * 
 * We do not strictly need to add a `user_id` foreign key to every other table 
 * (like projects, skills, etc.) because all content implicitly belongs to you.
 */
export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  
  // Hashed password for email/password authentication
  password: text("password").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
