import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Applying schema (idempotent)...");

  // Create ENUMs safely (ignore if already exists)
  await sql`
    DO $$ BEGIN
      CREATE TYPE "public"."cloudinary_folder" AS ENUM('images', 'pdfs');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      CREATE TYPE "public"."cloudinary_resource_type" AS ENUM('image', 'raw', 'video');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      CREATE TYPE "public"."icon_platform" AS ENUM('react-icons', 'lucide');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      CREATE TYPE "public"."skill_category" AS ENUM('Frontend', 'Backend', 'Database', 'Programming', 'Tools');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      CREATE TYPE "public"."social_link_context" AS ENUM('header', 'footer', 'contact');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  console.log("ENUMs done.");

  // Create tables (IF NOT EXISTS is supported for tables)
  await sql`
    CREATE TABLE IF NOT EXISTS "asset_file" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "cloudinary_public_id" text NOT NULL,
      "folder" "cloudinary_folder" NOT NULL,
      "url" text NOT NULL,
      "resource_type" "cloudinary_resource_type" DEFAULT 'image' NOT NULL,
      "format" text NOT NULL,
      "bytes" integer NOT NULL,
      "width" integer,
      "height" integer,
      "checksum" text NOT NULL,
      "alt_text" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "asset_file_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id"),
      CONSTRAINT "asset_file_checksum_unique" UNIQUE("checksum")
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "asset" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "asset_file_id" uuid NOT NULL,
      "used_in" text
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "asset"
        ADD CONSTRAINT "asset_asset_file_id_asset_file_id_fk"
        FOREIGN KEY ("asset_file_id") REFERENCES "public"."asset_file"("id") ON DELETE restrict;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "counter" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "label" text NOT NULL,
      "value" integer NOT NULL,
      "icon_name" text NOT NULL,
      "icon_platform" "icon_platform" DEFAULT 'lucide' NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "experience" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "role" text NOT NULL,
      "org" text,
      "period" text NOT NULL,
      "description" text NOT NULL,
      "points" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "icon_name" text NOT NULL,
      "icon_platform" "icon_platform" DEFAULT 'lucide' NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "profile_image" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "asset_id" uuid NOT NULL,
      "label" text NOT NULL,
      "is_active" boolean DEFAULT false NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "profile_image"
        ADD CONSTRAINT "profile_image_asset_id_asset_id_fk"
        FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "project" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" text NOT NULL,
      "title" text NOT NULL,
      "description" text NOT NULL,
      "tech" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "live_url" text,
      "github_url" text NOT NULL,
      "category" text NOT NULL,
      "timeline" text,
      "features" jsonb,
      "challenges" jsonb,
      "learnings" jsonb,
      "login_email" text,
      "login_password" text,
      "warning_message" text,
      "thumbnail_asset_id" uuid,
      "fullscreen_asset_id" uuid,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "project_slug_unique" UNIQUE("slug")
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "project"
        ADD CONSTRAINT "project_thumbnail_asset_id_asset_id_fk"
        FOREIGN KEY ("thumbnail_asset_id") REFERENCES "public"."asset"("id") ON DELETE set null;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "project"
        ADD CONSTRAINT "project_fullscreen_asset_id_asset_id_fk"
        FOREIGN KEY ("fullscreen_asset_id") REFERENCES "public"."asset"("id") ON DELETE set null;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "project_image" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "project_id" uuid NOT NULL,
      "asset_id" uuid NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "project_image"
        ADD CONSTRAINT "project_image_project_id_project_id_fk"
        FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "project_image"
        ADD CONSTRAINT "project_image_asset_id_asset_id_fk"
        FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "resume" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "asset_id" uuid NOT NULL,
      "label" text NOT NULL,
      "is_active" boolean DEFAULT false NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE "resume"
        ADD CONSTRAINT "resume_asset_id_asset_id_fk"
        FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "site_config" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "key" text NOT NULL,
      "value" text NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "site_config_key_unique" UNIQUE("key")
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "skill" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "category" "skill_category" NOT NULL,
      "icon_name" text NOT NULL,
      "icon_platform" "icon_platform" DEFAULT 'react-icons' NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "social_link" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "href" text NOT NULL,
      "icon_name" text NOT NULL,
      "icon_platform" "icon_platform" DEFAULT 'lucide' NOT NULL,
      "context" "social_link_context" NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "password" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "user_email_unique" UNIQUE("email")
    )
  `;

  console.log("All tables created successfully!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
