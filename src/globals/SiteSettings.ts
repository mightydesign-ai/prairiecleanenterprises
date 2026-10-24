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
