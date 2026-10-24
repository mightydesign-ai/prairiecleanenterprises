import "server-only";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";
import type { Job, News, Page, Partner, Product, SiteSetting, Team } from "@/payload-types";

export const getPayloadClient = () => getPayload({ config });

/** The local API skips access rules, so public reads filter to published content explicitly. */
const published = { _status: { equals: "published" } } as const;

/** Draft content is only shown to signed-in editors using preview. */
async function isDraft() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient();
  const draft = await isDraft();
  const { docs } = await payload.find({
    collection: "pages",
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, published] },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  });
  return docs[0] ?? null;
});

export const getAllPageSlugs = cache(async (): Promise<string[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "pages",
    where: published,
    limit: 200,
    depth: 0,
    select: { slug: true },
  });
  return docs.map((d) => d.slug);
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "products", where: published, sort: "order", limit: 50, depth: 1 });
  return docs;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient();
  const draft = await isDraft();
  const { docs } = await payload.find({
    collection: "products",
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, published] },
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
  });
  return docs[0] ?? null;
});

export const getNews = cache(async (limit = 100): Promise<News[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "news", where: published, sort: "-publishedOn", limit, depth: 1 });
  return docs;
});

export const getTeam = cache(async (): Promise<Team[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "team", sort: "order", limit: 50, depth: 1 });
  return docs;
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "partners", sort: "order", limit: 50, depth: 1 });
  return docs;
});

export const getOpenJobs = cache(async (): Promise<Job[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: { open: { equals: true } },
    sort: "-postedOn",
    limit: 50,
    overrideAccess: false,
  });
  return docs;
});

export const getJobBySlug = cache(async (slug: string): Promise<Job | null> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: { slug: { equals: slug }, open: { equals: true } },
    limit: 1,
    overrideAccess: false,
  });
  return docs[0] ?? null;
});

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings" });
});
