import type { Field } from "payload";

/** Desktop size of each step on the modular scale (--step-0 ... --step-7 in globals.css). */
export const SCALE_PX = [18, 22, 28, 35, 44, 55, 69, 86];

/** Title size picker: "Default" keeps the Site settings size; a step overrides it for this block only. */
export const titleSizeField = (name: string, label: string, description?: string): Field => ({
  name,
  type: "select",
  label,
  defaultValue: "default",
  options: [
    { label: "Default (from Site settings)", value: "default" },
    ...SCALE_PX.map((px, i) => ({ label: `Step ${i}: ${px} px`, value: `s${i}` })),
  ],
  admin: {
    description:
      description ??
      "A step on the modular scale (each step is 25% larger on desktop, 20% on phones). Sizes shrink smoothly on small screens.",
  },
});

export const FOCUS_OPTIONS = [
  { label: "Use the photo's own focal point (Media library)", value: "default" },
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top left", value: "top-left" },
  { label: "Top right", value: "top-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom right", value: "bottom-right" },
];

/** Which part of a cropped photo stays in view. Only matters when the image is cropped to fit. */
export const imageFocusField = (name = "imageFocus"): Field => ({
  name,
  type: "select",
  label: "Photo focus (when cropped)",
  defaultValue: "default",
  options: FOCUS_OPTIONS,
  admin: {
    description:
      "Choose which part of the photo stays visible when it is cropped, on every screen size. For an exact point, open the photo in the Media library and set its focal point there.",
  },
});

/** Display width of the photo as a share of the space it sits in (100% down to 5%). */
export const imageWidthField = (name = "imageWidth"): Field => ({
  name,
  type: "select",
  label: "Photo size",
  defaultValue: "100",
  options: Array.from({ length: 20 }, (_, i) => {
    const pct = 100 - i * 5;
    return { label: `${pct}%`, value: String(pct) };
  }),
  admin: {
    description: "How wide the photo is shown, as a share of the space for it. It stays centred and keeps its proportions on every screen size.",
  },
});
