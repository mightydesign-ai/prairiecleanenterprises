import type { MetadataRoute } from "next";
import { getAllPageSlugs, getNews, getOpenJobs, getProducts } from "@/lib/payload";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products, news, jobs] = await Promise.all([getAllPageSlugs(), getProducts(), getNews(), getOpenJobs()]);
  const url = (path: string) => `${site.url}${path}`;
  return [
    ...pages.map((s) => ({ url: url(s === "home" ? "/" : `/${s}`) })),
    { url: url("/products") },
    ...products.map((p) => ({ url: url(`/products/${p.slug}`), lastModified: p.updatedAt })),
    { url: url("/news") },
    ...news.filter((n) => n.kind === "announcement").map((n) => ({ url: url(`/news/${n.slug}`), lastModified: n.updatedAt })),
    { url: url("/careers") },
    ...jobs.map((j) => ({ url: url(`/careers/${j.slug}`), lastModified: j.updatedAt })),
  ];
}
