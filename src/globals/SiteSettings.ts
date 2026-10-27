import type { Field, GlobalConfig } from "payload";
import { anyone, authenticated } from "@/access";
import { revalidateGlobal } from "@/hooks/revalidate";

// Steps on the modular scale defined in globals.css (--step-0 ... --step-7). Sizes shown are the desktop sizes.
const SCALE_PX = [18, 22, 28, 35, 44, 55, 69, 86];
const titleSizeField = (name: string, label: string, description: string): Field => ({
  name,
  type: "select",
  label,
  defaultValue: "default",
  options: [
    { label: "Default (as designed)", value: "default" },
    ...SCALE_PX.map((px, i) => ({ label: `Step ${i}: ${px} px`, value: `s${i}` })),
  ],
  admin: { description },
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
          "Choose the size of every kind of title on the site. Sizes follow a modular scale: each step is 25% larger than the one before on desktop (20% on phones) and shrinks smoothly on small screens. The font is always Inter.",
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
        titleSizeField("pageTitleStep", "Page titles (the main heading at the top of each page)", "Default is about 64 px on desktop (88 px beside a photo)."),
        titleSizeField("sectionHeadingStep", "Section headings", "Default is about 48 px on desktop."),
        titleSizeField("cardTitleStep", "Card titles and sub-headings (e.g. Flax Fibre, Animal Bedding)", "Default is about 36 px on desktop."),
        titleSizeField("smallTitleStep", "Small titles (steps, highlights, list items, names)", "Default is about 28 px on desktop."),
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
