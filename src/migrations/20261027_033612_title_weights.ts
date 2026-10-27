import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_typography_page_title_weight" AS ENUM('default', '400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_site_settings_typography_section_heading_weight" AS ENUM('default', '400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_site_settings_typography_card_title_weight" AS ENUM('default', '400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_site_settings_typography_small_title_weight" AS ENUM('default', '400', '500', '600', '700', '800');
  ALTER TABLE "site_settings" ADD COLUMN "typography_page_title_weight" "enum_site_settings_typography_page_title_weight" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_section_heading_weight" "enum_site_settings_typography_section_heading_weight" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_card_title_weight" "enum_site_settings_typography_card_title_weight" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_small_title_weight" "enum_site_settings_typography_small_title_weight" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "typography_page_title_weight";
  ALTER TABLE "site_settings" DROP COLUMN "typography_section_heading_weight";
  ALTER TABLE "site_settings" DROP COLUMN "typography_card_title_weight";
  ALTER TABLE "site_settings" DROP COLUMN "typography_small_title_weight";
  DROP TYPE "public"."enum_site_settings_typography_page_title_weight";
  DROP TYPE "public"."enum_site_settings_typography_section_heading_weight";
  DROP TYPE "public"."enum_site_settings_typography_card_title_weight";
  DROP TYPE "public"."enum_site_settings_typography_small_title_weight";`)
}
