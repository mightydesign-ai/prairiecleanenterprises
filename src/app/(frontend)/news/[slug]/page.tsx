import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/components/blocks/RenderBlocks";
import { Breadcrumb, MediaImage } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/metadata";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getItem(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    limit: 1,
    depth: 1,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = await getItem(slug);
  if (!n) return {};
  return buildMetadata({ title: n.title, description: n.excerpt, meta: n.meta, path: `/news/${slug}` });
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();
  // Coverage lives on the outlet's site.
  if (item.kind !== "announcement" && item.externalUrl) redirect(item.externalUrl);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-gutter py-section-sm">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: item.title }]} />
      <p className="eyebrow">{formatDate(item.publishedOn)}</p>
      <h1 className="title-page font-extrabold">{item.title}</h1>
      <p className="text-lg text-fg-muted">{item.excerpt}</p>
      {item.image ? <MediaImage media={item.image} placeholder={item.title} className="aspect-[16/9] rounded-xl" /> : null}
      {item.body ? (
        <div className="prose-pce flex flex-col gap-4 text-lg">
          <RichText data={item.body as never} />
        </div>
      ) : null}
    </article>
  );
}
