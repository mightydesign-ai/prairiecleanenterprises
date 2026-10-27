/**
 * Shrinks the Media library: every image fits inside 1024 x 1024 (1600 for diagrams and charts, which have small
 * text), and PNG/JPEG become WebP. Images keep their Media record, so every page, story, product and photo that uses
 * them keeps working; alt text and captions are untouched.
 *
 *   npx pnpm@latest optimize-media              DRY RUN: backs up the originals and prints a before/after table. Changes nothing.
 *   APPLY=1 npx pnpm@latest optimize-media      does it, then checks every file loads from storage.
 *
 * Originals are saved to assets/media-backup/ first. Needs BLOB_READ_WRITE_TOKEN in .env.local.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

// The upload settings in the Media collection (1024 px + WebP) are switched off for this run: this script has already
// done that work, and diagrams are allowed to be larger.
process.env.MEDIA_PASSTHROUGH = "1";

const APPLY = process.env.APPLY === "1";
const LIMIT = 1024;
const LIMIT_DIAGRAM = 1600;
const DIAGRAM = /diagram|chart|flow|value-chain|biomass-transparent|infographic/i;
const KEEP_BELOW = 300 * 1024; // a WebP already inside the limit and under 300 KB is left alone
const BACKUP = path.join(process.cwd(), "assets", "media-backup");
const kb = (n: number) => `${Math.round(n / 1024)} KB`;

type Plan = {
  id: string | number;
  oldName: string;
  newName: string;
  before: { bytes: number; w: number; h: number };
  after: { bytes: number; w: number; h: number };
  buffer: Buffer;
};

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3]?.toLowerCase();
  if (!token || !storeId) {
    console.error("BLOB_READ_WRITE_TOKEN is not set in .env.local.");
    process.exit(1);
  }
  const base = `https://${storeId}.public.blob.vercel-storage.com`;
  const { default: config } = await import("@payload-config");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config });
  const media = (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs;
  const names = new Set(media.map((m) => String(m.filename).toLowerCase()));
  fs.mkdirSync(BACKUP, { recursive: true });

  const plans: Plan[] = [];
  const unchanged: string[] = [];
  const svgs: string[] = [];

  for (const doc of media) {
    const name = String(doc.filename);
    const res = await fetch(`${base}/${encodeURIComponent(name)}`);
    if (!res.ok) {
      console.log(`!! ${name}: not in storage (${res.status}), skipped`);
      continue;
    }
    const original = Buffer.from(await res.arrayBuffer());
    const backupPath = path.join(BACKUP, name);
    if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, original);

    const mime = String(doc.mimeType);
    if (mime === "image/svg+xml") {
      const text = original.toString("utf8");
      svgs.push(
        `${name}  ${kb(original.length)}  embedded pictures: ${(text.match(/data:image\//g) ?? []).length}, paths: ${(text.match(/<path/g) ?? []).length}`,
      );
      continue;
    }
    if (!/^image\/(png|jpeg|webp)$/.test(mime)) continue;

    const meta = await sharp(original).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const max = DIAGRAM.test(name) ? LIMIT_DIAGRAM : LIMIT;
    const tooBig = Math.max(w, h) > max;
    if (mime === "image/webp" && !tooBig && original.length <= KEEP_BELOW) {
      unchanged.push(name);
      continue;
    }
    const quality = meta.hasAlpha || DIAGRAM.test(name) ? 88 : 82;
    const out = await sharp(original)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .webp({ quality, alphaQuality: 100, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    if (mime === "image/webp" && !tooBig && out.data.length >= original.length) {
      unchanged.push(name);
      continue;
    }
    let newName = name.replace(/\.[a-z0-9]+$/i, "") + ".webp";
    if (newName.toLowerCase() !== name.toLowerCase() && names.has(newName.toLowerCase())) newName = newName.replace(/\.webp$/, "-opt.webp");
    plans.push({
      id: doc.id,
      oldName: name,
      newName,
      before: { bytes: original.length, w, h },
      after: { bytes: out.data.length, w: out.info.width, h: out.info.height },
      buffer: out.data,
    });
  }

  // ---- report ------------------------------------------------------------------------------------------------
  const lines = plans.map(
    (p) => `${p.oldName.padEnd(58)} ${kb(p.before.bytes).padStart(8)} ${`${p.before.w}x${p.before.h}`.padStart(10)}  ->  ${p.newName.padEnd(58)} ${kb(p.after.bytes).padStart(8)} ${`${p.after.w}x${p.after.h}`.padStart(10)}`,
  );
  const before = plans.reduce((a, p) => a + p.before.bytes, 0);
  const after = plans.reduce((a, p) => a + p.after.bytes, 0);
  const report = [
    ...lines,
    "",
    `${plans.length} images to change: ${kb(before)} -> ${kb(after)} (saves ${kb(before - after)})`,
    `${unchanged.length} already fine, left alone`,
    svgs.length ? `\nSVG files (not touched):\n${svgs.join("\n")}` : "",
  ].join("\n");
  fs.writeFileSync(path.join(BACKUP, "report.txt"), report);
  console.log("\n" + report + "\n");
  console.log(`Originals are saved in ${BACKUP}`);

  if (!APPLY) {
    console.log("\nDRY RUN: nothing was changed. To apply, run:  APPLY=1 npx pnpm@latest optimize-media");
    process.exit(0);
  }

  // ---- apply -------------------------------------------------------------------------------------------------
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pce-opt-"));
  const toCheck: string[] = [];
  let done = 0;
  for (const p of plans) {
    const before = media.find((m) => m.id === p.id)!;
    const oldKeys = [before.filename, ...Object.values(before.sizes ?? {}).map((s) => (s as { filename?: string | null } | undefined)?.filename)].filter(
      (k): k is string => Boolean(k),
    );
    const file = path.join(tmp, p.newName);
    fs.writeFileSync(file, p.buffer);
    const updated = await payload.update({ collection: "media", id: p.id, data: {}, filePath: file, context: { disableRevalidate: true } });

    // Make sure the files are in storage under the names the record now expects.
    const uploads: [string, Buffer][] = [[String(updated.filename), p.buffer]];
    for (const s of Object.values(updated.sizes ?? {})) {
      const size = s as { filename?: string | null; width?: number | null; height?: number | null } | undefined;
      if (size?.filename && size.width && size.height) {
        uploads.push([size.filename, await sharp(p.buffer).resize(size.width, size.height, { fit: "cover" }).webp({ quality: 80 }).toBuffer()]);
      }
    }
    for (const [key, body] of uploads) {
      await put(key, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "image/webp", token });
      toCheck.push(key);
    }
    const keep = new Set(uploads.map(([k]) => k));
    const stale = oldKeys.filter((k) => !keep.has(k)).map((k) => `${base}/${k}`);
    if (stale.length) await del(stale, { token }).catch(() => undefined);
    done++;
    console.log(`${done}/${plans.length} ${p.oldName} -> ${updated.filename}`);
  }

  let bad = 0;
  for (const key of toCheck) {
    const r = await fetch(`${base}/${encodeURIComponent(key)}`, { headers: { Range: "bytes=0-0" } });
    if (!r.ok && r.status !== 206) {
      bad++;
      console.log(`MISSING in storage: ${key} (${r.status})`);
    }
  }
  console.log(`\nDone: ${done} images optimised, ${toCheck.length} files checked, ${bad} missing. Save any page in /admin to refresh the site cache.`);
  process.exit(bad ? 1 : 0);
}

// `payload run` exits when the import settles, so the work must be awaited at top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
