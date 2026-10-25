import Link from "next/link";
import { safeHref } from "@/lib/safe-url";
import { Logo } from "@/components/ui/logo";
import { getSiteSettings } from "@/lib/payload";
import { footerNav, telHref } from "@/lib/site";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const f = settings.facility;
  const year = new Date().getFullYear();

  return (
    <footer className="text-white" data-print="hide">
      <div className="bg-[#327c9b]">
      <div className="container-wide grid gap-12 py-section-sm md:grid-cols-[1.4fr_2fr]">
        <div className="max-w-md space-y-5">
          <Logo tone="inverse" />
          <p className="text-sm text-white">
            PCE is a Saskatchewan and Canadian-based company that aggregates and processes un-utilized flax straw
            and other agricultural / organic waste for a low-carbon solution for diverse industries ranging from
            biofuel to high value B2B and B2C products. PCE&apos;s aim is to provide secure, renewable, sustainable,
            and abundant ag-based fiber solutions to customers around the world.
          </p>
          {settings.social && settings.social.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {settings.social.map((s) => (
                <li key={s.id ?? s.url}>
                  <a
                    href={safeHref(s.url)}
                    rel="me noopener"
                    target="_blank"
                    className="pressable inline-flex min-h-11 items-center rounded-md border border-white/60 px-3 text-sm hover:bg-white/15"
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
                      href={safeHref(link.href)}
                      className="inline-flex min-h-9 items-center text-sm text-white underline-offset-4 hover:text-white hover:underline"
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
            <address className="space-y-3 text-sm not-italic text-white">
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
                    <a href={telHref(p.number)} className="hover:text-white hover:underline">
                      <span className="sr-only">{p.label}: </span>
                      {p.number}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-white hover:underline">
                    {settings.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>

      </div>

      <div className="bg-[#327c9b]">
        <div className="container-wide flex flex-col gap-2 py-5 text-sm text-white sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {year} PCE</p>
          <Link href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
