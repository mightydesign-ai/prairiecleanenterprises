import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_typography_page_title_step" AS ENUM('default', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7');
  CREATE TYPE "public"."enum_site_settings_typography_section_heading_step" AS ENUM('default', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7');
  CREATE TYPE "public"."enum_site_settings_typography_card_title_step" AS ENUM('default', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7');
  CREATE TYPE "public"."enum_site_settings_typography_small_title_step" AS ENUM('default', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7');
  ALTER TABLE "site_settings" ADD COLUMN "typography_page_title_step" "enum_site_settings_typography_page_title_step" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_section_heading_step" "enum_site_settings_typography_section_heading_step" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_card_title_step" "enum_site_settings_typography_card_title_step" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_small_title_step" "enum_site_settings_typography_small_title_step" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "typography_page_title_step";
  ALTER TABLE "site_settings" DROP COLUMN "typography_section_heading_step";
  ALTER TABLE "site_settings" DROP COLUMN "typography_card_title_step";
  ALTER TABLE "site_settings" DROP COLUMN "typography_small_title_step";
  DROP TYPE "public"."enum_site_settings_typography_page_title_step";
  DROP TYPE "public"."enum_site_settings_typography_section_heading_step";
  DROP TYPE "public"."enum_site_settings_typography_card_title_step";
  DROP TYPE "public"."enum_site_settings_typography_small_title_step";`)
}
