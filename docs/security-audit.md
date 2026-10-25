# Security audit, 25 Oct 2026

Scope: the codebase (auth, access control, forms, uploads, headers, dependencies) plus a light, non-destructive
probe of the beta deployment (no form submissions, no load, no credential guessing).

## Fixed in this change

| Severity | Finding | Fix |
|---|---|---|
| Critical | Next.js 15.4.11 has known unauthenticated remote-code-execution and denial-of-service advisories (image optimisation, server actions, middleware bypass, cache poisoning). The 15.4 line has no patch. | Upgraded to Next 16.4.3 (supported by Payload 3.92). |
| Critical/High | `dompurify` and `happy-dom` (inside Payload's admin and Lexical) had known bypasses. | Pinned to patched versions with pnpm overrides. |
| High | `/_next/image` would optimise images from any Vercel Blob store (`*.public.blob.vercel-storage.com`), so the site could be used as someone else's image proxy. | Allow only this project's blob store hostname. |
| Medium | No Content-Security-Policy on the public site. | Added a CSP (no plugins, no framing, pinned base/form/connect/img sources). `script-src` still allows inline scripts because Next.js needs them. |
| Medium | Auth cookie was not marked Secure. | `cookies.secure` in production, `SameSite=Lax`. |
| Medium | GraphQL API and introspection exposed with no use. | Disabled, routes removed. |
| Medium | Weak staff passwords allowed. | Minimum 12 characters with mixed character types. |
| Medium | Resume uploads trusted the browser's file type. | Check the file's first bytes (PDF, DOC, DOCX) as well. |
| Medium | Applications accepted for any job id, including closed postings. | Job must exist and be open. |
| Low | CMS links (buttons, news, partners, social) rendered unchecked, so a `javascript:` link could run script. | `safeHref` allows only `/`, `#`, `http(s)`, `mailto`, `tel`. |
| Low | JSON-LD written with `JSON.stringify` could be closed early by `</script>` in CMS text. | `<` escaped in JSON-LD. |
| Low | Form fields had no size cap and numbers no range. | 5,000 character cap; ranges on bales, weight, moisture, crop year. |
| Low | Rate limit keyed on the first `x-forwarded-for` entry. | Prefer `x-vercel-forwarded-for` / `x-real-ip`. |

## Checked on the beta site, no problem found

- `/api/users/init` reports the site is initialised (no one can claim the first admin account).
- Unauthenticated REST reads of users, contact messages, straw offers, job applications and resumes are refused.
- Draft pages are not returned to the public API.
- GraphQL playground is not served.

## Still open (not code)

- No two-factor sign-in for the admin (Payload has none built in). Use long unique passwords.
- No network rate limiting on `/api` or `/admin/login` beyond Payload's account lockout (5 tries, 15 minutes). Turn on Vercel's Firewall / Attack Challenge Mode before launch.
- `esbuild` (moderate) in `drizzle-kit` is a dev-only tool: it only matters if a dev server is exposed.
- CSP keeps `'unsafe-inline'` for scripts. Moving to nonces needs a proxy and dynamic rendering.
- Editors can upload SVG. They are served inert (CSP + `<img>`), but only trusted staff should have editor accounts.
- The Next 16 build was compiled and type-checked in a sandbox without database access; Vercel's build is the first full run.
- Re-run `pnpm audit --prod` before each release.
