import type { Field, GlobalConfig } from "payload";
import { titleSizeField } from "@/fields/display";
import { anyone, authenticated } from "@/access";
import { revalidateGlobal } from "@/hooks/revalidate";


const WEIGHTS = [
  { label: "Regular (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra bold (800)", value: "800" },
];
const weightField = (name: string, label: string): Field => ({
  name,
  type: "select",
  label,
  defaultValue: "default",
  options: [{ label: "Default: Bold (700)", value: "default" }, ...WEIGHTS],
  admin: { description: "Inter is a variable font, so every weight is available." },
});

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
      admin: {
        description:
          "Choose the size of every kind of title on the site. Sizes are in rem (1 rem is the visitor's browser text size, 16 px by default) on a modular scale: each step is 25% larger than the one before on desktop (20% on phones) and shrinks smoothly on small screens. The font is always Inter.",
      },
      fields: [
        {
          name: "headingScale",
          type: "select",
          label: "All headings together",
          defaultValue: "100",
          options: [
            { label: "80% (much smaller)", value: "80" },
            { label: "90% (smaller)", value: "90" },
            { label: "100% (as designed)", value: "100" },
            { label: "110% (larger)", value: "110" },
            { label: "125% (much larger)", value: "125" },
            { label: "150% (largest)", value: "150" },
          ],
          admin: {
            description:
              "Scales every heading on the site at once (page titles, section headings, card titles, small titles and headings inside text). The four settings below then change one kind of heading. Sizes are in rem, so they also follow each visitor's own browser text size.",
          },
        },
        titleSizeField("pageTitleStep", "Page titles (the main heading at the top of each page)", undefined, { role: "page", site: true }),
        titleSizeField("sectionHeadingStep", "Section headings", undefined, { role: "section", site: true }),
        titleSizeField("cardTitleStep", "Card titles and sub-headings (e.g. Flax Fibre, Animal Bedding)", undefined, { role: "card", site: true }),
        titleSizeField("smallTitleStep", "Small titles (steps, highlights, list items, names)", undefined, { role: "small", site: true }),
        weightField("pageTitleWeight", "Page title weight"),
        weightField("sectionHeadingWeight", "Section heading weight"),
        weightField("cardTitleWeight", "Card title weight"),
        weightField("smallTitleWeight", "Small title weight"),
        // Replaced by the four "...Step" fields above. Kept (hidden) so no column is dropped; safe to remove later with a migration.
        { name: "cardTitleSize", type: "select", options: ["xs", "sm", "default", "lg", "xl"], defaultValue: "default", admin: { hidden: true } },
        { name: "sectionHeadingSize", type: "select", options: ["xs", "sm", "default", "lg", "xl"], defaultValue: "default", admin: { hidden: true } },
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
