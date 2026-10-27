import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "@/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    useAsTitle: "alt",
    // "filename" shows a thumbnail beside the file name; click the thumbnail for a larger preview.
    defaultColumns: ["filename", "alt", "decorative", "caption"],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    focalPoint: true,
    // Every new upload is shrunk to fit inside 1024 x 1024 and saved as WebP, so nobody can add a 3 MB PNG by accident.
    // (SVGs and PDFs are left alone. `pnpm optimize-media` sets MEDIA_PASSTHROUGH because it has already done this.)
    ...(process.env.MEDIA_PASSTHROUGH
      ? {}
      : {
          resizeOptions: { width: 1024, height: 1024, fit: "inside" as const, withoutEnlargement: true },
          formatOptions: { format: "webp" as const, options: { quality: 82 } },
        }),
    imageSizes: [
      { name: "thumb", width: 480, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "card", width: 960, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "hero", width: 1920, formatOptions: { format: "webp", options: { quality: 80 } } },
    ],
    adminThumbnail: "thumb",
  },
  fields: [
    {
      name: "decorative",
      type: "checkbox",
      label: "Decorative only (screen readers skip it)",
      defaultValue: false,
    },
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      admin: {
        description: "Describe what the image shows for people who can't see it. Required unless decorative.",
        condition: (data) => !data?.decorative,
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: { decorative?: boolean } }) => {
        if (siblingData?.decorative) return true;
        return value && value.trim().length > 0 ? true : "Add alt text, or mark the image as decorative.";
      },
    },
    { name: "caption", type: "text" },
    { name: "credit", type: "text" },
  ],
};

/** Applicant resumes: private, staff only. */
export const Resumes: CollectionConfig = {
  slug: "resumes",
  admin: { group: "Inbox", hidden: true },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  fields: [],
};
