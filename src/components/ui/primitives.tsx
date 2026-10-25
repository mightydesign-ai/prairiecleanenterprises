import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { safeHref } from "@/lib/safe-url";
import type { Media } from "@/payload-types";

export type Tone = "light" | "tinted" | "dark" | null | undefined;

const toneClass: Record<string, string> = {
  light: "bg-bg text-fg",
  tinted: "border-y border-border bg-surface-sunken text-fg",
  dark: "bg-inverse text-on-inverse",
};

/** Full-width band with a centred content column. */
export function Section({
  tone = "light",
  children,
  className = "",
  id,
  labelledBy,
  narrow = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  narrow?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={toneClass[tone ?? "light"]} data-tone={tone ?? "light"}>
      <div className={`${narrow ? "mx-auto w-full max-w-4xl px-gutter" : "container-wide"} py-section ${className}`}>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <p className={`eyebrow ${onDark ? "!text-on-inverse-accent" : ""}`}>{children}</p>;
}

export function SectionHeading({
  id,
  eyebrow,
  heading,
  intro,
  onDark = false,
}: {
  id?: string;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  onDark?: boolean;
}) {
  if (!eyebrow && !heading && !intro) return null;
  return (
    <div className="mb-10 flex max-w-3xl flex-col gap-3">
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <h2 id={id} className="text-3xl">
          {heading}
        </h2>
      ) : null}
      {intro ? <p className={onDark ? "text-on-inverse-muted" : "text-fg-muted"}>{intro}</p> : null}
    </div>
  );
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Buttons are links styled as buttons; external links open in the same tab. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  onDark = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  onDark?: boolean;
}) {
  const base =
    "pressable inline-flex min-h-12 items-center justify-center rounded-md px-6 font-display font-semibold no-underline";
  const styles =
    variant === "primary"
      ? onDark
        ? "bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary focus-visible:text-on-primary active:bg-primary-hover active:text-on-primary"
        : "bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary focus-visible:text-on-primary active:bg-primary-hover active:text-on-primary"
      : onDark
        ? "border border-neutral-400 text-on-inverse hover:bg-white/10"
        : "border border-border-strong text-fg hover:bg-surface-sunken";
  const className = `${base} ${styles}`;
  href = safeHref(href);
  return isExternal(href) ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Payload builds absolute URLs from serverURL; next/image and our own routes want the same-site path. */
export const mediaSrc = (url: string) => url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/file\/)/, "");

/** Payload upload, or a labelled placeholder until a photo is added in the CMS. */
export function MediaImage({
  media,
  placeholder,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  fit = "crop",
}: {
  media?: number | Media | null;
  placeholder: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** "crop" fills the box (className sets its shape); "full" shows the whole photo at its own proportions. */
  fit?: "crop" | "full" | null;
}) {
  if (media && typeof media === "object" && media.url) {
    const src = mediaSrc(media.url);
    if (fit === "full" && media.width && media.height) {
      // The aspect-* class is dropped so the photo keeps its own shape; rounding and other classes stay.
      const shape = className.replace(/\baspect-\[[^\]]+\]/g, "").trim();
      return (
        <div className={`overflow-hidden ${shape}`}>
          <Image
            src={src}
            alt={media.decorative ? "" : (media.alt ?? "")}
            width={media.width}
            height={media.height}
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full"
          />
        </div>
      );
    }
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={media.decorative ? "" : (media.alt ?? "")}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={
            media.focalX != null && media.focalY != null
              ? { objectPosition: `${media.focalX}% ${media.focalY}%` }
              : undefined
          }
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`Photo to come: ${placeholder}`}
      className={`flex items-start bg-[repeating-linear-gradient(-28deg,var(--color-straw-300)_0_18px,var(--color-straw-200)_18px_44px)] p-5 ${className}`}
    >
      <span className="rounded-full bg-straw-50 px-3 py-1.5 text-sm font-semibold text-straw-900">
        Photo: {placeholder}
      </span>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
      <ol className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex gap-1.5">
            {item.href ? (
              <Link href={item.href} className="link">
                {item.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
            {i < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
