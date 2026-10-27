import type { Field } from "payload";
import { EDGES, EDGE_STRENGTH } from "@/lib/edges";

/** "Section edge": the shape where this section meets the next one. Shapes come from the list in src/lib/edges.ts. */
export const edgeFields: Field[] = [
  {
    name: "edge",
    type: "select",
    label: "Section edge (bottom)",
    defaultValue: "none",
    options: [{ label: "Straight (none)", value: "none" }, ...Object.entries(EDGES).map(([value, e]) => ({ label: e.label, value }))],
    admin: { description: "The shape where this section meets the next one. The next section's colour shows through the cut." },
  },
  {
    name: "edgeStrength",
    type: "select",
    label: "Edge strength",
    defaultValue: "medium",
    options: Object.entries(EDGE_STRENGTH).map(([value, e]) => ({ label: e.label, value })),
    admin: { description: "How tall the cut is. It scales with the screen width.", condition: (_, sibling) => sibling?.edge && sibling.edge !== "none" },
  },
];
