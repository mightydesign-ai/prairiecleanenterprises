import type { CollectionConfig, Field } from "payload";
import { admins, authenticated, nobody } from "@/access";
import { provinceOptions, submissionMeta } from "@/fields";

/** Submissions come in through server actions only (local API). Staff read and triage them here. */
const inboxAccess = {
  read: authenticated,
  create: nobody,
  update: authenticated,
  delete: admins,
};

const email: Field = {
  name: "email",
  type: "email",
  required: true,
};

const phone = (required: boolean): Field => ({
  name: "phone",
  type: "text",
  required,
  validate: (v: string | null | undefined) =>
    (!v && !required) || (typeof v === "string" && /^[0-9+()\-. ]{7,20}$/.test(v))
      ? true
      : "Enter a phone number with 7 to 20 digits.",
});

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: { singular: "Contact message", plural: "Contact messages" },
  admin: {
    group: "Inbox",
    useAsTitle: "firstName",
    defaultColumns: ["firstName", "email", "topic", "status", "createdAt"],
  },
  access: inboxAccess,
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        { name: "firstName", type: "text", required: true, maxLength: 100, admin: { width: "50%" } },
        { name: "lastName", type: "text", maxLength: 100, admin: { width: "50%" } },
      ],
    },
    { type: "row", fields: [email, phone(false)] },
    {
      name: "topic",
      type: "select",
      required: true,
      defaultValue: "general",
      options: [
        { label: "General", value: "general" },
        { label: "Flax fibre", value: "flax_fibre" },
        { label: "Fuel pellets", value: "fuel_pellets" },
        { label: "Cat litter", value: "cat_litter" },
        { label: "Animal bedding", value: "animal_bedding" },
        { label: "Media", value: "media" },
      ],
    },
    { name: "message", type: "textarea", required: true, maxLength: 5000 },
    ...submissionMeta,
  ],
};

export const StrawOffers: CollectionConfig = {
  slug: "straw-offers",
  labels: { singular: "Straw offer", plural: "Straw offers" },
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "interest", "nearestTown", "estimatedBales", "meetsCriteria", "status", "createdAt"],
    description: "Offers from flax growers. Meets criteria = 900 lb+ bales, 15% moisture or less, rock free.",
  },
  access: inboxAccess,
  defaultSort: "-createdAt",
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Mirrors the published purchase criteria.
        data.meetsCriteria =
          typeof data.avgBaleWeightLb === "number" &&
          data.avgBaleWeightLb >= 900 &&
          typeof data.moisturePct === "number" &&
          data.moisturePct <= 15 &&
          data.rockFree === true;
        return data;
      },
    ],
  },
  fields: [
    {
      name: "interest",
      type: "select",
      required: true,
      options: [
        { label: "Sell straw this year", value: "sell" },
        { label: "Five-year ROFR", value: "rofr" },
        { label: "Information only", value: "info" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "fullName", type: "text", required: true, maxLength: 150, admin: { width: "50%" } },
        { name: "farmName", type: "text", admin: { width: "50%" } },
      ],
    },
    { type: "row", fields: [email, phone(true)] },
    {
      type: "row",
      fields: [
        { name: "province", type: "select", required: true, options: provinceOptions, admin: { width: "33%" } },
        { name: "nearestTown", type: "text", required: true, admin: { width: "33%" } },
        { name: "ruralMunicipality", type: "text", admin: { width: "33%" } },
      ],
    },
    { name: "legalLandLocation", type: "text" },
    {
      type: "collapsible",
      label: "Straw details",
      fields: [
        {
          type: "row",
          fields: [
            { name: "cropYear", type: "number", min: 2020, max: 2100, admin: { width: "33%" } },
            { name: "estimatedBales", type: "number", min: 1, admin: { width: "33%" } },
            {
              name: "baleType",
              type: "select",
              admin: { width: "33%" },
              options: [
                { label: "Round", value: "round" },
                { label: "Large square", value: "large_square" },
              ],
            },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "avgBaleWeightLb", type: "number", min: 1, label: "Average bale weight (lb)", admin: { width: "33%" } },
            { name: "moisturePct", type: "number", min: 0, max: 100, label: "Moisture (%)", admin: { width: "33%" } },
            { name: "canTransport", type: "checkbox", label: "Can haul to Weyburn", admin: { width: "33%" } },
          ],
        },
        { name: "rockFree", type: "checkbox", label: "Bales are rock free" },
      ],
    },
    { name: "message", type: "textarea", maxLength: 5000 },
    {
      name: "meetsCriteria",
      type: "checkbox",
      label: "Meets purchase criteria",
      admin: { readOnly: true, position: "sidebar" },
    },
    ...submissionMeta,
  ],
};

export const InvestorInquiries: CollectionConfig = {
  slug: "investor-inquiries",
  labels: { singular: "Investor request", plural: "Investor requests" },
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "province", "accredited", "packageSentAt", "status", "createdAt"],
  },
  access: inboxAccess,
  defaultSort: "-createdAt",
  fields: [
    { name: "fullName", type: "text", required: true, maxLength: 150 },
    { type: "row", fields: [email, phone(false)] },
    { name: "province", type: "select", required: true, options: provinceOptions },
    {
      name: "accredited",
      type: "select",
      required: true,
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "Not sure", value: "unsure" },
      ],
    },
    { name: "message", type: "textarea", maxLength: 5000 },
    {
      name: "packageSentAt",
      type: "date",
      admin: { position: "sidebar", description: "Only for confirmed accredited investors." },
      validate: (value: unknown, { siblingData }: { siblingData: { accredited?: string } }) =>
        !value || siblingData?.accredited === "yes"
          ? true
          : "Investor packages go to accredited investors only. Confirm accreditation first.",
    },
    ...submissionMeta,
  ],
};

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: { singular: "Job application", plural: "Job applications" },
  admin: {
    group: "Inbox",
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "job", "email", "status", "createdAt"],
  },
  access: inboxAccess,
  defaultSort: "-createdAt",
  fields: [
    { name: "job", type: "relationship", relationTo: "jobs", required: true },
    { name: "fullName", type: "text", required: true, maxLength: 150 },
    { type: "row", fields: [email, phone(true)] },
    { name: "resume", type: "upload", relationTo: "resumes" },
    { name: "coverNote", type: "textarea", maxLength: 5000 },
    ...submissionMeta,
  ],
};
