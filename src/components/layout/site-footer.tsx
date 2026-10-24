import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { getSiteSettings } from "@/lib/payload";
import { footerNav, telHref } from "@/lib/site";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const f = settings.facility;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-inverse text-on-inverse" data-print="hide">
      <div className="container-wide grid gap-12 py-section-sm md:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm space-y-5">
          <Logo tone="inverse" />
          <p className="text-sm text-on-inverse-muted">
            PCE buys unused flax straw from prairie farmers and turns it into fibre, fuel and pellets at the
            world&apos;s first flax straw multi-processing facility.
          </p>
          {settings.social && settings.social.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {settings.social.map((s) => (
                <li key={s.id ?? s.url}>
                  <a
                    href={s.url}
                    rel="me noopener"
                    target="_blank"
                    className="pressable inline-flex min-h-11 items-center rounded-md border border-on-inverse-muted/40 px-3 text-sm hover:bg-on-inverse/10"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerNav.map((col) => (
            <nav key={col.heading} aria-labelledby={`footer-${col.heading.replace(/\s+/g, "-").toLowerCase()}`}>
              <h2
                id={`footer-${col.heading.replace(/\s+/g, "-").toLowerCase()}`}
                className="mb-3 font-display text-sm font-semibold"
              >
                {col.heading}
              </h2>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-sm text-on-inverse-muted underline-offset-4 hover:text-on-inverse hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="mb-3 font-display text-sm font-semibold">Contact</h2>
            <address className="space-y-3 text-sm not-italic text-on-inverse-muted">
              {f ? (
                <p>
                  {f.name}
                  <br />
                  {f.street}
                  <br />
                  {f.locality}, {f.region} {f.postalCode}
                </p>
              ) : null}
              <ul className="space-y-1">
                {(settings.phones ?? []).map((p) => (
                  <li key={p.id ?? p.number}>
                    <a href={telHref(p.number)} className="hover:text-on-inverse hover:underline">
                      <span className="sr-only">{p.label}: </span>
                      {p.number}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-on-inverse hover:underline">
                    {settings.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-on-inverse-muted/20">
        <div className="container-wide flex flex-col gap-2 py-6 text-xs text-on-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Prairie Clean Enterprises. Proudly Canadian, made in Saskatchewan.</p>
          <Link href="/privacy" className="hover:text-on-inverse hover:underline">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
