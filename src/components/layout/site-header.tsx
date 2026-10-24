import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { contactCta, primaryNav } from "@/lib/site";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-bg"
      data-print="hide"
    >
      <div className="container-wide flex h-header items-center gap-3 sm:gap-6">
        <Logo priority />

        <PrimaryNav items={primaryNav} className="ml-auto hidden lg:block" />

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <Link
            href={contactCta.href}
            className="pressable hidden min-h-11 items-center rounded-md bg-primary px-5 font-display text-sm font-semibold text-on-primary hover:bg-primary-hover sm:inline-flex"
          >
            {contactCta.label}
          </Link>
          <MobileNav items={primaryNav} cta={contactCta} />
        </div>
      </div>
    </header>
  );
}
