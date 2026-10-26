/**
 * Uploads the web-sized images in assets/live-images-web (see manifest.json) to the Media library and attaches
 * them to news stories, partners, team photos, two product pages and the Investors page.
 * Safe to re-run: images already in Media are reused, and anything that already has an image is left alone.
 *
 * Needs BLOB_READ_WRITE_TOKEN in .env.local when it has to upload (otherwise files would land on local disk, not on the
 * live site). Get it with `vercel env pull .env.local`, or upload the folder in /admin > Media and run this afterwards.
 *
 * Run:  npx pnpm@latest import-images
 */
import fs from "node:fs";
import path from "node:path";
import config from "@payload-config";
import { getPayload } from "payload";

const ctx = { disableRevalidate: true };
const norm = (s: string) => s.toLowerCase().replace(/&amp;/g, "&").replace(/[^a-z0-9]+/g, " ").trim();
const DIR = path.join(process.cwd(), "assets", "live-images-web");

type Item = { file: string; alt: string; kind: string; newsTitle?: string; person?: string; partner?: string };

async function run() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`images: ${m}`);
  const manifest: Item[] = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));

  // 1. Upload (or reuse) every image.
  const existing = (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs;
  const byName = new Map<string, (typeof existing)[number]>();
  for (const m of existing) if (m.filename) byName.set(m.filename.toLowerCase(), m);
  const toUpload = manifest.filter((i) => !byName.has(path.basename(i.file).toLowerCase()));
  if (toUpload.length > 0 && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      `\n${toUpload.length} images still need uploading, but BLOB_READ_WRITE_TOKEN is not set, so they would be saved to ` +
        `this computer instead of the live site.\nRun \`vercel env pull .env.local\` (or add the token to .env.local), ` +
        `or drag the folder into /admin > Media, then run this again.\n`,
    );
    process.exit(1);
  }
  const ids = new Map<string, string | number>();
  for (const item of manifest) {
    const name = path.basename(item.file).toLowerCase();
    let doc = byName.get(name);
    if (!doc) {
      doc = await payload.create({
        collection: "media",
        data: { alt: item.alt },
        filePath: path.join(DIR, item.file),
        context: ctx,
      });
      log(`uploaded ${item.file}`);
    }
    ids.set(item.file, doc.id);
  }

  // 2. News stories (match by headline; a repeated headline takes its images in order).
  const news = (await payload.find({ collection: "news", limit: 500, depth: 0, pagination: false, sort: "publishedOn" })).docs;
  let n = 0;
  const claimed = new Set<string | number>();
  for (const item of manifest.filter((i) => i.kind === "news" && i.newsTitle)) {
    const want = norm(item.newsTitle!);
    const story = news.find((s) => {
      const t = norm(s.title);
      return !claimed.has(s.id) && !s.image && (t === want || t.startsWith(want.slice(0, 60)) || want.startsWith(t.slice(0, 60)));
    });
    if (!story) {
      log(`no news story for "${item.newsTitle}" (${item.file})`);
      continue;
    }
    claimed.add(story.id);
    await payload.update({ collection: "news", id: story.id, data: { image: ids.get(item.file) as number }, context: ctx });
    n++;
  }
  log(`news: ${n} stories got an image`);

  // 3. Partner logos and team photos that are still empty.
  const partners = (await payload.find({ collection: "partners", limit: 100, depth: 0, pagination: false })).docs;
  for (const item of manifest.filter((i) => i.kind === "partner")) {
    const p = partners.find((x) => norm(x.name) === norm(item.partner ?? "") && !x.logo);
    if (p) {
      await payload.update({ collection: "partners", id: p.id, data: { logo: ids.get(item.file) as number }, context: ctx });
      log(`partner "${p.name}" <- ${item.file}`);
    }
  }
  const team = (await payload.find({ collection: "team", limit: 100, depth: 0, pagination: false })).docs;
  for (const item of manifest.filter((i) => i.kind === "person")) {
    const last = norm((item.person ?? "").split(/\s+/).pop() ?? "");
    const t = team.find((x) => !(x as { photo?: unknown }).photo && norm(x.name).includes(last));
    if (t) {
      await payload.update({ collection: "team", id: t.id, data: { photo: ids.get(item.file) } as never, context: ctx });
      log(`team "${t.name}" <- ${item.file}`);
    }
  }

  // 4. Products: hero images and the flax plant section.
  const products = (await payload.find({ collection: "products", limit: 20, depth: 0, pagination: false })).docs;
  const setHero = async (slug: string, file: string) => {
    const p = products.find((x) => x.slug === slug);
    const id = ids.get(file);
    if (p && id && !p.heroImage) {
      await payload.update({ collection: "products", id: p.id, data: { heroImage: id as number }, context: ctx });
      log(`product ${slug} hero <- ${file}`);
    }
  };
  await setHero("cat-litter", "cat-litter/pcl-bag-mockup-new.webp");
  await setHero("animal-bedding", "animal-bedding/bag-2.webp");

  const pellets = products.find((x) => x.slug === "fuel-pellets");
  const flower = ids.get("fuel-pellets/flax-flower-opt.webp");
  if (pellets && flower && Array.isArray(pellets.sections)) {
    const sections = pellets.sections.map((s) =>
      s.heading === "The flax plant" && !s.image ? { ...s, image: flower as number, imagePlaceholder: false } : s,
    );
    await payload.update({ collection: "products", id: pellets.id, data: { sections } as never, context: ctx });
    log("fuel pellets: flax plant section image set");
  }

  // 5. Investors page: facility photo in the "In production" block.
  const facility = ids.get("investors/facilityy-1.webp");
  const inv = (await payload.find({ collection: "pages", where: { slug: { equals: "investors" } }, limit: 1, depth: 0 })).docs[0];
  if (inv && facility && Array.isArray(inv.layout)) {
    let changed = false;
    const layout = inv.layout.map((b) => {
      if (b.blockType === "imageText" && !b.image && /in co-op stores/i.test(b.heading ?? "")) {
        changed = true;
        return { ...b, image: facility as number, imagePlaceholder: false };
      }
      return b;
    });
    if (changed) {
      await payload.update({ collection: "pages", id: inv.id, data: { layout } as never, context: ctx });
      log("investors: facility photo set");
    }
  }

  log("done. Save any page in /admin to refresh the site cache.");
  process.exit(0);
}

// `payload run` exits when the import settles, so the work must be awaited at top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
