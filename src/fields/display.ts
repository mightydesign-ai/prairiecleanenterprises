import type { Field } from "payload";

/**
 * The modular scale (--step-0 ... --step-7 in globals.css) in rem: [phone, desktop]. 1 rem is the visitor's browser text
 * size (16 px by default), so these follow zoom and the visitor's own text-size setting.
 */
export const STEP_REM: [number, number][] = [
  [1.0625, 1.125],
  [1.275, 1.4062],
  [1.53, 1.7578],
  [1.836, 2.1973],
  [2.2032, 2.7466],
  [2.6438, 3.4332],
  [3.1726, 4.2915],
  [3.8071, 5.3644],
];

const rem = (n: number) => `${Number(n.toFixed(2))}`;
const range = ([a, b]: [number, number]) => `${rem(a)} to ${rem(b)} rem`;

/** What each kind of title uses when nothing is chosen (phone to desktop, in rem). Matches the --text-* tokens in globals.css. */
export const ROLE_DEFAULT: Record<"page" | "section" | "card" | "small", string> = {
  page: "2.25 to 4 rem (2.75 to 5.5 rem beside a photo)",
  section: "1.88 to 3 rem",
  card: "1.63 to 2.25 rem",
  small: "1.38 to 1.75 rem",
};

/**
 * Title size picker: "Default" keeps the size from Site settings (or, in Site settings, the designed size); a step overrides it.
 * `role` says which kind of title this is, so the Default option can show the size it really uses.
 */
export const titleSizeField = (
  name: string,
  label: string,
  description?: string,
  opts: { role?: keyof typeof ROLE_DEFAULT; site?: boolean } = {},
): Field => ({
  name,
  type: "select",
  label,
  defaultValue: "default",
  options: [
    {
      label: opts.role
        ? opts.site
          ? `Default: ${ROLE_DEFAULT[opts.role]}`
          : `Default: follows Site settings (designed size ${ROLE_DEFAULT[opts.role]})`
        : "Default: follows Site settings",
      value: "default",
    },
    ...STEP_REM.map((r, i) => ({ label: `Step ${i}: ${range(r)}`, value: `s${i}` })),
  ],
  admin: {
    description:
      description ??
      "Sizes are in rem (1 rem is the visitor's browser text size, 16 px by default) on a modular scale: each step is 25% larger on desktop and 20% on phones. They shrink smoothly on small screens.",
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
