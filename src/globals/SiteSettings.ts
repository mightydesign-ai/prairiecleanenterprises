import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "@/access";
import { revalidateGlobal } from "@/hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Contact details",
  admin: { group: "Settings", description: "Shown in the footer and on the Contact page." },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "email", type: "email", required: true },
    {
      name: "phones",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true, admin: { width: "40%" } },
            { name: "number", type: "text", required: true, admin: { width: "60%", description: "e.g. 1-844-978-3529" } },
          ],
        },
      ],
    },
    {
      name: "facility",
      type: "group",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "street", type: "text", required: true },
        {
          type: "row",
          fields: [
            { name: "locality", type: "text", required: true },
            { name: "region", type: "text", required: true },
            { name: "postalCode", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "typography",
      type: "group",
      label: "Text sizes",
      admin: { description: "Change heading sizes across the whole site. The font is always Inter." },
      fields: [
        {
          name: "cardTitleSize",
          type: "select",
          label: "Card titles (e.g. Flax Fibre, Animal Bedding)",
          defaultValue: "default",
      options: [
        { label: "Smallest", value: "xs" },
        { label: "Smaller", value: "sm" },
        { label: "Default", value: "default" },
        { label: "Larger", value: "lg" },
        { label: "Largest", value: "xl" },
      ],
        },
        {
          name: "sectionHeadingSize",
          type: "select",
          label: "Section headings",
          defaultValue: "default",
      options: [
        { label: "Smallest", value: "xs" },
        { label: "Smaller", value: "sm" },
        { label: "Default", value: "default" },
        { label: "Larger", value: "lg" },
        { label: "Largest", value: "xl" },
      ],
        },
      ],
    },
    {
      name: "social",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
