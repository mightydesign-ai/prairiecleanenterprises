/**
 * Removes the Media records (and stored files) created by an earlier `import-images` run, using the `oldFile` names
 * in assets/live-images-web/manifest.json, so the images can be imported again under their new page-based names.
 * Anything that used one of those images is simply emptied; `import-images` fills it again.
 * Only files listed as `oldFile` are touched; other media is left alone.
 *
 * Run:  npx pnpm@latest reset-images       (or `images:rebuild` to do reset + import + upload in one go)
 */
import fs from "node:fs";
import path from "node:path";
import { del } from "@vercel/blob";
import config from "@payload-config";
import { getPayload } from "payload";

const DIR = path.join(process.cwd(), "assets", "live-images-web");

async function run() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`reset: ${m}`);
  const manifest: { file: string; oldFile?: string }[] = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
  const media = (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs;
  const byName = new Map(media.map((m) => [String(m.filename).toLowerCase(), m]));
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  let removed = 0;
  for (const item of manifest) {
    if (!item.oldFile) continue;
    const doc = byName.get(path.basename(item.oldFile).toLowerCase());
    if (!doc) continue;
    const keys = [doc.filename, ...Object.values(doc.sizes ?? {}).map((s) => (s as { filename?: string | null } | undefined)?.filename)].filter(
      (k): k is string => Boolean(k),
    );
    await payload.delete({ collection: "media", id: doc.id, context: { disableRevalidate: true } });
    if (token) {
      try {
        await del(keys.map((k) => `https://${token.split("_")[3]?.toLowerCase()}.public.blob.vercel-storage.com/${k}`), { token });
      } catch {
        // already gone: fine
      }
    }
    removed++;
  }
  log(`removed ${removed} old Media records`);
  process.exit(0);
}

// `payload run` exits when the import settles, so the work must be awaited at top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
