import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Set to true once the real logo files are in /public/brand:
 *   pce-logo.png        full-colour mark, 779×405
 *   pce-logo-white.png  white mark, 300×116
 * Until then a neutral placeholder mark renders, so nothing shows as a broken image.
 */
const HAS_LOGO_FILES = false;

type LogoProps = {
  /** "auto" swaps to the white mark in dark mode; "inverse" is always white. */
  tone?: "auto" | "inverse";
  className?: string;
  priority?: boolean;
};

function PlaceholderMark({ inverse }: { inverse: boolean }) {
  const [a, b, c] = inverse ? ["#7dbfd9", "#9bc095", "#ccaf8e"] : ["#007b9b", "#56844f", "#9d7c55"];
  return (
    <span className="flex items-center gap-2.5">
      <svg aria-hidden="true" width="40" height="28" viewBox="0 0 40 28">
        <path d="M2 26L14 2h6L8 26z" fill={a} />
        <path d="M12 26L24 2h6L18 26z" fill={b} />
        <path d="M22 26L34 2h6L28 26z" fill={c} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] font-extrabold tracking-tight">PCE</span>
        <span className={`mt-1 text-[11px] font-semibold tracking-wide ${inverse ? "text-on-inverse-muted" : "text-fg-muted"}`}>
          PRAIRIE CLEAN ENTERPRISES
        </span>
      </span>
    </span>
  );
}

export function Logo({ tone = "auto", className = "", priority = false }: LogoProps) {
  const inverse = tone === "inverse";
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center rounded-sm ${className}`}
      aria-label={`${site.name}, home`}
    >
      {!HAS_LOGO_FILES ? (
        <PlaceholderMark inverse={inverse} />
      ) : inverse ? (
        <Image src="/brand/pce-logo-white.png" alt="" width={300} height={116} sizes="160px" className="h-11 w-auto" />
      ) : (
        <>
          <Image
            src="/brand/pce-logo.png"
            alt=""
            width={779}
            height={405}
            priority={priority}
            sizes="120px"
            className="h-12 w-auto dark:hidden"
          />
          <Image
            src="/brand/pce-logo-white.png"
            alt=""
            width={300}
            height={116}
            sizes="120px"
            className="hidden h-9 w-auto dark:block"
          />
        </>
      )}
    </Link>
  );
}
