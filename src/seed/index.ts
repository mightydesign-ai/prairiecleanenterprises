/**
 * Seeds the site with content from the current prairiecleanenterprises.com and recent press.
 * Run once on an empty database:  pnpm seed
 * Set SEED_RESET=1 to wipe seeded content first (never touches users or form submissions).
 */
import config from "@payload-config";
import { getPayload } from "payload";
import { homePage, otherPages } from "./pages";
import { jobs, news, partners, products, siteSettings, team } from "./content";

const ctx = { disableRevalidate: true };

async function run() {
  const payload = await getPayload({ config });
  const log = (msg: string) => payload.logger.info(`seed: ${msg}`);

  const existing = await payload.count({ collection: "products" });
  if (existing.totalDocs > 0 && process.env.SEED_RESET !== "1") {
    log("content already exists, nothing to do. Set SEED_RESET=1 to replace it.");
    process.exit(0);
  }

  if (process.env.SEED_RESET === "1") {
    for (const collection of ["pages", "products", "news", "team", "partners", "jobs"] as const) {
      await payload.delete({ collection, where: { id: { exists: true } }, context: ctx });
    }
    log("cleared existing content");
  }

  await payload.updateGlobal({ slug: "site-settings", data: siteSettings, context: ctx });
  log("contact details");

  for (const p of products) {
    await payload.create({ collection: "products", data: { ...p, _status: "published" } as never, context: ctx });
  }
  log(`${products.length} products`);

  for (const n of news) {
    await payload.create({ collection: "news", data: { ...n, _status: "published" } as never, context: ctx });
  }
  log(`${news.length} news items`);

  for (const t of team) await payload.create({ collection: "team", data: t as never, context: ctx });
  log(`${team.length} team members`);

  for (const p of partners) await payload.create({ collection: "partners", data: p as never, context: ctx });
  log(`${partners.length} partners`);

  for (const j of jobs) await payload.create({ collection: "jobs", data: j as never, context: ctx });
  log(`${jobs.length} job postings`);

  for (const page of [homePage, ...otherPages]) {
    const { draft, ...data } = page as typeof page & { draft?: boolean };
    await payload.create({
      collection: "pages",
      data: { ...data, _status: draft ? "draft" : "published" } as never,
      draft: Boolean(draft),
      context: ctx,
    });
  }
  log(`${otherPages.length + 1} pages`);

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const found = await payload.count({ collection: "users", where: { email: { equals: email } } });
    if (found.totalDocs === 0) {
      await payload.create({ collection: "users", data: { email, password, name: "Site admin", role: "admin" } });
      log(`admin account created for ${email}`);
    }
  } else {
    log("no SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set: create the first account at /admin");
  }

  log("done");
  process.exit(0);
}

// `payload run` imports this file and exits when the import settles, so the work must be awaited at top level.
try {
  await run();
} catch (err) {
  console.error(err);
  process.exit(1);
}
