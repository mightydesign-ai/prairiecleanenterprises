import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, MediaImage } from "@/components/ui/primitives";
import { getProducts } from "@/lib/payload";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products",
  description: "Flax fibre, fuel pellets, cat litter and animal bedding, all made from Saskatchewan flax straw.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <section aria-labelledby="products-h" className="container-wide py-section-sm">
      <div className="mb-10 flex flex-col gap-5">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        <h1 id="products-h" className="text-4xl font-extrabold">
          Four products from one crop residue
        </h1>
        <p className="max-w-prose text-lg text-fg-muted">
          Our Weyburn facility separates flax straw into fibre and shive. The fibre goes to paper and biomaterials makers; the
          shive becomes pellets for fuel, cat litter and animal bedding.
        </p>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id} className="flex">
            <Link
              href={`/products/${p.slug}`}
              className="pressable group flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-surface no-underline shadow-card hover:shadow-raised"
            >
              <MediaImage media={p.heroImage} placeholder={p.name} className="aspect-[16/9]" sizes="(min-width: 640px) 50vw, 100vw" />
              <span className="flex flex-col gap-2 p-6">
                {p.audience ? <span className="text-sm font-semibold text-accent">{p.audience}</span> : null}
                <span className="font-display text-2xl font-bold group-hover:text-link">{p.name}</span>
                <span className="text-base text-fg-muted">{p.cardSummary ?? p.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
