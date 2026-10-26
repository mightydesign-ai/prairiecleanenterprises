import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_steps_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_product_list_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_news_list_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_team_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_product_list_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_news_list_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_team_columns" AS ENUM('auto', '1', '2', '3', '4', '5', '6');
  ALTER TYPE "public"."enum_pages_blocks_cards_columns" ADD VALUE '1' BEFORE '2';
  ALTER TYPE "public"."enum_pages_blocks_cards_columns" ADD VALUE '4';
  ALTER TYPE "public"."enum_pages_blocks_cards_columns" ADD VALUE '5';
  ALTER TYPE "public"."enum_pages_blocks_cards_columns" ADD VALUE '6';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_columns" ADD VALUE '1' BEFORE '2';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_columns" ADD VALUE '4';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_columns" ADD VALUE '5';
  ALTER TYPE "public"."enum__pages_v_blocks_cards_columns" ADD VALUE '6';
  ALTER TABLE "pages_blocks_steps" ADD COLUMN "columns" "enum_pages_blocks_steps_columns" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_product_list" ADD COLUMN "columns" "enum_pages_blocks_product_list_columns" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_news_list" ADD COLUMN "columns" "enum_pages_blocks_news_list_columns" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_team" ADD COLUMN "columns" "enum_pages_blocks_team_columns" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_steps" ADD COLUMN "columns" "enum__pages_v_blocks_steps_columns" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_product_list" ADD COLUMN "columns" "enum__pages_v_blocks_product_list_columns" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_news_list" ADD COLUMN "columns" "enum__pages_v_blocks_news_list_columns" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN "columns" "enum__pages_v_blocks_team_columns" DEFAULT 'auto';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cards" ALTER COLUMN "columns" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cards" ALTER COLUMN "columns" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('auto', '2', '3');
  ALTER TABLE "pages_blocks_cards" ALTER COLUMN "columns" SET DEFAULT 'auto'::"public"."enum_pages_blocks_cards_columns";
  ALTER TABLE "pages_blocks_cards" ALTER COLUMN "columns" SET DATA TYPE "public"."enum_pages_blocks_cards_columns" USING "columns"::"public"."enum_pages_blocks_cards_columns";
  ALTER TABLE "_pages_v_blocks_cards" ALTER COLUMN "columns" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cards" ALTER COLUMN "columns" SET DEFAULT 'auto'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cards_columns";
  CREATE TYPE "public"."enum__pages_v_blocks_cards_columns" AS ENUM('auto', '2', '3');
  ALTER TABLE "_pages_v_blocks_cards" ALTER COLUMN "columns" SET DEFAULT 'auto'::"public"."enum__pages_v_blocks_cards_columns";
  ALTER TABLE "_pages_v_blocks_cards" ALTER COLUMN "columns" SET DATA TYPE "public"."enum__pages_v_blocks_cards_columns" USING "columns"::"public"."enum__pages_v_blocks_cards_columns";
  ALTER TABLE "pages_blocks_steps" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_product_list" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_news_list" DROP COLUMN "columns";
  ALTER TABLE "pages_blocks_team" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_steps" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_product_list" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_news_list" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN "columns";
  DROP TYPE "public"."enum_pages_blocks_steps_columns";
  DROP TYPE "public"."enum_pages_blocks_product_list_columns";
  DROP TYPE "public"."enum_pages_blocks_news_list_columns";
  DROP TYPE "public"."enum_pages_blocks_team_columns";
  DROP TYPE "public"."enum__pages_v_blocks_steps_columns";
  DROP TYPE "public"."enum__pages_v_blocks_product_list_columns";
  DROP TYPE "public"."enum__pages_v_blocks_news_list_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_columns";`)
}
