import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Mirrors src/lib/indexing.ts. Until SITE_INDEXABLE=true, every response tells crawlers not to index,
// follow, cache, snippet or use it for AI. This also covers /admin, /api and uploaded files.
const isIndexable = process.env.SITE_INDEXABLE === "true";
const noIndexHeaders = isIndexable
  ? []
  : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Job applications carry a resume (capped at 4 MB, under Vercel's 4.5 MB request limit).
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/brand/**" }],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders, ...noIndexHeaders] }];
  },
  // Every legacy WordPress URL keeps working and keeps its search ranking.
  async redirects() {
    return [
      { source: "/sustainability-benefits", destination: "/sustainability", permanent: true },
      { source: "/flax-fibre-edit-nitrocellulose", destination: "/products/flax-fibre", permanent: true },
      { source: "/flax-fibre", destination: "/products/flax-fibre", permanent: true },
      { source: "/cat-litter", destination: "/products/cat-litter", permanent: true },
      { source: "/animal-bedding", destination: "/products/animal-bedding", permanent: true },
      { source: "/fuel-pellets", destination: "/products/fuel-pellets", permanent: true },
      { source: "/straw-buy-form", destination: "/sell-your-straw", permanent: true },
      { source: "/contact/careers", destination: "/careers", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
