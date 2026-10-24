import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The initial migration was generated without BLOB_READ_WRITE_TOKEN, so the Vercel Blob storage plugin
 * never added its hidden `_objectKey` column. With the token set in production every media query failed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "resumes" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
  ALTER TABLE "resumes" DROP COLUMN IF EXISTS "_objectkey";`)
}
