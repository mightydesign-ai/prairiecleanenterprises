/**
 * Repair: copies the image files from assets/live-images-web straight into the site's Vercel Blob store, under the
 * names the Media records already expect (the main file plus its resized copies). Use it when `import-images`
 * created the Media records but the files are missing from storage (the site then shows 404 for them).
 * Needs BLOB_READ_WRITE_TOKEN in .env.local. Safe to re-run: files are overwritten in place.
 *
 * Run:  npx pnpm@latest upload-blob
 */
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import config from "@payload-config";
import { getPayload } from "payload";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "assets", "live-images-web");

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN is not set in .env.local.");
    process.exit(1);
  }
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`blob: ${m}`);
  const manifest: { file: string }[] = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
  const media = (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs;
  const byName = new Map(media.map((m) => [String(m.filename).toLowerCase(), m]));

  let files = 0;
  let missing = 0;
  for (const item of manifest) {
    const doc = byName.get(path.basename(item.file).toLowerCase());
    if (!doc || !doc.filename) {
      log(`no Media record for ${item.file}`);
      missing++;
      continue;
    }
    const source = fs.readFileSync(path.join(DIR, item.file));
    const mime = doc.mimeType || (item.file.endsWith(".svg") ? "image/svg+xml" : "image/webp");
    const upload = async (key: string, body: Buffer) => {
      await put(key, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: mime, token });
      files++;
    };
    await upload(doc.filename, source);
    for (const size of Object.values(doc.sizes ?? {})) {
      const s = size as { filename?: string | null; width?: number | null; height?: number | null } | undefined;
      if (!s?.filename || !s.width || !s.height || mime === "image/svg+xml") continue;
      await upload(s.filename, await sharp(source).resize(s.width, s.height, { fit: "cover" }).webp({ quality: 82 }).toBuffer());
    }
    log(`${doc.filename} ok`);
  }
  log(`done: ${files} files uploaded, ${missing} images without a Media record. Save any page in /admin to refresh the site cache.`);
  process.exit(0);
}

// `payload run` exits when the import settles, so the work must be awaited at top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
