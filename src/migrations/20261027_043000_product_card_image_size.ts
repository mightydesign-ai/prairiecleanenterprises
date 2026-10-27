import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_card_image_width" AS ENUM('100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5');
  CREATE TYPE "public"."enum__products_v_version_card_image_width" AS ENUM('100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5');
  ALTER TABLE "products" ADD COLUMN "card_image_width" "enum_products_card_image_width" DEFAULT '100';
  ALTER TABLE "_products_v" ADD COLUMN "version_card_image_width" "enum__products_v_version_card_image_width" DEFAULT '100';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "card_image_width";
  ALTER TABLE "_products_v" DROP COLUMN "version_card_image_width";
  DROP TYPE "public"."enum_products_card_image_width";
  DROP TYPE "public"."enum__products_v_version_card_image_width";`)
}
