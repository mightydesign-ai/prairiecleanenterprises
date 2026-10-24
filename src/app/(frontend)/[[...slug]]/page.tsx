import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { Breadcrumb } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/metadata";
import { getAllPageSlugs, getPageBySlug } from "@/lib/payload";

export const revalidate = 3600;

type Props = { params: Promise<{ slug?: string[] }> };

const toSlug = (parts?: string[]) => (parts && parts.length ? parts.join("/") : "home");

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((s) => ({ slug: s === "home" ? [] : s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = toSlug((await params).slug);
  const page = await getPageBySlug(slug);
  if (!page) return {};
  if (slug === "home") {
    return { ...buildMetadata({ title: page.title, meta: page.meta, path: "/" }), title: { absolute: page.meta?.title || page.title } };
  }
  return buildMetadata({ title: page.title, meta: page.meta, path: `/${slug}` });
}

const parentLabel: Record<string, string> = { company: "Company", products: "Products" };

export default async function CmsPage({ params }: Props) {
  const slug = toSlug((await params).slug);
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const parent = page.breadcrumbParent && page.breadcrumbParent !== "none" ? parentLabel[page.breadcrumbParent] : null;

  return (
    <>
      {slug !== "home" ? (
        <div className="container-wide pt-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, ...(parent ? [{ label: parent }] : []), { label: page.title }]} />
        </div>
      ) : null}
      <RenderBlocks blocks={page.layout} />
    </>
  );
}
