# Handoff: Prairie Clean Enterprises website

For the next agent (Hermes or anyone). Read `CLAUDE.md` first for stack, layout and rules; this file is the current state and the to-do list.

Last updated: 2026-10-25. `main` at the time of writing: `6b7eca5`.

## Project

Rebuild of prairiecleanenterprises.com for the client PCE (Weyburn, SK) by Mighty Design (Trent, trent@mightydesign.ca).
Next.js 15.4.11, React 19, Payload CMS 3.92, Tailwind 4, Neon Postgres, Vercel.
Repo: github.com/mightydesign-ai/prairiecleanenterprises. Beta: https://prairiecleanenterprises-beta.vercel.app

Do not invent facts, figures or quotes. Unknown values stay as visible placeholders.

## Decisions made

- Keep the new information architecture (audience-based nav). Port every section of the old site's copy into it, in roughly the old positions. No hero images. Image spots are striped placeholders ("Photo: ...") to be replaced in the admin.
- Palette comes from the logo: green `#527A4F` (primary buttons, white labels, hover `#416340`), teal `#007495`, straw `#946E4C`, charcoal `#343334`, grey `#F3F3F3`, red `#BE2631` (errors only).
- Footer is the exception: it keeps the live site's blue `#327C9B` for both the main band and the solid copyright strip.
- Partner logos: no tile, 128px tall, slight scale-up on hover.
- Where the old site's facts disagree with each other, the old wording was kept and the conflict is flagged below.

## What was built in the last stretch

- New `imageText` page block (`src/blocks/config.ts`, `RenderBlocks.tsx`): text with an image on the right, left or below, with a placeholder checkbox.
- Products have a `sections` array (story sections on product pages).
- Migration `src/migrations/20261025_155014_image_text_and_product_sections` for both.
- `src/seed/pages.ts` and `src/seed/content.ts` rewritten with the live-site copy: all pages, 38 news stories plus the Manitoba Co-operator item, team bios, partners in live order, job posting, privacy policy (now published), fuel pellet specs.

## Not done yet (do these first)

1. **Run the seed.** The live database still has the old content. After the Vercel build is Ready (it runs the migration on start), from the repo on a machine that can reach Neon:
   ```
   npx pnpm@latest install
   SEED_RESET=1 npx pnpm@latest seed
   ```
   `DATABASE_URL` is in `.env.local` (Neon pooler `ep-aged-wave-b7q5uyb5-pooler...`). The reset clears and recreates pages, products, news, team, partners and jobs. It does not touch media, users or submissions.
2. **Re-attach team photos** in the admin (Mark's, etc.) after the reset.
3. **Look at the result in a browser.** Nothing from the content port has been built or viewed yet; only type-checked logic and the rich-text renderer were verified.

Note: `pnpm` is not installed on Trent's Mac, so use `npx pnpm@latest ...`. Postgres is `push: false`; any schema change needs `pnpm migrate:create <name>` and a committed migration.

## Open items for PCE (client decisions or content)

- Company name: Energy vs Enterprises.
- Conflicting figures on the old site: straw volume 750k vs 1M vs 1.5M t; one vs two patent filings; 80% vs 90% emissions reduction; Regina vs Weyburn.
- Typos copied verbatim from the old site (needs a proofreading pass).
- Privacy policy is the 2021 text; needs a refresh.
- Earlier-invented stats still on the new pages: "60,000+ acres", "25,000+ tonnes", "3x more absorbent", and some milestones. Remove or replace with PCE-confirmed numbers.
- Flax Fibre brochure PDF to upload (old URL: `.../wp-content/uploads/2025/02/PCE-Flax-Fibre-Brochure-web-02-27-25.pdf`).
- Careers: the hiring-portal apply link.
- Business-model infographic image.
- Two 2020 news items have no links and were left out (Discover Weyburn "Pitching Unique Idea", Farms.com "Looking To Buy").
- News dates for "Spring 2024" and "Winter 2021" are approximate.
- Image placeholders for Bedding, Investors, Sell Your Straw and Sustainability are guesses at the old layout.
- Approval from PCE for the Sell-your-straw and Investors content (investor terms especially).

## Before launch

- Real photos in all placeholders.
- Move to a PCE-owned Vercel Pro team and PCE-owned domain (Hobby is non-commercial only).
- Set `SITE_INDEXABLE=true` (the site is kept out of search engines and AI crawlers until then).
- Form notification emails set up and tested.
- Delete the old Neon database.

## Working notes

- The previous agent could not push to GitHub or reach Neon, so changes were delivered as git patches. If you run on Trent's Mac you can commit, push and seed directly.
- Don't create git worktrees in `~/Projects/prairiecleanenterprises`; stale lock files can be left behind (a harmless `.git/worktrees/chk2` remains).
- Old-site pages can't be fetched with plain HTTP from the cloud sandbox; use a browser.
- Reference copy audit (old vs new): https://claude.ai/artifact/7HdGbgYANTGwuQUdUnQTKg
