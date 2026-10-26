import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cards_image_position" AS ENUM('above', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cards_image_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_cards_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cards_image_vertical_align" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_image_position" AS ENUM('above', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_image_size" AS ENUM('sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_image_vertical_align" AS ENUM('top', 'center');
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "show_border" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "image_position" "enum_pages_blocks_cards_image_position" DEFAULT 'left';
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "image_size" "enum_pages_blocks_cards_image_size" DEFAULT 'md';
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "alignment" "enum_pages_blocks_cards_alignment" DEFAULT 'left';
  ALTER TABLE "pages_blocks_cards" ADD COLUMN "image_vertical_align" "enum_pages_blocks_cards_image_vertical_align" DEFAULT 'center';
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "show_border" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "image_position" "enum__pages_v_blocks_cards_image_position" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "image_size" "enum__pages_v_blocks_cards_image_size" DEFAULT 'md';
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "alignment" "enum__pages_v_blocks_cards_alignment" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_cards" ADD COLUMN "image_vertical_align" "enum__pages_v_blocks_cards_image_vertical_align" DEFAULT 'center';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cards" DROP COLUMN "show_border";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "image_position";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "image_size";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "alignment";
  ALTER TABLE "pages_blocks_cards" DROP COLUMN "image_vertical_align";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "show_border";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "image_position";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "image_size";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "alignment";
  ALTER TABLE "_pages_v_blocks_cards" DROP COLUMN "image_vertical_align";
  DROP TYPE "public"."enum_pages_blocks_cards_image_position";
  DROP TYPE "public"."enum_pages_blocks_cards_image_size";
  DROP TYPE "public"."enum_pages_blocks_cards_alignment";
  DROP TYPE "public"."enum_pages_blocks_cards_image_vertical_align";
  DROP TYPE "public"."enum__pages_v_blocks_cards_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_cards_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_cards_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_cards_image_vertical_align";`)
}
