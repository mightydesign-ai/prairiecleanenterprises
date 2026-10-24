import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "@/access";
import { pageBlocks } from "@/blocks/config";
import { seoFields, slugField } from "@/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidate";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "Every page that isn't a product, news story or job. The homepage has the address home.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    slugField("title", { allowSlashes: true }),
    {
      name: "breadcrumbParent",
      type: "select",
      admin: { position: "sidebar", description: "Menu section shown in the breadcrumb." },
      options: [
        { label: "None", value: "none" },
        { label: "Company", value: "company" },
        { label: "Products", value: "products" },
      ],
      defaultValue: "none",
    },
    {
      name: "layout",
      type: "blocks",
      blocks: pageBlocks,
      required: true,
      minRows: 1,
    },
    seoFields,
  ],
};
