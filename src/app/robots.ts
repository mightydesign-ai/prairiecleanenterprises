import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (Vercel sets VERCEL_ENV) stay out of search results.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return isProduction
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${site.url}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
