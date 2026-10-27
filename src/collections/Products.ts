import { imageFocusField, imageWidthField } from "@/fields/display";
import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "@/access";
import { orderField, seoFields, slugField } from "@/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidate";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "market", "_status", "order"],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "order",
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "audience", type: "text", admin: { description: "Short label, e.g. For pulp and specialty paper." } },
            { name: "headline", type: "text", required: true },
            { name: "summary", type: "textarea", required: true },
            { name: "cardSummary", type: "textarea", admin: { description: "One sentence for product cards." } },
            { name: "heroImage", type: "upload", relationTo: "media" },
            imageFocusField("heroImageFocus"),
            imageWidthField("heroImageWidth"),
            {
              type: "row",
              fields: [
                { name: "primaryCtaLabel", type: "text", defaultValue: "Contact us", admin: { width: "50%" } },
                { name: "primaryCtaHref", type: "text", defaultValue: "/contact", admin: { width: "50%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "secondaryCtaLabel", type: "text", admin: { width: "50%" } },
                { name: "secondaryCtaHref", type: "text", admin: { width: "50%" } },
              ],
            },
            { name: "brochure", type: "upload", relationTo: "media", admin: { description: "PDF brochure (optional)." } },
          ],
        },
        {
          label: "Details",
          fields: [
            {
              name: "highlights",
              type: "array",
              labels: { singular: "Highlight", plural: "Highlights" },
              fields: [
                { name: "value", type: "text", admin: { description: "Optional big figure, e.g. 3×." } },
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea" },
              ],
            },
            {
              name: "applications",
              type: "array",
              labels: { singular: "Use", plural: "Uses" },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea" },
              ],
            },
            {
              name: "specs",
              type: "array",
              labels: { singular: "Specification", plural: "Specifications" },
              admin: { description: "Typical values, as received." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "50%" } },
                    { name: "value", type: "text", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
            {
              name: "sections",
              type: "array",
              labels: { singular: "Section", plural: "Sections" },
              admin: { description: "Longer story sections shown below the specifications, in order." },
              fields: [
                { name: "eyebrow", type: "text" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "richText" },
                { name: "image", type: "upload", relationTo: "media" },
                {
                  name: "imageFit",
                  type: "select",
                  label: "Image display",
                  defaultValue: "crop",
                  options: [
                    { label: "Crop to fit the layout", value: "crop" },
                    { label: "Show the whole image (no cropping)", value: "full" },
                  ],
                },
                imageFocusField(),
                imageWidthField(),
                {
                  name: "imagePlaceholder",
                  type: "checkbox",
                  defaultValue: false,
                  admin: { description: "Show a labelled photo placeholder until an image is uploaded." },
                },
              ],
            },
            {
              name: "whereToBuy",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea" },
                { name: "href", type: "text" },
              ],
            },
            {
              name: "callout",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text" },
                { name: "heading", type: "text" },
                { name: "text", type: "textarea" },
              ],
            },
          ],
        },
      ],
    },
    slugField("name"),
    {
      name: "market",
      type: "select",
      required: true,
      options: [
        { label: "Business buyers", value: "b2b" },
        { label: "Consumers", value: "b2c" },
        { label: "Both", value: "both" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "consumerSiteUrl",
      type: "text",
      admin: { position: "sidebar", description: "Separate product site, e.g. https://prairiecleanlitter.ca" },
    },
    { name: "retailOrderCode", type: "text", admin: { position: "sidebar" } },
    orderField,
    seoFields,
  ],
};
