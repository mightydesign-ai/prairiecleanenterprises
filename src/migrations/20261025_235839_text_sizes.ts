import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_typography_card_title_size" AS ENUM('xs', 'sm', 'default', 'lg', 'xl');
  CREATE TYPE "public"."enum_site_settings_typography_section_heading_size" AS ENUM('xs', 'sm', 'default', 'lg', 'xl');
  ALTER TABLE "site_settings" ADD COLUMN "typography_card_title_size" "enum_site_settings_typography_card_title_size" DEFAULT 'default';
  ALTER TABLE "site_settings" ADD COLUMN "typography_section_heading_size" "enum_site_settings_typography_section_heading_size" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "typography_card_title_size";
  ALTER TABLE "site_settings" DROP COLUMN "typography_section_heading_size";
  DROP TYPE "public"."enum_site_settings_typography_card_title_size";
  DROP TYPE "public"."enum_site_settings_typography_section_heading_size";`)
}
