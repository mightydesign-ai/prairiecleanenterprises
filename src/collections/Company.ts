import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "@/access";
import { orderField, slugField } from "@/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/hooks/revalidate";

const hooks = { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] };

export const TeamMembers: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team member", plural: "Team" },
  admin: { group: "Company", useAsTitle: "name", defaultColumns: ["name", "role", "order"] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  hooks,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "bio", type: "textarea" },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "linkedin",
      type: "text",
      validate: (v: string | null | undefined) =>
        !v || /^https:\/\/([a-z]+\.)?linkedin\.com\//.test(v) ? true : "Use a full LinkedIn profile link.",
    },
    orderField,
  ],
};

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: { group: "Company", useAsTitle: "name", defaultColumns: ["name", "category", "order"] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: "order",
  hooks,
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "url", type: "text" },
    { name: "logo", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Academic", value: "academic" },
        { label: "Government", value: "government" },
        { label: "Industry", value: "industry" },
        { label: "Retail", value: "retail" },
        { label: "Finance", value: "finance" },
      ],
    },
    orderField,
  ],
};

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job posting", plural: "Job postings" },
  admin: { group: "Company", useAsTitle: "title", defaultColumns: ["title", "location", "open", "postedOn"] },
  access: {
    read: ({ req: { user } }) => (user ? true : { open: { equals: true } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "-postedOn",
  hooks,
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "location", type: "text", required: true, defaultValue: "Weyburn, SK", admin: { width: "33%" } },
        {
          name: "employmentType",
          type: "select",
          required: true,
          defaultValue: "full_time",
          admin: { width: "33%" },
          options: [
            { label: "Full time", value: "full_time" },
            { label: "Part time", value: "part_time" },
            { label: "Contract", value: "contract" },
            { label: "Seasonal", value: "seasonal" },
          ],
        },
        { name: "shift", type: "text", admin: { width: "33%" } },
      ],
    },
    { name: "pay", type: "text", admin: { description: "Shown as written, e.g. $22–$25 an hour." } },
    { name: "summary", type: "textarea", required: true },
    { name: "about", type: "richText" },
    {
      name: "responsibilities",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
    { name: "requirements", type: "array", fields: [{ name: "text", type: "text", required: true }] },
    slugField("title"),
    { name: "open", type: "checkbox", defaultValue: true, index: true, admin: { position: "sidebar", description: "Unticked postings are hidden from the site." } },
    { name: "postedOn", type: "date", required: true, admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } } },
  ],
};
