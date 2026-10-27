/**
 * Section edges: the shape where one section meets the next (an angled cut, in the first version).
 *
 * To add a new shape later, add ONE entry to EDGES below. The editor's "Section edge" dropdown, the saved value and the
 * page rendering all read from this list. `clip` receives the edge height as a CSS length and returns a CSS clip-path
 * for the section's own box (the box is clipped away at the bottom; the next section's colour shows through).
 * Curves and waves can be written as polygon() points or path().
 */
export const EDGES = {
  "angle-rise": {
    label: "Angled, rising to the right",
    clip: (h: string) => `polygon(0 0, 100% 0, 100% calc(100% - ${h}), 0 100%)`,
  },
  "angle-fall": {
    label: "Angled, falling to the right",
    clip: (h: string) => `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${h}))`,
  },
} as const;

/** How tall the edge is. Fluid: it grows with the screen width but never gets tiny on phones or huge on wide screens. */
export const EDGE_STRENGTH = {
  gentle: { label: "Gentle", height: "clamp(1rem, 2.5vw, 2.25rem)" },
  medium: { label: "Medium", height: "clamp(1.5rem, 4vw, 3.5rem)" },
  steep: { label: "Steep", height: "clamp(2rem, 6vw, 5.5rem)" },
} as const;

export type EdgeKey = keyof typeof EDGES;
export type EdgeStrengthKey = keyof typeof EDGE_STRENGTH;

export const isEdge = (v: unknown): v is EdgeKey => typeof v === "string" && v in EDGES;
