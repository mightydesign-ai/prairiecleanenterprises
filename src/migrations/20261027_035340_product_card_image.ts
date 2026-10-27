import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_card_image_focus" AS ENUM('default', 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
  CREATE TYPE "public"."enum__products_v_version_card_image_focus" AS ENUM('default', 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
  ALTER TABLE "products" ADD COLUMN "card_image_id" integer;
  ALTER TABLE "products" ADD COLUMN "card_image_focus" "enum_products_card_image_focus" DEFAULT 'default';
  ALTER TABLE "_products_v" ADD COLUMN "version_card_image_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_card_image_focus" "enum__products_v_version_card_image_focus" DEFAULT 'default';
  ALTER TABLE "products" ADD CONSTRAINT "products_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_card_image_idx" ON "products" USING btree ("card_image_id");
  CREATE INDEX "_products_v_version_version_card_image_idx" ON "_products_v" USING btree ("version_card_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP CONSTRAINT "products_card_image_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_card_image_id_media_id_fk";
  
  DROP INDEX "products_card_image_idx";
  DROP INDEX "_products_v_version_version_card_image_idx";
  ALTER TABLE "products" DROP COLUMN "card_image_id";
  ALTER TABLE "products" DROP COLUMN "card_image_focus";
  ALTER TABLE "_products_v" DROP COLUMN "version_card_image_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_card_image_focus";
  DROP TYPE "public"."enum_products_card_image_focus";
  DROP TYPE "public"."enum__products_v_version_card_image_focus";`)
}
