import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Partners, Jobs, TeamMembers } from "./collections/Company";
import { ContactSubmissions, InvestorInquiries, JobApplications, StrawOffers } from "./collections/Inbox";
import { Media, Resumes } from "./collections/Media";
import { News } from "./collections/News";
import { Pages } from "./collections/Pages";
import { Products } from "./collections/Products";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default buildConfig({
  serverURL: siteUrl,
  // Content is read through the local API; the public GraphQL endpoint is switched off to shrink the attack surface.
  graphQL: { disable: true },
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · PCE website" },
    importMap: { baseDir: path.resolve(dirname) },
    components: { providers: ["/components/admin/MediaPreview#MediaPreviewProvider"] },
  },
  collections: [
    Pages,
    Products,
    News,
    Media,
    TeamMembers,
    Partners,
    Jobs,
    StrawOffers,
    ContactSubmissions,
    InvestorInquiries,
    JobApplications,
    Resumes,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    // Schema changes ship as migrations (src/migrations); dev push is off so local and production never drift.
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Uploads go to Vercel Blob when a token is set; locally they stay on disk.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, resumes: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  telemetry: false,
});
