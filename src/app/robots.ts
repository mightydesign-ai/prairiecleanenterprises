import type { MetadataRoute } from "next";
import { aiCrawlers, isIndexable } from "@/lib/indexing";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Until launch (SITE_INDEXABLE=true), every crawler is turned away, AI crawlers named explicitly.
  if (!isIndexable) {
    return {
      rules: [
        { userAgent: "*", disallow: "/" },
        { userAgent: aiCrawlers, disallow: "/" },
      ],
    };
  }
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${site.url}/sitemap.xml` };
}
