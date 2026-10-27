/**
 * Puts the hero banners from `import-heroes` onto their pages: the first Hero block of Home, About, Sustainability,
 * Sell your straw, Investors and Contact, and the hero image of the four product pages. Anything that already has an
 * image is left alone. News and Careers have no hero image field, so their banners stay in Media.
 *
 *   npx pnpm@latest attach-heroes
 */
import config from "@payload-config";
import { getPayload } from "payload";

const ctx = { disableRevalidate: true };

const PAGES: Record<string, string> = {
  home: "hero-home.webp",
  about: "hero-about.webp",
  sustainability: "hero-sustainability-and-fuel-pellets.webp",
  "sell-your-straw": "hero-sell-your-straw.webp",
  investors: "hero-investors.webp",
  contact: "hero-contact.webp",
};
const PRODUCTS: Record<string, string> = {
  "flax-fibre": "hero-flax-fibre.webp",
  "fuel-pellets": "hero-sustainability-and-fuel-pellets.webp",
  "cat-litter": "hero-cat-litter.webp",
  "animal-bedding": "hero-animal-bedding.webp",
};

async function run() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`heroes: ${m}`);
  const media = (await payload.find({ collection: "media", limit: 2000, depth: 0, pagination: false })).docs;
  const idOf = (file: string) => media.find((m) => m.filename === file)?.id;

  for (const [slug, file] of Object.entries(PAGES)) {
    const id = idOf(file);
    if (!id) {
      log(`MISSING ${file} in Media (run import-heroes first)`);
      continue;
    }
    const page = (await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0];
    if (!page || !Array.isArray(page.layout)) {
      log(`page "${slug}" not found`);
      continue;
    }
    const i = page.layout.findIndex((b) => b.blockType === "hero");
    const hero = page.layout[i] as { image?: unknown } | undefined;
    if (i < 0 || !hero) {
      log(`${slug}: no hero block`);
      continue;
    }
    if (hero.image) {
      log(`${slug}: already has a hero image, left alone`);
      continue;
    }
    const layout = page.layout.map((b, n) => (n === i ? { ...b, image: id, showImageArea: true } : b));
    await payload.update({ collection: "pages", id: page.id, data: { layout } as never, context: ctx });
    log(`${slug} <- ${file}`);
  }

  for (const [slug, file] of Object.entries(PRODUCTS)) {
    const id = idOf(file);
    if (!id) {
      log(`MISSING ${file} in Media (run import-heroes first)`);
      continue;
    }
    const p = (await payload.find({ collection: "products", where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0];
    if (!p) {
      log(`product "${slug}" not found`);
      continue;
    }
    if (p.heroImage) {
      log(`${slug}: already has a hero image, left alone`);
      continue;
    }
    await payload.update({ collection: "products", id: p.id, data: { heroImage: id } as never, context: ctx });
    log(`${slug} <- ${file}`);
  }

  log("done. Save any page in /admin to refresh the site cache.");
  process.exit(0);
}

try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
