import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { ContactForm, InvestorForm, StrawOfferForm } from "@/components/forms/forms";
import { EDGES, EDGE_STRENGTH, isEdge, type EdgeStrengthKey } from "@/lib/edges";
import { safeHref } from "@/lib/safe-url";
import { IconBadge } from "@/components/ui/icon";
import { ButtonLink, MediaImage, Section, SectionHeading, mediaSrc, titleSize } from "@/components/ui/primitives";
import { getNews, getPartners, getProducts, getTeam } from "@/lib/payload";
import type { Page } from "@/payload-types";

type Block = Page["layout"][number];
type BlockOf<T extends Block["blockType"]> = Extract<Block, { blockType: T }>;

const headingId = (block: { id?: string | null }, suffix = "h") => (block.id ? `b-${block.id}-${suffix}` : undefined);

/** Column classes for "How many in a row". Phones stay at one column and tablets at two. */
const COLUMNS: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
  "5": "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  "6": "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};
const gridCols = (columns: string | null | undefined, automatic: string) =>
  columns && columns !== "auto" && COLUMNS[columns] ? COLUMNS[columns] : automatic;

function Hero({ block, first }: { block: BlockOf<"hero">; first: boolean }) {
  const H = first ? "h1" : "h2";
  // The image column shows when there's a photo or a stat badge; otherwise the text runs full width.
  const hasFigure = Boolean(block.image) || Boolean(block.stat?.value) || Boolean(block.showImageArea);
  return (
    <section
      aria-labelledby={headingId(block)}
      className={`container-wide grid items-center gap-12 ${hasFigure ? "py-section lg:grid-cols-2" : "pt-10 pb-section-sm"}`}
    >
      <div className="flex flex-col gap-6">
        {block.eyebrow ? <p className="eyebrow animate-fade-up">{block.eyebrow}</p> : null}
        <H
          id={headingId(block)}
          style={titleSize("--page-title-size", block.headingSize)}
          className={`max-w-4xl animate-fade-up title-page [animation-delay:80ms] ${hasFigure ? "title-page--feature" : ""}`}
        >
          {block.heading}
        </H>
        {block.intro ? (
          <p className="max-w-prose animate-fade-up text-lg text-fg-muted [animation-delay:160ms]">{block.intro}</p>
        ) : null}
        {block.primary?.href || block.secondary?.href ? (
          <div className="flex animate-fade-up flex-wrap gap-3 pt-2 [animation-delay:240ms]">
            {block.primary?.href && block.primary.label ? <ButtonLink href={block.primary.href}>{block.primary.label}</ButtonLink> : null}
            {block.secondary?.href && block.secondary.label ? (
              <ButtonLink href={block.secondary.href} variant="secondary">
                {block.secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </div>
      {hasFigure ? (
      <figure className="relative">
        <MediaImage
          media={block.image}
          placeholder="Hero image"
          fit={block.imageFit}
          focus={block.imageFocus}
          scale={block.imageWidth}
          priority={first}
          className="aspect-[5/4] rounded-xl"
        />
        {block.stat?.value ? (
          <figcaption className="absolute -bottom-6 left-4 flex flex-col gap-1 rounded-lg border border-border bg-surface px-5 py-4 shadow-raised sm:left-[-1.5rem] sm:bottom-8">
            <span className="font-display text-4xl font-extrabold leading-none text-accent">{block.stat.value}</span>
            <span className="max-w-[18rem] text-sm text-fg-muted">{block.stat.label}</span>
          </figcaption>
        ) : null}
      </figure>
      ) : null}
    </section>
  );
}

function Highlights({ block }: { block: BlockOf<"highlights"> }) {
  return (
    <section aria-label="Highlights" className="border-y border-border bg-surface-sunken">
      <ul className="container-wide flex flex-wrap justify-center gap-x-10 gap-y-3 py-5 font-display text-[15px] font-semibold">
        {(block.items ?? []).map((item) => (
          <li key={item.id ?? item.text} className="flex items-center gap-2.5">
            {item.iconBadge?.icon ? <IconBadge badge={item.iconBadge} /> : <span aria-hidden="true" className="size-2 rounded-full bg-accent" />}
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RichTextSection({ block }: { block: BlockOf<"richText"> }) {
  const dark = block.tone === "dark";
  return (
    <Section tone={block.tone} labelledBy={block.heading ? headingId(block) : undefined}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} onDark={dark} />
        <div className={`prose-pce flex flex-col gap-4 text-lg ${dark ? "text-on-inverse" : ""}`}>
          <RichText data={block.content as never} />
        </div>
      </div>
    </Section>
  );
}

function ImageTextSection({ block }: { block: BlockOf<"imageText"> }) {
  const dark = block.tone === "dark";
  const hasImage = Boolean(block.image) || Boolean(block.imagePlaceholder);
  const side = block.imageSide ?? "right";
  const hasText = Boolean(block.content);
  const figure = hasImage ? (
    <MediaImage
      media={block.image}
      placeholder={block.heading ?? "image for this section"}
      fit={block.imageFit}
      focus={block.imageFocus}
      scale={block.imageWidth}
      className={side === "below" ? "aspect-[16/9] rounded-xl" : "aspect-[4/3] rounded-xl"}
    />
  ) : null;
  const body = (
    <div className="flex flex-col gap-6">
      <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} onDark={dark} />
      {hasText ? (
        <div className={`prose-pce flex flex-col gap-4 text-lg ${dark ? "text-on-inverse" : ""}`}>
          <RichText data={block.content as never} />
        </div>
      ) : null}
    </div>
  );
  return (
    <Section tone={block.tone} labelledBy={block.heading ? headingId(block) : undefined}>
      {side === "below" || !figure ? (
        <div className="flex flex-col gap-10">
          {body}
          {figure}
        </div>
      ) : (
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className={side === "left" ? "lg:order-2" : ""}>{body}</div>
          <div className={side === "left" ? "lg:order-1" : ""}>{figure}</div>
        </div>
      )}
    </Section>
  );
}

function Stats({ block }: { block: BlockOf<"stats"> }) {
  const dark = block.tone === "dark";
  return (
    <Section tone={block.tone} labelledBy={block.heading ? headingId(block) : undefined}>
      <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} onDark={dark} />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(block.items ?? []).map((item) => (
          <div
            key={item.id ?? item.label}
            className={`flex flex-col-reverse gap-2 rounded-lg p-6 ${dark ? "border border-white/20" : "border-t border-border"}`}
          >
            <dt className={dark ? "text-on-inverse-muted" : "text-fg-muted"}>{item.label}</dt>
            <dd className={`font-display text-4xl font-extrabold leading-none ${dark ? "text-on-inverse" : "text-primary"}`}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      {block.footnote ? <p className={`mt-6 text-sm ${dark ? "text-on-inverse-muted" : "text-fg-muted"}`}>{block.footnote}</p> : null}
    </Section>
  );
}

function Cards({ block }: { block: BlockOf<"cards"> }) {
  const dark = block.tone === "dark";
  const grid = gridCols(block.columns, "sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]");
  const bordered = block.showBorder !== false;
  const position = block.imagePosition ?? "left";
  const align = block.alignment ?? "left";
  const imgHeight = { sm: "h-12", md: "h-20", lg: "h-32", xl: "h-48" }[block.imageSize ?? "md"];
  const textAlign = { left: "text-left", center: "text-center", right: "text-right" }[align];
  // Above the text, the alignment also positions the image; beside the text, it stays next to the text.
  const aboveItems = { left: "items-start", center: "items-center", right: "items-end" }[align];
  const sideItems = block.imageVerticalAlign === "top" ? "items-start" : "items-center";
  return (
    <Section tone={block.tone} labelledBy={block.heading ? headingId(block) : undefined}>
      <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} onDark={dark} />
      <ul className={`grid gap-5 ${grid}`} style={titleSize("--small-title-size", block.itemTitleSize)}>
        {(block.items ?? []).map((item) => {
          const img = item.image && typeof item.image === "object" && item.image.url ? item.image : null;
          const badge = item.iconBadge?.icon ? item.iconBadge : null;
          const hasVisual = Boolean(img) || Boolean(badge);
          const layout = !hasVisual || position === "above" ? `flex-col ${aboveItems}` : `${position === "right" ? "flex-row-reverse" : "flex-row"} ${sideItems}`;
          return (
            <li
              key={item.id ?? item.title}
              className={`flex gap-5 rounded-lg ${bordered ? "p-6" : "py-4"} ${layout} ${textAlign} ${
                !bordered
                  ? ""
                  : dark
                    ? "border border-white/20"
                    : item.highlight
                      ? "border-2 border-accent bg-surface"
                      : "border border-border bg-surface"
              }`}
            >
              {badge ? (
                <IconBadge badge={badge} />
              ) : img ? (
                // Plain <img> so uploaded SVGs stay inert (locked-down CSP on /api/media/file/*.svg).
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaSrc(img.url!)}
                  alt={img.decorative ? "" : (img.alt ?? "")}
                  loading="lazy"
                  className={`${imgHeight} w-auto shrink-0 object-contain ${position === "above" ? "max-w-full" : "max-w-[45%]"}`}
                />
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-2 [overflow-wrap:anywhere]">
                {item.tag ? (
                  <span className={`text-xs font-bold uppercase tracking-[0.08em] ${dark ? "text-on-inverse-accent" : "text-accent"}`}>
                    {item.tag}
                  </span>
                ) : null}
                <h3 className="title-small">{item.title}</h3>
                {item.text ? <p className={`text-base ${dark ? "text-on-inverse-muted" : "text-fg-muted"}`}>{item.text}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Steps({ block }: { block: BlockOf<"steps"> }) {
  const dark = block.tone === "dark";
  const items = block.items ?? [];
  return (
    <Section tone={block.tone} labelledBy={block.heading ? headingId(block) : undefined}>
      <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} onDark={dark} />
      <ol className={`grid gap-4 ${gridCols(block.columns, "sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]")}`} style={titleSize("--small-title-size", block.itemTitleSize)}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.id ?? item.title}
              className={`flex flex-col gap-2.5 rounded-lg p-6 ${
                dark ? "border border-white/20" : last ? "border-2 border-accent bg-surface" : "border border-border bg-surface"
              }`}
            >
              {item.iconBadge?.icon ? (
                <IconBadge badge={item.iconBadge} className="self-start" />
              ) : (
                <span
                  aria-hidden="true"
                  className={`flex size-10 items-center justify-center rounded-full font-display font-bold ${
                    dark ? "bg-primary text-on-primary" : last ? "bg-accent text-on-accent" : "bg-primary text-on-primary"
                  }`}
                >
                  {i + 1}
                </span>
              )}
              <h3 className="title-small">{item.title}</h3>
              {item.text ? <p className={`text-base ${dark ? "text-on-inverse-muted" : "text-fg-muted"}`}>{item.text}</p> : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function Milestones({ block }: { block: BlockOf<"milestones"> }) {
  const items = block.items ?? [];
  return (
    <Section labelledBy={block.heading ? headingId(block) : undefined}>
      <SectionHeading size={block.headingSize} id={headingId(block)} heading={block.heading} />
      <ol className="grid border-t-2 border-primary sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
        {items.map((m, i) => (
          <li key={m.id ?? m.date} className="relative flex flex-col gap-1.5 pt-5 pr-5">
            <span
              aria-hidden="true"
              className={`absolute -top-2 left-0 size-3.5 rounded-full border-2 border-bg ${i === items.length - 1 ? "bg-accent" : "bg-primary"}`}
            />
            <span className="font-display text-[15px] font-bold text-link">{m.date}</span>
            <span className="text-base">{m.text}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Cta({ block }: { block: BlockOf<"cta"> }) {
  const dark = block.tone === "dark";
  return (
    <div className="container-wide py-section-sm">
      <section
        aria-labelledby={headingId(block)}
        className={`flex flex-wrap items-center justify-between gap-6 rounded-xl p-8 sm:p-12 ${
          dark ? "bg-inverse text-on-inverse" : "bg-surface-sunken"
        }`}
      >
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 id={headingId(block)} className="title-section" style={titleSize("--section-heading-size", block.headingSize)}>
            {block.heading}
          </h2>
          {block.text ? <p className={dark ? "text-on-inverse-muted" : "text-fg-muted"}>{block.text}</p> : null}
        </div>
        {block.button?.href && block.button.label ? (
          <ButtonLink href={block.button.href} onDark={dark}>
            {block.button.label}
          </ButtonLink>
        ) : null}
      </section>
    </div>
  );
}

function Faq({ block }: { block: BlockOf<"faq"> }) {
  return (
    <Section narrow labelledBy={block.heading ? headingId(block) : undefined}>
      <SectionHeading size={block.headingSize} id={headingId(block)} heading={block.heading} />
      <div className="border-t border-border">
        {(block.items ?? []).map((item, i) => (
          <details key={item.id ?? item.question} open={i === 0} className="group border-b border-border">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 font-display text-lg font-bold">
              {item.question}
              <span aria-hidden="true" className="text-link transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-5 text-fg-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

async function ProductList({ block }: { block: BlockOf<"productList"> }) {
  const products = await getProducts();
  return (
    <Section id="products" tone="tinted" labelledBy={headingId(block)}>
      <SectionHeading size={block.headingSize} id={headingId(block)} eyebrow={block.eyebrow} heading={block.heading} />
      <ul className={`grid gap-6 ${gridCols(block.columns, "sm:grid-cols-2 xl:grid-cols-4")}`} style={titleSize("--card-title-size", block.itemTitleSize)}>
        {products.map((p) => (
          <li key={p.id} className="flex">
            <Link
              href={`/products/${p.slug}`}
              className="pressable group flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface no-underline shadow-card hover:shadow-raised"
            >
              <MediaImage media={p.cardImage ?? p.heroImage} focus={p.cardImage ? p.cardImageFocus : p.heroImageFocus} placeholder={p.name} className="aspect-[4/3]" sizes="(min-width: 1280px) 25vw, 50vw" />
              <span className="flex flex-1 flex-col gap-2 p-6">
                {p.audience ? <span className="text-sm font-semibold text-accent">{p.audience}</span> : null}
                <span className="title-card font-display group-hover:text-link">{p.name}</span>
                <span className="flex-1 text-base text-fg-muted">{p.cardSummary ?? p.summary}</span>
                <span className="pt-2 font-display text-[15px] font-semibold text-link">
                  Learn More <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

async function NewsList({ block }: { block: BlockOf<"newsList"> }) {
  const items = await getNews(block.limit ?? 3);
  return (
    <Section tone="tinted" labelledBy={headingId(block)}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 id={headingId(block)} className="title-section" style={titleSize("--section-heading-size", block.headingSize)}>
          {block.heading ?? "In the news"}
        </h2>
        <Link href="/news" className="link font-display font-semibold">
          All coverage
        </Link>
      </div>
      <ul className={`grid gap-6 ${gridCols(block.columns, "md:grid-cols-3")}`}>
        {items.map((n) => (
          <li key={n.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
            <MediaImage media={n.image} placeholder={n.title} className="aspect-[16/9]" sizes="(min-width: 768px) 33vw, 100vw" />
            <div className="flex flex-1 flex-col gap-2.5 p-6">
            <span className="text-sm font-semibold text-straw-strong">
              {[n.source, formatDate(n.publishedOn)].filter(Boolean).join(" · ")}
            </span>
            <a
              href={safeHref(n.kind === "announcement" ? `/news/${n.slug}` : (n.externalUrl ?? "/news"))}
              className="title-small font-display leading-snug no-underline hover:text-link"
            >
              {n.title}
            </a>
            <p className="text-base text-fg-muted">{n.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

async function TeamGrid({ block }: { block: BlockOf<"team"> }) {
  const team = await getTeam();
  return (
    <Section labelledBy={headingId(block)}>
      <SectionHeading size={block.headingSize} id={headingId(block)} heading={block.heading ?? "Leadership team"} />
      <ul className={`grid gap-6 ${gridCols(block.columns, "lg:grid-cols-2")}`}>
        {team.map((t) => (
          <li key={t.id} className="flex items-start gap-5 rounded-lg border border-border bg-surface p-6">
            {t.photo && typeof t.photo === "object" ? (
              <MediaImage media={t.photo} placeholder={t.name} className="size-22 shrink-0 rounded-full" sizes="88px" />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-22 shrink-0 items-center justify-center rounded-full bg-green-100 font-display text-2xl font-bold text-neutral-800"
              >
                {t.name
                  .split(/\s+/)
                  .filter((w) => /^[A-Z]/.test(w) && !/^(Dr|PhD)\.?$/.test(w))
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
            )}
            <span className="flex flex-col gap-1">
              <span className="title-small font-display">{t.name}</span>
              <span className="text-[15px] font-semibold text-accent">{t.role}</span>
              {t.bio ? <span className="text-base text-fg-muted">{t.bio}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

async function PartnerLogos({ block }: { block: BlockOf<"partners"> }) {
  const partners = await getPartners();
  return (
    <section aria-labelledby={headingId(block)} className="container-wide flex flex-col items-center gap-6 py-14">
      <h2 id={headingId(block)} className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-fg-muted">
        {block.heading ?? "Research and funding partners"}
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 font-display text-[17px] font-semibold text-fg-muted">
        {partners.map((p) => {
          const logo = p.logo && typeof p.logo === "object" && p.logo.url ? p.logo : null;
          // Plain <img>: partner artwork is often SVG, which next/image will not optimise, and it cannot run
          // script this way. Logos are 64px tall (the old tile height) and grow slightly on hover.
          const content = logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaSrc(logo.url!)} alt={p.name} loading="lazy" className="h-32 w-auto max-w-96 object-contain motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out-quint motion-safe:group-hover/logo:scale-110 motion-safe:group-focus-visible/logo:scale-110" />
          ) : (
            p.name
          );
          const tile = logo ? "group/logo flex items-center" : "";
          return (
            <li key={p.id}>
              {p.url ? (
                <a
                  href={safeHref(p.url)}
                  rel="noopener"
                  target="_blank"
                  aria-label={logo ? `${p.name} (opens in a new tab)` : undefined}
                  className={`${tile} no-underline hover:underline`}
                >
                  {content}
                </a>
              ) : (
                <span className={tile}>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FormSection({ block }: { block: BlockOf<"form"> }) {
  return (
    <Section id={block.anchor ?? undefined} tone="tinted" narrow labelledBy={headingId(block)}>
      <SectionHeading size={block.headingSize} id={headingId(block)} heading={block.heading} intro={block.intro} />
      {block.form === "contact" ? <ContactForm /> : null}
      {block.form === "straw" ? <StrawOfferForm /> : null}
      {block.form === "investor" ? <InvestorForm /> : null}
    </Section>
  );
}


const TONE_BG: Record<string, string> = { light: "bg-bg", tinted: "bg-surface-sunken", dark: "bg-inverse" };

/** The background tone a block shows, so a section edge knows which colour to reveal. Blocks without a tone setting have a fixed look. */
function toneOf(block?: Block): string {
  if (!block) return "light";
  const t = (block as { tone?: string | null }).tone;
  if (t) return t;
  return block.blockType === "productList" || block.blockType === "newsList" || block.blockType === "form" || block.blockType === "highlights"
    ? "tinted"
    : "light";
}

/**
 * Wraps a section whose "Section edge" is set. The section is clipped along the edge shape and the wrapper behind it is
 * painted in the NEXT section's colour, so the cut reveals that colour with no gaps, at every screen width.
 */
function WithEdge({ block, next, children }: { block: Block; next?: Block; children: ReactNode }) {
  const edge = (block as { edge?: string | null }).edge;
  if (!isEdge(edge)) return <>{children}</>;
  const strength = (block as { edgeStrength?: string | null }).edgeStrength;
  const height = EDGE_STRENGTH[(strength as EdgeStrengthKey) in EDGE_STRENGTH ? (strength as EdgeStrengthKey) : "medium"].height;
  return (
    <div className={`edge-wrap ${TONE_BG[toneOf(next)] ?? "bg-bg"}`} style={{ "--edge-h": height } as CSSProperties}>
      <div
        className={`edge-inner ${TONE_BG[toneOf(block)] ?? "bg-bg"}`}
        style={{ clipPath: EDGES[edge].clip("var(--edge-h)"), paddingBottom: "var(--edge-h)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function RenderBlocks({ blocks }: { blocks: Page["layout"] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`;
        const content = ((): ReactNode => {
        switch (block.blockType) {
          case "hero":
            return <Hero block={block} first={i === 0} />;
          case "highlights":
            return <Highlights block={block} />;
          case "richText":
            return <RichTextSection block={block} />;
          case "imageText":
            return <ImageTextSection block={block} />;
          case "stats":
            return <Stats block={block} />;
          case "cards":
            return <Cards block={block} />;
          case "steps":
            return <Steps block={block} />;
          case "milestones":
            return <Milestones block={block} />;
          case "cta":
            return <Cta block={block} />;
          case "faq":
            return <Faq block={block} />;
          case "productList":
            return <ProductList block={block} />;
          case "newsList":
            return <NewsList block={block} />;
          case "team":
            return <TeamGrid block={block} />;
          case "partners":
            return <PartnerLogos block={block} />;
          case "form":
            return <FormSection block={block} />;
          default:
            return null;
        }
        })();
        return (
          <WithEdge key={key} block={block} next={blocks[i + 1]}>
            {content}
          </WithEdge>
        );
      })}
    </>
  );
}
