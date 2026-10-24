import type { Field, FieldHook } from "payload";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === "string" && value.length > 0) return slugify(value);
    const source = data?.[fallback];
    return typeof source === "string" ? slugify(source) : value;
  };

/** URL slug, filled from another field when left blank. */
export const slugField = (from = "title", options: { allowSlashes?: boolean } = {}): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: options.allowSlashes
      ? "The page address, e.g. about or company/history. Use home for the homepage."
      : "The page address. Filled in from the title if left blank.",
  },
  hooks: {
    beforeValidate: [
      options.allowSlashes
        ? ({ value, data }) => {
            const raw = typeof value === "string" && value ? value : data?.[from];
            if (typeof raw !== "string") return value;
            return raw
              .split("/")
              .map((part: string) => slugify(part))
              .filter(Boolean)
              .join("/");
          }
        : formatSlug(from),
    ],
  },
});

/** Search title and description with lengths that fit search results. */
export const seoFields: Field = {
  name: "meta",
  type: "group",
  label: "Search and sharing",
  admin: { position: "sidebar" },
  fields: [
    {
      name: "title",
      type: "text",
      maxLength: 60,
      admin: { description: "Up to 60 characters. Leave blank to use the page title." },
    },
    {
      name: "description",
      type: "textarea",
      maxLength: 160,
      admin: { description: "Up to 160 characters, shown under the title in search results." },
    },
    { name: "image", type: "upload", relationTo: "media", admin: { description: "Social sharing image, 1200×630." } },
  ],
};

export const orderField: Field = {
  name: "order",
  type: "number",
  defaultValue: 0,
  admin: { position: "sidebar", description: "Lower numbers show first." },
};

/** Status for the staff inboxes. */
export const inboxStatus: Field = {
  name: "status",
  type: "select",
  defaultValue: "new",
  index: true,
  options: [
    { label: "New", value: "new" },
    { label: "In review", value: "in_review" },
    { label: "Responded", value: "responded" },
    { label: "Closed", value: "closed" },
    { label: "Spam", value: "spam" },
  ],
  admin: { position: "sidebar" },
};

/** Fields every submission records automatically. */
export const submissionMeta: Field[] = [
  inboxStatus,
  {
    name: "assignedTo",
    type: "relationship",
    relationTo: "users",
    admin: { position: "sidebar" },
  },
  {
    name: "internalNotes",
    type: "textarea",
    admin: { position: "sidebar", description: "Only staff see these notes." },
  },
  {
    name: "consentAt",
    type: "date",
    required: true,
    admin: { readOnly: true, position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
  },
  {
    name: "ipHash",
    type: "text",
    index: true,
    admin: { hidden: true },
  },
];

export const provinceOptions = [
  { label: "Saskatchewan", value: "SK" },
  { label: "Manitoba", value: "MB" },
  { label: "Alberta", value: "AB" },
  { label: "British Columbia", value: "BC" },
  { label: "Ontario", value: "ON" },
  { label: "Quebec", value: "QC" },
  { label: "Atlantic Canada", value: "ATL" },
  { label: "Territories", value: "TERR" },
  { label: "United States", value: "US" },
  { label: "Outside North America", value: "INTL" },
];
