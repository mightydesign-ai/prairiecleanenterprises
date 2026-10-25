import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SkipLink } from "@/components/layout/skip-link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSiteSettings } from "@/lib/payload";
import { site } from "@/lib/site";
import { isIndexable } from "@/lib/indexing";
import "./globals.css";

// One family for everything: Inter (variable), used for both headings and body text.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Flax straw to fibre, fuel and pellets`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    url: "/",
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@PrairieCleanEn",
  },
  robots: isIndexable
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true, "max-snippet": 0, "max-image-preview": "none" },
      },
  formatDetection: { telephone: true, email: true, address: true },
};

// No maximum-scale: pinch zoom stays available (WCAG 1.4.4). The live site
// currently sets maximum-scale=1, which blocks it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1212" },
  ],
};

// Applies the saved or system theme before first paint so there is no
// flash of the wrong theme. Kept tiny and dependency-free on purpose.
const themeScript = `(function(){try{var p=localStorage.getItem("pce-theme");var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: settings.email,
    telephone: settings.phones?.[0]?.number,
    address: settings.facility
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.facility.street,
          addressLocality: settings.facility.locality,
          addressRegion: settings.facility.region,
          postalCode: settings.facility.postalCode,
          addressCountry: "CA",
        }
      : undefined,
    sameAs: (settings.social ?? []).map((s) => s.url),
  };

  return (
    <html
      lang="en-CA"
      dir="ltr"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
