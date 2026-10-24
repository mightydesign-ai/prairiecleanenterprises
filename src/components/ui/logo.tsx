import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * PCE logo lockup ("A Canadian Fibre & Pellet Company"), from PCE's own artwork.
 *   /brand/pce-logo.png        full colour, for light backgrounds
 *   /brand/pce-logo-mono-white.png  same artwork with the black type in white, for dark backgrounds
 * Both are 602×238 with transparent backgrounds.
 */
const W = 602;
const H = 238;

type LogoProps = {
  /** "auto" swaps to the white version in dark mode; "inverse" is always white (dark footer). */
  tone?: "auto" | "inverse";
  className?: string;
  priority?: boolean;
};

export function Logo({ tone = "auto", className = "", priority = false }: LogoProps) {
  const size = "h-12 w-auto sm:h-14";
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center rounded-sm ${className}`}
      aria-label={`${site.name}, home`}
    >
      {tone === "inverse" ? (
        <Image src="/brand/pce-logo-mono-white.png" alt="" width={W} height={H} sizes="180px" className="h-14 w-auto sm:h-16" />
      ) : (
        <>
          <Image
            src="/brand/pce-logo.png"
            alt=""
            width={W}
            height={H}
            priority={priority}
            sizes="150px"
            className={`${size} dark:hidden`}
          />
          <Image
            src="/brand/pce-logo-mono-white.png"
            alt=""
            width={W}
            height={H}
            priority={priority}
            sizes="150px"
            className={`hidden ${size} dark:block`}
          />
        </>
      )}
    </Link>
  );
}
