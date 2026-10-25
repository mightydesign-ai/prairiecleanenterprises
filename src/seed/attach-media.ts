/**
 * Re-attaches partner logos and team photos after `SEED_RESET=1 pnpm seed`, without touching anything else.
 * It matches existing Media uploads to partners/team by words in the filename or alt text.
 * Run:  pnpm attach-media      (prints what it matched and what it could not)
 */
import config from "@payload-config";
import { getPayload } from "payload";

const ctx = { disableRevalidate: true };
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Partner name -> words that identify its logo file. First media match wins; tweak if a logo is missed.
const partnerKeys: Record<string, string[]> = {
  SaskFlax: ["saskflax"],
  "University of Saskatchewan": ["usask", "universityofsaskatchewan"],
  "University of Regina": ["uregina", "universityofregina"],
  "University of British Columbia": ["ubc", "britishcolumbia"],
  "Saskatchewan Polytechnic": ["saskpoly", "saskpolytech", "polytechnic"],
  "Innovation Saskatchewan": ["innovationsask"],
  STEP: ["sasktrade", "step"],
  "Government of Saskatchewan": ["governmentofsaskatchewan", "govsask", "saskgov", "gov"],
};

async function run() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`attach: ${m}`);
  const media = (await payload.find({ collection: "media", limit: 1000, depth: 0, pagination: false })).docs;
  const text = (m: (typeof media)[number]) => norm(`${m.filename ?? ""} ${m.alt ?? ""}`);
  const used = new Set<string | number>();

  const partners = (await payload.find({ collection: "partners", limit: 100, depth: 0, pagination: false })).docs;
  for (const p of partners) {
    if (p.logo) continue;
    const keys = partnerKeys[p.name] ?? [norm(p.name)];
    const hit = media.find((m) => !used.has(m.id) && keys.some((k) => text(m).includes(k)));
    if (!hit) {
      log(`NO MATCH for partner "${p.name}"`);
      continue;
    }
    used.add(hit.id);
    await payload.update({ collection: "partners", id: p.id, data: { logo: hit.id }, context: ctx });
    log(`partner "${p.name}" <- ${hit.filename}`);
  }

  const team = (await payload.find({ collection: "team", limit: 100, depth: 0, pagination: false })).docs;
  for (const t of team) {
    const rec = t as unknown as { id: string | number; name: string; photo?: unknown };
    if (rec.photo) continue;
    const parts = rec.name.replace(/^dr\.?\s+/i, "").split(/\s+/);
    const full = norm(parts.join(""));
    const last = norm(parts[parts.length - 1] ?? "");
    const hit = media.find((m) => !used.has(m.id) && (text(m).includes(full) || (last.length > 3 && text(m).includes(last))));
    if (!hit) {
      log(`NO MATCH for team member "${rec.name}"`);
      continue;
    }
    used.add(hit.id);
    await payload.update({ collection: "team", id: rec.id, data: { photo: hit.id } as never, context: ctx });
    log(`team "${rec.name}" <- ${hit.filename}`);
  }

  log(`unused media: ${media.filter((m) => !used.has(m.id)).map((m) => m.filename).join(", ") || "none"}`);
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
