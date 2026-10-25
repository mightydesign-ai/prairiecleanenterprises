import type { Block, Field } from "payload";

const eyebrow: Field = {
  name: "eyebrow",
  type: "text",
  admin: { description: "Small label above the heading (optional)." },
};

const heading: Field = { name: "heading", type: "text" };

const tone: Field = {
  name: "tone",
  type: "select",
  defaultValue: "light",
  options: [
    { label: "Light", value: "light" },
    { label: "Tinted", value: "tinted" },
    { label: "Dark teal", value: "dark" },
  ],
  admin: { description: "Background for this section." },
};

const link = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", type: "text", admin: { width: "50%" } },
        {
          name: "href",
          type: "text",
          admin: { width: "50%", description: "A page address like /contact or a full https:// link." },
        },
      ],
    },
  ],
});

export const HeroBlock: Block = {
  slug: "hero",
  imageURL: "/block-previews/hero.svg",
  imageAltText: "Preview of the Hero layout",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    eyebrow,
    { name: "heading", type: "text", required: true },
    { name: "intro", type: "textarea" },
    link("primary", "Main button"),
    link("secondary", "Second button"),
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "showImageArea",
      type: "checkbox",
      label: "Show the photo area on the right",
      defaultValue: false,
      admin: { description: "Shows a placeholder until a photo is added. Turns on automatically when a photo or stat badge is set." },
    },
    {
      name: "stat",
      type: "group",
      label: "Stat badge on the image",
      fields: [
        { name: "value", type: "text" },
        { name: "label", type: "text" },
      ],
    },
  ],
};

export const RichTextBlock: Block = {
  slug: "richText",
  imageURL: "/block-previews/richText.svg",
  imageAltText: "Preview of the Text layout",
  labels: { singular: "Text", plural: "Text" },
  fields: [eyebrow, heading, { name: "content", type: "richText", required: true }, tone],
};

export const ImageTextBlock: Block = {
  slug: "imageText",
  imageURL: "/block-previews/richText.svg",
  imageAltText: "Preview of the Text with image layout",
  labels: { singular: "Text with image", plural: "Text with image" },
  fields: [
    eyebrow,
    heading,
    { name: "content", type: "richText" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "imagePlaceholder",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Show a labelled photo placeholder here until an image is uploaded." },
    },
    {
      name: "imageSide",
      type: "select",
      defaultValue: "right",
      options: [
        { label: "Right of the text", value: "right" },
        { label: "Left of the text", value: "left" },
        { label: "Below the text, full width", value: "below" },
      ],
    },
    tone,
  ],
};

export const HighlightsBlock: Block = {
  slug: "highlights",
  imageURL: "/block-previews/highlights.svg",
  imageAltText: "Preview of the Highlight strip layout",
  labels: { singular: "Highlight strip", plural: "Highlight strips" },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 6,
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};

export const StatsBlock: Block = {
  slug: "stats",
  imageURL: "/block-previews/stats.svg",
  imageAltText: "Preview of the Stats layout",
  labels: { singular: "Stats", plural: "Stats" },
  fields: [
    eyebrow,
    heading,
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text", required: true, admin: { width: "30%" } },
            { name: "label", type: "text", required: true, admin: { width: "70%" } },
          ],
        },
      ],
    },
    { name: "footnote", type: "text" },
    tone,
  ],
};

export const CardsBlock: Block = {
  slug: "cards",
  imageURL: "/block-previews/cards.svg",
  imageAltText: "Preview of the Cards layout",
  labels: { singular: "Cards", plural: "Cards" },
  fields: [
    eyebrow,
    heading,
    { name: "intro", type: "textarea" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "tag", type: "text" },
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
        { name: "highlight", type: "checkbox", admin: { description: "Draw this card with an accent border." } },
      ],
    },
    tone,
  ],
};

export const StepsBlock: Block = {
  slug: "steps",
  imageURL: "/block-previews/steps.svg",
  imageAltText: "Preview of the Numbered steps layout",
  labels: { singular: "Numbered steps", plural: "Numbered steps" },
  fields: [
    eyebrow,
    heading,
    { name: "intro", type: "textarea" },
    {
      name: "items",
      type: "array",
      minRows: 2,
      maxRows: 8,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
    tone,
  ],
};

export const MilestonesBlock: Block = {
  slug: "milestones",
  imageURL: "/block-previews/milestones.svg",
  imageAltText: "Preview of the Timeline layout",
  labels: { singular: "Timeline", plural: "Timelines" },
  fields: [
    heading,
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        {
          type: "row",
          fields: [
            { name: "date", type: "text", required: true, admin: { width: "30%" } },
            { name: "text", type: "text", required: true, admin: { width: "70%" } },
          ],
        },
      ],
    },
  ],
};

export const CtaBlock: Block = {
  slug: "cta",
  imageURL: "/block-previews/cta.svg",
  imageAltText: "Preview of the Call to action layout",
  labels: { singular: "Call to action", plural: "Calls to action" },
  fields: [
    { name: "heading", type: "text", required: true },
    { name: "text", type: "textarea" },
    link("button", "Button"),
    tone,
  ],
};

export const FaqBlock: Block = {
  slug: "faq",
  imageURL: "/block-previews/faq.svg",
  imageAltText: "Preview of the FAQ layout",
  labels: { singular: "FAQ", plural: "FAQs" },
  fields: [
    heading,
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};

export const ProductListBlock: Block = {
  slug: "productList",
  imageURL: "/block-previews/productList.svg",
  imageAltText: "Preview of the Product list layout",
  labels: { singular: "Product list", plural: "Product lists" },
  fields: [eyebrow, heading],
};

export const NewsListBlock: Block = {
  slug: "newsList",
  imageURL: "/block-previews/newsList.svg",
  imageAltText: "Preview of the Latest news layout",
  labels: { singular: "Latest news", plural: "Latest news" },
  fields: [heading, { name: "limit", type: "number", defaultValue: 3, min: 1, max: 12 }],
};

export const TeamBlock: Block = {
  slug: "team",
  imageURL: "/block-previews/team.svg",
  imageAltText: "Preview of the Team layout",
  labels: { singular: "Team", plural: "Team" },
  fields: [heading],
};

export const PartnersBlock: Block = {
  slug: "partners",
  imageURL: "/block-previews/partners.svg",
  imageAltText: "Preview of the Partner logos layout",
  labels: { singular: "Partner logos", plural: "Partner logos" },
  fields: [heading],
};

export const FormBlock: Block = {
  slug: "form",
  imageURL: "/block-previews/form.svg",
  imageAltText: "Preview of the Form layout",
  labels: { singular: "Form", plural: "Forms" },
  fields: [
    { name: "anchor", type: "text", admin: { description: "Optional id so buttons can link here, e.g. offer." } },
    heading,
    { name: "intro", type: "textarea" },
    {
      name: "form",
      type: "select",
      required: true,
      options: [
        { label: "Contact", value: "contact" },
        { label: "Flax straw offer", value: "straw" },
        { label: "Investor package request", value: "investor" },
      ],
    },
  ],
};

export const pageBlocks: Block[] = [
  HeroBlock,
  HighlightsBlock,
  RichTextBlock,
  ImageTextBlock,
  StatsBlock,
  CardsBlock,
  StepsBlock,
  MilestonesBlock,
  ProductListBlock,
  NewsListBlock,
  TeamBlock,
  PartnersBlock,
  FaqBlock,
  FormBlock,
  CtaBlock,
];
