import type { Metadata } from "next";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeHref } from "@/lib/safe-url";
import { Breadcrumb, ButtonLink, MediaImage, Section, stepVar } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/metadata";
import { getProductBySlug, getProducts } from "@/lib/payload";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return buildMetadata({ title: p.name, description: p.summary, meta: p.meta, path: `/products/${slug}` });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();
  const others = all.filter((p) => p.id !== product.id);
  const brochure = product.brochure && typeof product.brochure === "object" ? product.brochure : null;

  const hs = product.headingSizes;
  const sizeVars: Record<string, string> = {};
  const set = (cssVar: string, value?: string | null) => {
    const v = stepVar(value);
    if (v) sizeVars[cssVar] = v;
  };
  set("--page-title-size", hs?.pageTitle);
  set("--section-heading-size", hs?.sectionHeading);
  set("--card-title-size", hs?.itemTitle);
  set("--small-title-size", hs?.itemTitle);

  return (
    <div style={sizeVars as React.CSSProperties}>
      <section aria-labelledby="product-h" className="container-wide grid items-center gap-12 py-section-sm lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: product.name }]} />
          {product.audience ? <p className="eyebrow !text-accent">{product.audience}</p> : null}
          <h1 id="product-h" className="title-page">
            {product.headline}
          </h1>
          <p className="max-w-prose text-lg text-fg-muted">{product.summary}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {product.primaryCtaHref && product.primaryCtaLabel ? (
              <ButtonLink href={product.primaryCtaHref}>{product.primaryCtaLabel}</ButtonLink>
            ) : null}
            {product.secondaryCtaHref && product.secondaryCtaLabel ? (
              <ButtonLink href={product.secondaryCtaHref} variant="secondary">
                {product.secondaryCtaLabel}
              </ButtonLink>
            ) : null}
            {brochure?.url ? (
              <ButtonLink href={brochure.url} variant="secondary">
                Download brochure (PDF)
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <MediaImage media={product.heroImage} placeholder={product.name} priority focus={product.heroImageFocus} scale={product.heroImageWidth} className="aspect-[5/4] rounded-xl" />
      </section>

      {product.highlights && product.highlights.length > 0 ? (
        <Section tone="tinted" labelledBy="why-h">
          <h2 id="why-h" className="mb-10 title-section">
            Why it performs
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.highlights.map((h) => (
              <li key={h.id ?? h.title} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-6">
                {h.value ? <span className="font-display text-4xl font-extrabold leading-none text-link">{h.value}</span> : null}
                <h3 className="title-small">{h.title}</h3>
                {h.text ? <p className="text-base text-fg-muted">{h.text}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {product.applications && product.applications.length > 0 ? (
        <Section labelledBy="uses-h">
          <h2 id="uses-h" className="mb-10 title-section">
            Where it&apos;s used
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.applications.map((a) => (
              <li key={a.id ?? a.title} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-6">
                <h3 className="title-small">{a.title}</h3>
                {a.text ? <p className="text-base text-fg-muted">{a.text}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {product.whereToBuy && product.whereToBuy.length > 0 ? (
        <Section labelledBy="buy-h" id="buy">
          <h2 id="buy-h" className="mb-10 title-section">
            Where to buy
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {product.whereToBuy.map((w, i) => (
              <li
                key={w.id ?? w.title}
                className={`flex flex-col gap-2.5 rounded-lg bg-surface p-7 ${i === 0 ? "border-2 border-primary" : "border border-border"}`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-link">{w.label}</span>
                <h3 className="title-card">{w.title}</h3>
                {w.text ? <p className="text-base text-fg-muted">{w.text}</p> : null}
                {w.href ? (
                  <a href={safeHref(w.href)} className="link font-display font-semibold">
                    Go to {w.title}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          {product.retailOrderCode ? (
            <p className="mt-6 text-base">
              Can&apos;t find it on the shelf? Ask customer service to order it in with item{" "}
              <strong>#{product.retailOrderCode}</strong>.
            </p>
          ) : null}
        </Section>
      ) : null}

      {product.callout?.heading ? (
        <div className="container-wide pb-section-sm">
          <section aria-labelledby="callout-h" className="grid gap-6 rounded-xl bg-inverse p-8 text-on-inverse sm:p-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-3">
              {product.callout.eyebrow ? <p className="eyebrow !text-on-inverse-accent">{product.callout.eyebrow}</p> : null}
              <h2 id="callout-h" className="title-section">
                {product.callout.heading}
              </h2>
            </div>
            {product.callout.text ? <p className="text-on-inverse-muted">{product.callout.text}</p> : null}
          </section>
        </div>
      ) : null}

      {product.specs && product.specs.length > 0 ? (
        <Section tone="tinted" labelledBy="specs-h">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h2 id="specs-h" className="title-section">
                Specifications
              </h2>
              <p className="text-fg-muted">Values are as received unless stated otherwise, and percentages are by weight.</p>
            </div>
            <table className="w-full border-collapse text-[17px]">
              <caption className="sr-only">{product.name} specifications</caption>
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.id ?? s.label} className="border-t border-border last:border-b">
                    <th scope="row" className="py-3.5 text-left font-semibold">
                      {s.label}
                    </th>
                    <td className="text-right text-fg-muted">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : null}

      {(product.sections ?? []).map((sec, i) => {
        const hasImage = Boolean(sec.image) || Boolean(sec.imagePlaceholder);
        return (
          <Section key={sec.id ?? sec.heading} tone={i % 2 === 0 ? "light" : "tinted"} labelledBy={`sec-${i}-h`}>
            <div className={hasImage ? "grid items-center gap-10 lg:grid-cols-2" : "grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"}>
              <div className="flex flex-col gap-4">
                {sec.eyebrow ? <p className="eyebrow">{sec.eyebrow}</p> : null}
                <h2 id={`sec-${i}-h`} className="title-section">
                  {sec.heading}
                </h2>
                {hasImage && sec.body ? (
                  <div className="prose-pce flex flex-col gap-4 text-lg">
                    <RichText data={sec.body as never} />
                  </div>
                ) : null}
              </div>
              {hasImage ? (
                <MediaImage media={sec.image} placeholder={sec.heading} fit={sec.imageFit} focus={sec.imageFocus} scale={sec.imageWidth} className="aspect-[4/3] rounded-xl" />
              ) : sec.body ? (
                <div className="prose-pce flex flex-col gap-4 text-lg">
                  <RichText data={sec.body as never} />
                </div>
              ) : null}
            </div>
          </Section>
        );
      })}

      <Section tone="dark" labelledBy="world-h">
        <div className="flex flex-col items-start gap-5">
          <h2 id="world-h" className="max-w-3xl title-section">
            The world needs secure, abundant agricultural feedstock &amp; flax fibre
          </h2>
          <ButtonLink href="/contact">Contact us today</ButtonLink>
        </div>
      </Section>

      <Section labelledBy="more-h">
        <h2 id="more-h" className="mb-6 title-card">
          From the same bale
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {others.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                className="pressable flex min-h-18 items-center justify-between rounded-lg border border-border bg-surface px-6 font-display text-lg font-bold no-underline hover:border-primary"
              >
                {p.name} <span aria-hidden="true" className="text-link">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
