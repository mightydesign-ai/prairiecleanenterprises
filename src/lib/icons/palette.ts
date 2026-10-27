/**
 * Colours for icon badges. Each circle colour has an icon colour paired with it that passes WCAG 2.2 AA (3:1 for
 * graphics), so "automatic" is always safe. The class names are written out in full so Tailwind can see them.
 */
export const CIRCLES = {
  teal: { label: "Teal", circle: "bg-teal-500", icon: "text-white" },
  green: { label: "Green", circle: "bg-green-500", icon: "text-white" },
  straw: { label: "Straw (brown)", circle: "bg-straw-500", icon: "text-white" },
  charcoal: { label: "Charcoal", circle: "bg-neutral-800", icon: "text-white" },
  light: { label: "Light grey", circle: "bg-surface-sunken", icon: "text-link" },
  white: { label: "White with outline", circle: "border border-border bg-white", icon: "text-teal-600" },
  none: { label: "No circle", circle: "", icon: "text-link" },
} as const;

export const ICON_COLOURS = {
  auto: { label: "Automatic (matches the circle)", cls: "" },
  white: { label: "White", cls: "text-white" },
  teal: { label: "Teal", cls: "text-teal-500" },
  green: { label: "Green", cls: "text-green-500" },
  straw: { label: "Straw (brown)", cls: "text-straw-500" },
  charcoal: { label: "Charcoal", cls: "text-neutral-800" },
} as const;

/** Circle diameter and icon size for each choice. */
export const BADGE_SIZES = {
  sm: { label: "Small (48 px)", circle: "size-12", icon: "size-6", bare: "size-8" },
  md: { label: "Medium (64 px)", circle: "size-16", icon: "size-8", bare: "size-10" },
  lg: { label: "Large (96 px)", circle: "size-24", icon: "size-12", bare: "size-16" },
  xl: { label: "Extra large (128 px)", circle: "size-32", icon: "size-16", bare: "size-24" },
} as const;

export type CircleKey = keyof typeof CIRCLES;
export type IconColourKey = keyof typeof ICON_COLOURS;
export type BadgeSizeKey = keyof typeof BADGE_SIZES;
