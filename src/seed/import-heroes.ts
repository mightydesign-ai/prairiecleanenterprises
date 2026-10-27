/**
 * Pulls the hero banners from the live site (they are CSS background images, so the first image scrape missed them),
 * resizes each to fit 1024 x 1024, saves it as WebP, and adds it to the Media library under a name that says which page
 * it belongs to (hero-about.webp, hero-news.webp, ...). Nothing is attached to a page; pick them in the admin.
 *
 *   npx pnpm@latest import-heroes
 *
 * Safe to run again: images already in Media are skipped. Originals are saved in assets/live-images/heroes/ and the
 * resized files in assets/live-images-web/heroes/. Needs BLOB_READ_WRITE_TOKEN in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";

// This script does its own resizing, so the Media upload settings are switched off for it.
process.env.MEDIA_PASSTHROUGH = "1";

const SITE = "https://prairiecleanenterprises.com/wp-content/uploads";
const HEROES: { name: string; url: string; page: string }[] = [
  { name: "hero-home", url: `${SITE}/2021/05/top-view-0029.jpg`, page: "Home" },
  { name: "hero-about", url: `${SITE}/2022/04/20201007GregHuszar0128.jpg`, page: "About" },
  { name: "hero-sustainability-and-fuel-pellets", url: `${SITE}/2022/04/Flax-pellets-web.png`, page: "Sustainability and Fuel pellets" },
  { name: "hero-flax-fibre", url: `${SITE}/2025/02/flax-1200x.jpg`, page: "Flax fibre" },
  { name: "hero-cat-litter", url: `${SITE}/2026/03/ADEP-25-06-1-RAW-400-scaled.png`, page: "Cat litter" },
  { name: "hero-animal-bedding", url: `${SITE}/2025/01/animal-bedding-opt.jpg`, page: "Animal bedding" },
  { name: "hero-investors", url: `${SITE}/2026/03/PCE-Rotochopper-hero-opt.png`, page: "Investors" },
  { name: "hero-sell-your-straw", url: `${SITE}/2021/09/20201015GregHuszar4085.jpg`, page: "Sell your straw" },
  { name: "hero-news", url: `${SITE}/2021/04/news2.jpg`, page: "News" },
  { name: "hero-careers", url: `${SITE}/2022/03/20201015GregHuszar4079.jpg`, page: "Careers" },
  { name: "hero-contact", url: `${SITE}/2021/05/push-hay-1601.jpg`, page: "Contact" },
  { name: "hero-banner-bulldozer", url: `${SITE}/2024/12/bulldozer-dark-opt.jpg`, page: "Closing banner (shared by several pages)" },
];

const kb = (n: number) => `${Math.round(n / 1024)} KB`;
const ORIG = path.join(process.cwd(), "assets", "live-images", "heroes");
const WEB = path.join(process.cwd(), "assets", "live-images-web", "heroes");

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3]?.toLowerCase();
  if (!token || !storeId) {
    console.error("BLOB_READ_WRITE_TOKEN is not set in .env.local.");
    process.exit(1);
  }
  fs.mkdirSync(ORIG, { recursive: true });
  fs.mkdirSync(WEB, { recursive: true });

  const { default: config } = await import("@payload-config");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config });
  const existing = new Set(
    (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs.map((m) => String(m.filename).toLowerCase()),
  );

  const keys: string[] = [];
  let added = 0;
  for (const h of HEROES) {
    const file = `${h.name}.webp`;
    if (existing.has(file)) {
      console.log(`skip   ${file} (already in Media)`);
      continue;
    }
    const res = await fetch(h.url);
    if (!res.ok) {
      console.log(`FAILED ${h.url} (${res.status})`);
      continue;
    }
    const original = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(ORIG, path.basename(new URL(h.url).pathname)), original);
    const out = await sharp(original)
      .rotate()
      .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const local = path.join(WEB, file);
    fs.writeFileSync(local, out.data);

    const doc = await payload.create({
      collection: "media",
      data: { alt: `${h.page} hero banner`, decorative: true },
      filePath: local,
      context: { disableRevalidate: true },
    });

    // Put the files in storage under exactly the names the record expects.
    const uploads: [string, Buffer][] = [[String(doc.filename), out.data]];
    for (const s of Object.values(doc.sizes ?? {})) {
      const size = s as { filename?: string | null; width?: number | null; height?: number | null } | undefined;
      if (size?.filename && size.width && size.height) {
        uploads.push([size.filename, await sharp(out.data).resize(size.width, size.height, { fit: "cover" }).webp({ quality: 80 }).toBuffer()]);
      }
    }
    for (const [key, body] of uploads) {
      await put(key, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "image/webp", token });
      keys.push(key);
    }
    added++;
    console.log(`added  ${doc.filename}  ${kb(original.length)} -> ${kb(out.data.length)}  ${out.info.width}x${out.info.height}   (${h.page})`);
  }

  let bad = 0;
  for (const key of keys) {
    const r = await fetch(`https://${storeId}.public.blob.vercel-storage.com/${encodeURIComponent(key)}`, { headers: { Range: "bytes=0-0" } });
    if (!r.ok && r.status !== 206) {
      bad++;
      console.log(`MISSING in storage: ${key} (${r.status})`);
    }
  }
  console.log(`\nDone: ${added} hero images added, ${keys.length} files checked, ${bad} missing.`);
  process.exit(bad ? 1 : 0);
}

try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
