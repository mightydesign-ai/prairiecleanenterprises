import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_text_image_side" AS ENUM('right', 'left', 'below');
  CREATE TYPE "public"."enum_pages_blocks_image_text_tone" AS ENUM('light', 'tinted', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_side" AS ENUM('right', 'left', 'below');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_tone" AS ENUM('light', 'tinted', 'dark');
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"image_placeholder" boolean DEFAULT false,
  	"image_side" "enum_pages_blocks_image_text_image_side" DEFAULT 'right',
  	"tone" "enum_pages_blocks_image_text_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"image_placeholder" boolean DEFAULT false,
  	"image_side" "enum__pages_v_blocks_image_text_image_side" DEFAULT 'right',
  	"tone" "enum__pages_v_blocks_image_text_tone" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_placeholder" boolean DEFAULT false
  );
  
  CREATE TABLE "_products_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_placeholder" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_sections" ADD CONSTRAINT "products_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_sections" ADD CONSTRAINT "products_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_sections" ADD CONSTRAINT "_products_v_version_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_sections" ADD CONSTRAINT "_products_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "products_sections_order_idx" ON "products_sections" USING btree ("_order");
  CREATE INDEX "products_sections_parent_id_idx" ON "products_sections" USING btree ("_parent_id");
  CREATE INDEX "products_sections_image_idx" ON "products_sections" USING btree ("image_id");
  CREATE INDEX "_products_v_version_sections_order_idx" ON "_products_v_version_sections" USING btree ("_order");
  CREATE INDEX "_products_v_version_sections_parent_id_idx" ON "_products_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_sections_image_idx" ON "_products_v_version_sections" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "products_sections" CASCADE;
  DROP TABLE "_products_v_version_sections" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_image_text_image_side";
  DROP TYPE "public"."enum_pages_blocks_image_text_tone";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_tone";`)
}
