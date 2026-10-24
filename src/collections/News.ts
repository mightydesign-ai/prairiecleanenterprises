import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "@/access";
import { seoFields, slugField } from "@/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidate";

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News item", plural: "News" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "source", "publishedOn", "topic", "_status"],
    description: "Media coverage (links out) and PCE's own announcements.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "-publishedOn",
  versions: { drafts: true, maxPerDoc: 10 },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "article",
      options: [
        { label: "Article (links out)", value: "article" },
        { label: "Video (links out)", value: "video" },
        { label: "PCE announcement", value: "announcement" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "source", type: "text", admin: { width: "50%", description: "Outlet name, e.g. CTV News Regina." } },
        {
          name: "externalUrl",
          type: "text",
          admin: {
            width: "50%",
            condition: (data) => data?.kind !== "announcement",
            description: "Link to the story.",
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: { kind?: string } }) => {
            if (siblingData?.kind === "announcement") return true;
            if (!value) return "Add the link to the story.";
            return /^https:\/\//.test(value) ? true : "Use a full https:// link.";
          },
        },
      ],
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 400 },
    {
      name: "body",
      type: "richText",
      admin: { condition: (data) => data?.kind === "announcement" },
    },
    { name: "image", type: "upload", relationTo: "media" },
    slugField("title"),
    {
      name: "publishedOn",
      type: "date",
      required: true,
      index: true,
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "MMM d, yyyy" } },
    },
    {
      name: "topic",
      type: "select",
      required: true,
      defaultValue: "products",
      options: [
        { label: "Products", value: "products" },
        { label: "Facility", value: "facility" },
        { label: "Farmers", value: "farmers" },
        { label: "Research", value: "research" },
        { label: "Funding", value: "funding" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "featured", type: "checkbox", admin: { position: "sidebar", description: "Show as the lead story." } },
    seoFields,
  ],
};
