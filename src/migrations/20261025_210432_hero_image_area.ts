import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" ADD COLUMN "show_image_area" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "show_image_area" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP COLUMN "show_image_area";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "show_image_area";`)
}
