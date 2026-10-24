# Prairie Clean Enterprises website

The public site and CMS for [prairiecleanenterprises.com](https://prairiecleanenterprises.com), built by Mighty Design.

- **Next.js 15.4** (App Router, React 19) — Payload 3.92 supports Next 15.4.11+ but not 15.5
- **Payload CMS 3** running inside the same app, admin at `/admin`
- **Tailwind CSS 4**, design tokens in `src/app/(frontend)/globals.css`
- **Postgres** (Neon in production, any Postgres 14+ locally)
- **Vercel** hosting, uploads in **Vercel Blob**

## Run it locally

Requires Node 22.23.4+ (or 24.22.1+), pnpm 10 and a Postgres database.

```bash
pnpm install
cp .env.example .env          # then fill in DATABASE_URL, PAYLOAD_SECRET, IP_HASH_SALT
pnpm migrate                  # create the tables
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='choose-one' pnpm seed
pnpm dev                      # http://localhost:3000, admin at /admin
```

`pnpm seed` loads the content from the current site (pages, products, news, team, partners, the open job) and creates
the first admin account. Without the two `SEED_ADMIN_*` variables, create the first account at `/admin` instead;
the first account is always an admin.

## Deploy to Vercel

1. **Import the repo** in Vercel (Add New → Project). Framework preset: Next.js. Leave the build command as `pnpm build`.
2. **Add a database:** in the project's Storage tab, add **Neon**. It sets `DATABASE_URL` for you.
3. **Add file storage:** in the same tab, add **Blob**. It sets `BLOB_READ_WRITE_TOKEN`.
4. **Add the other variables** (Settings → Environment Variables):
   - `PAYLOAD_SECRET`: output of `openssl rand -hex 32`
   - `IP_HASH_SALT`: output of `openssl rand -hex 16`
   - `NEXT_PUBLIC_SITE_URL`: the site's address, e.g. `https://pce-website.vercel.app` for now
5. **Deploy.** Migrations run automatically the first time the app connects to the database (`prodMigrations`).
6. **Seed once** from your machine, pointing at the Neon database:
   ```bash
   DATABASE_URL='<neon connection string>' PAYLOAD_SECRET='<same as Vercel>' \
   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='choose-one' pnpm seed
   ```
7. Redeploy so the static pages pick up the content.

### Hobby now, Pro before launch

Vercel's Hobby plan is for personal, non-commercial use, so it's fine while building and reviewing. Before the site
goes live on PCE's domain, move it to a **Vercel Pro team owned by PCE** (about US$20/month) and transfer the project
there (Project Settings → Transfer). Then add the domain under Settings → Domains and update DNS at PCE's registrar.

## Changing the content model

Collections live in `src/collections`, page blocks in `src/blocks/config.ts` (schema) and
`src/components/blocks/RenderBlocks.tsx` (rendering). After changing a schema:

```bash
pnpm migrate:create describe-the-change   # writes a migration in src/migrations
pnpm migrate                              # applies it locally
pnpm generate:types                       # refreshes src/payload-types.ts
```

Commit the migration. Production applies it on the next deploy.

## Before launch

- [ ] Add the real logo files to `public/brand/` and set `HAS_LOGO_FILES = true` in `src/components/ui/logo.tsx`
- [ ] Upload photos in the admin (every placeholder says which photo it needs)
- [ ] Replace the `[PLACEHOLDER]` spec values on the Flax Fibre and Fuel Pellets products
- [ ] Add PCE's privacy policy text to the Privacy page and publish it (it's a draft, so `/privacy` is a 404 until then)
- [ ] Confirm the investor terms on the Investors page are current
- [ ] Set up email notifications for new form submissions (Payload email adapter, e.g. Resend)
- [ ] Move to a PCE-owned Vercel Pro team and connect the domain
