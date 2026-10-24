import type { Metadata } from "next";
import { formatDate } from "@/components/blocks/RenderBlocks";
import { Breadcrumb, ButtonLink, MediaImage } from "@/components/ui/primitives";
import { getNews, getSiteSettings } from "@/lib/payload";
import type { News } from "@/payload-types";
import { NewsFilter, type NewsCard } from "./NewsFilter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News",
  description: "Coverage of Prairie Clean Enterprises: our Weyburn facility, products and partnerships.",
  alternates: { canonical: "/news" },
};

const topicLabel: Record<string, string> = {
  products: "Products",
  facility: "Facility",
  farmers: "Farmers",
  research: "Research",
  funding: "Funding",
};

const hrefOf = (n: News) => (n.kind === "announcement" ? `/news/${n.slug}` : (n.externalUrl ?? "/news"));

export default async function NewsPage() {
  const [items, settings] = await Promise.all([getNews(), getSiteSettings()]);
  const featured = items.find((n) => n.featured) ?? items[0];
  const rest = items.filter((n) => n.id !== featured?.id);

  const cards: NewsCard[] = rest.map((n) => ({
    id: n.id,
    title: n.title,
    href: hrefOf(n),
    external: n.kind !== "announcement",
    source: n.source ?? "PCE",
    date: formatDate(n.publishedOn),
    topic: n.topic,
    topicLabel: topicLabel[n.topic] ?? n.topic,
    excerpt: n.excerpt,
  }));

  return (
    <div className="container-wide py-section-sm">
      <div className="mb-10 flex flex-col gap-5">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Company" }, { label: "News" }]} />
        <h1 className="text-4xl font-extrabold [font-stretch:110%]">PCE in the news</h1>
        <p className="max-w-prose text-lg text-fg-muted">
          Coverage of our facility, products and partnerships. Media enquiries go to{" "}
          <a href={`mailto:${settings.email}`} className="link">
            {settings.email}
          </a>
          .
        </p>
      </div>

      {featured ? (
        <article className="mb-14 grid overflow-hidden rounded-xl bg-teal-900 text-neutral-100 lg:grid-cols-2">
          <MediaImage media={featured.image} placeholder={featured.title} className="min-h-72" />
          <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
            <span className="text-[15px] font-semibold text-straw-300">
              {[featured.source, featured.kind === "video" ? "Video" : null, formatDate(featured.publishedOn)]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <h2 className="text-3xl">{featured.title}</h2>
            <p className="text-neutral-300">{featured.excerpt}</p>
            <div>
              <ButtonLink href={hrefOf(featured)} onDark>
                {featured.kind === "video" ? "Watch the story" : "Read the story"}
              </ButtonLink>
            </div>
          </div>
        </article>
      ) : null}

      <section aria-labelledby="all-h" className="flex flex-col gap-7">
        <h2 id="all-h" className="text-2xl">
          All coverage
        </h2>
        <NewsFilter items={cards} />
      </section>
    </div>
  );
}
