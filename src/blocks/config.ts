import type { Block, Field } from "payload";
import { imageFocusField, imageWidthField, titleSizeField } from "@/fields/display";
import { edgeFields } from "@/fields/edge";
import { iconBadgeField } from "@/fields/icon";

const eyebrow: Field = {
  name: "eyebrow",
  type: "text",
  admin: { description: "Small label above the heading (optional)." },
};

const heading: Field = { name: "heading", type: "text" };
const headingSize = titleSizeField("headingSize", "Heading size");

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

/** "How many in a row" for card-style grids. Automatic keeps each block's own layout; phones always show one column. */
const columnsField: Field = {
  name: "columns",
  type: "select",
  label: "How many in a row",
  defaultValue: "auto",
  options: [
    { label: "Automatic", value: "auto" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
  ],
  admin: { description: "On phones the items always stack in one column, and on tablets they never go above two." },
};

export const HeroBlock: Block = {
  slug: "hero",
  imageURL: "/block-previews/hero.svg",
  imageAltText: "Preview of the Hero layout",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    eyebrow,
    { name: "heading", type: "text", required: true },
    titleSizeField("headingSize", "Heading size"),
    { name: "intro", type: "textarea" },
    link("primary", "Main button"),
    link("secondary", "Second button"),
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
      admin: { description: "Crop keeps every image the same shape. Whole image keeps the photo's own proportions." },
    },
    imageFocusField(),
    imageWidthField(),
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
  fields: [eyebrow, heading, headingSize, { name: "content", type: "richText", required: true }, tone],
};

export const ImageTextBlock: Block = {
  slug: "imageText",
  imageURL: "/block-previews/richText.svg",
  imageAltText: "Preview of the Text with image layout",
  labels: { singular: "Text with image", plural: "Text with image" },
  fields: [
    eyebrow,
    heading, headingSize,
    { name: "content", type: "richText" },
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
      admin: { description: "Crop keeps every image the same shape. Whole image keeps the photo's own proportions." },
    },
    imageFocusField(),
    imageWidthField(),
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
      fields: [{ name: "text", type: "text", required: true }, iconBadgeField("iconBadge", "Icon (replaces the dot)")],
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
    heading, headingSize,
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
    heading, headingSize,
    titleSizeField("itemTitleSize", "Card title size", "Size of the title on every item in this block. Default uses the Site settings size."),
    { name: "intro", type: "textarea" },
    columnsField,
    {
      name: "showBorder",
      type: "checkbox",
      label: "Draw a border around each card",
      defaultValue: true,
    },
    {
      name: "imagePosition",
      type: "select",
      label: "Image position",
      defaultValue: "left",
      options: [
        { label: "Above the text", value: "above" },
        { label: "Left of the text", value: "left" },
        { label: "Right of the text", value: "right" },
      ],
      admin: { description: "Applies to cards that have an image." },
    },
    {
      name: "imageSize",
      type: "select",
      label: "Image size",
      defaultValue: "md",
      options: [
        { label: "Small (48 px)", value: "sm" },
        { label: "Medium (80 px)", value: "md" },
        { label: "Large (128 px)", value: "lg" },
        { label: "Extra large (192 px)", value: "xl" },
      ],
      admin: { description: "Height of the image. The picture keeps its own proportions." },
    },
    {
      name: "alignment",
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { label: "Left", value: "left" },
        { label: "Centre", value: "center" },
        { label: "Right", value: "right" },
      ],
      admin: { description: "Text alignment, and the image's position when it sits above the text." },
    },
    {
      name: "imageVerticalAlign",
      type: "select",
      label: "Image height when beside the text",
      defaultValue: "center",
      options: [
        { label: "Top", value: "top" },
        { label: "Middle", value: "center" },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        { name: "tag", type: "text" },
        { name: "image", type: "upload", relationTo: "media", admin: { description: "Optional icon or picture (SVG or PNG) shown beside the text." } },
        iconBadgeField("iconBadge", "Icon (replaces the picture)"),
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
    heading, headingSize,
    titleSizeField("itemTitleSize", "Step title size", "Size of the title on every item in this block. Default uses the Site settings size."),
    { name: "intro", type: "textarea" },
    columnsField,
    {
      name: "items",
      type: "array",
      minRows: 2,
      maxRows: 8,
      fields: [
        iconBadgeField("iconBadge", "Icon (replaces the step number)"),
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
    heading, headingSize,
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
    titleSizeField("headingSize", "Heading size"),
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
    heading, headingSize,
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
  fields: [
    eyebrow,
    heading,
    headingSize,
    titleSizeField("itemTitleSize", "Card title size", "Size of the product names on the cards. Default uses the Site settings size."),
    columnsField,
  ],
};

export const NewsListBlock: Block = {
  slug: "newsList",
  imageURL: "/block-previews/newsList.svg",
  imageAltText: "Preview of the Latest news layout",
  labels: { singular: "Latest news", plural: "Latest news" },
  fields: [heading, headingSize, { name: "limit", type: "number", defaultValue: 3, min: 1, max: 12 }, columnsField],
};

export const TeamBlock: Block = {
  slug: "team",
  imageURL: "/block-previews/team.svg",
  imageAltText: "Preview of the Team layout",
  labels: { singular: "Team", plural: "Team" },
  fields: [heading, headingSize, columnsField],
};

export const PartnersBlock: Block = {
  slug: "partners",
  imageURL: "/block-previews/partners.svg",
  imageAltText: "Preview of the Partner logos layout",
  labels: { singular: "Partner logos", plural: "Partner logos" },
  fields: [heading, headingSize],
};

export const FormBlock: Block = {
  slug: "form",
  imageURL: "/block-previews/form.svg",
  imageAltText: "Preview of the Form layout",
  labels: { singular: "Form", plural: "Forms" },
  fields: [
    { name: "anchor", type: "text", admin: { description: "Optional id so buttons can link here, e.g. offer." } },
    heading, headingSize,
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

// Every section with its own background can end in an angled (or other) edge.
for (const b of [RichTextBlock, ImageTextBlock, StatsBlock, CardsBlock, StepsBlock, MilestonesBlock, ProductListBlock, NewsListBlock, TeamBlock, PartnersBlock, FaqBlock, FormBlock]) {
  b.fields.push(...edgeFields);
}

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
