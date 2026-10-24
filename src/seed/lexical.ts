/** Builds Lexical rich text from plain paragraphs, for seeding content. */
export function richText(...paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        textFormat: 0,
        children: [{ type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
      })),
    },
  };
}
