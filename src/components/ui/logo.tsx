import Link from "next/link";
import { site } from "@/lib/site";

/**
 * PCE logo lockup, from PCE's own SVG artwork.
 *   /brand/pce-logo.svg        full colour, for light backgrounds
 *   /brand/pce-logo-white.svg  all white, for dark and coloured backgrounds
 * SVGs are served as-is (no image optimiser needed), so plain <img> is correct here.
 */
const W = 284;
const H = 113;

type LogoProps = {
  /** "auto" swaps to the white version in dark mode; "inverse" is always white (footer). */
  tone?: "auto" | "inverse";
  className?: string;
  priority?: boolean;
};

export function Logo({ tone = "auto", className = "", priority = false }: LogoProps) {
  const size = "h-12 w-auto sm:h-14";
  const loading = priority ? undefined : "lazy";
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center rounded-sm ${className}`}
      aria-label={`${site.name}, home`}
    >
      {tone === "inverse" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/brand/pce-logo-white.svg" alt="" width={W} height={H} loading={loading} className="h-14 w-auto sm:h-16" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/pce-logo.svg" alt="" width={W} height={H} className={`${size} dark:hidden`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/pce-logo-white.svg" alt="" width={W} height={H} className={`hidden ${size} dark:block`} />
        </>
      )}
    </Link>
  );
}
