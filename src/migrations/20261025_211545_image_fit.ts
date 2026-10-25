import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_image_fit" AS ENUM('crop', 'full');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_fit" AS ENUM('crop', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_image_fit" AS ENUM('crop', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_fit" AS ENUM('crop', 'full');
  CREATE TYPE "public"."enum_products_sections_image_fit" AS ENUM('crop', 'full');
  CREATE TYPE "public"."enum__products_v_version_sections_image_fit" AS ENUM('crop', 'full');
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "image_fit" "enum_pages_blocks_hero_image_fit" DEFAULT 'crop';
  ALTER TABLE "pages_blocks_image_text" ADD COLUMN "image_fit" "enum_pages_blocks_image_text_image_fit" DEFAULT 'crop';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "image_fit" "enum__pages_v_blocks_hero_image_fit" DEFAULT 'crop';
  ALTER TABLE "_pages_v_blocks_image_text" ADD COLUMN "image_fit" "enum__pages_v_blocks_image_text_image_fit" DEFAULT 'crop';
  ALTER TABLE "products_sections" ADD COLUMN "image_fit" "enum_products_sections_image_fit" DEFAULT 'crop';
  ALTER TABLE "_products_v_version_sections" ADD COLUMN "image_fit" "enum__products_v_version_sections_image_fit" DEFAULT 'crop';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP COLUMN "image_fit";
  ALTER TABLE "pages_blocks_image_text" DROP COLUMN "image_fit";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "image_fit";
  ALTER TABLE "_pages_v_blocks_image_text" DROP COLUMN "image_fit";
  ALTER TABLE "products_sections" DROP COLUMN "image_fit";
  ALTER TABLE "_products_v_version_sections" DROP COLUMN "image_fit";
  DROP TYPE "public"."enum_pages_blocks_hero_image_fit";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_fit";
  DROP TYPE "public"."enum__pages_v_blocks_hero_image_fit";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_fit";
  DROP TYPE "public"."enum_products_sections_image_fit";
  DROP TYPE "public"."enum__products_v_version_sections_image_fit";`)
}
