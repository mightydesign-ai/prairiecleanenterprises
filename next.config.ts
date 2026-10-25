import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

// Vercel Blob store hostname, derived from the token (vercel_blob_rw_<storeId>_...). Only this store may be
// optimised through /_next/image, so the site can't be used as an image proxy for anyone else's blob store.
const blobStoreId = process.env.BLOB_READ_WRITE_TOKEN?.split("_")[3]?.toLowerCase();
const blobHost = blobStoreId ? `${blobStoreId}.public.blob.vercel-storage.com` : null;

// Content Security Policy for the public site. Next.js and the theme script use inline scripts, so script-src
// keeps 'unsafe-inline'; everything else is locked down (no plugins, no framing, forms and base URL pinned to
// this site, connections and images only to this site and our own blob store). /admin and /api are excluded
// because the Payload admin has its own requirements.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${blobHost ? ` https://${blobHost}` : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${blobHost ? ` https://${blobHost}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
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
    remotePatterns: blobHost ? [{ protocol: "https", hostname: blobHost }] : [],
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
    return [
      { source: "/:path*", headers: [...securityHeaders, ...noIndexHeaders] },
      { source: "/((?!admin|api).*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
      // Uploaded files (editors can upload SVG). Shown through <img> they are inert; opened directly, this
      // CSP stops any script or network access.
      {
        source: "/api/media/file/:file*.svg",
        headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; sandbox" }],
      },
      // Logos are SVG. Used through <img> they cannot run script, and if someone opens one directly this CSP
      // (no script, no network, sandboxed) keeps it inert. scripts/check-svg.mjs rejects unsafe SVGs at build.
      {
        source: "/brand/:file*.svg",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; sandbox" },
          { key: "Content-Type", value: "image/svg+xml" },
        ],
      },
    ];
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
