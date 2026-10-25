type Item = string | { list: string[] } | { heading: string };

const text = (t: string, format = 0) => ({ type: "text", text: t, format, detail: 0, mode: "normal", style: "", version: 1 });

/** Builds Lexical rich text for seeding: a string is a paragraph, { list } a bulleted list, { heading } an h3. */
export function richText(...items: Item[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: items.map((item) => {
        if (typeof item === "string") {
          return { type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0, children: [text(item)] };
        }
        if ("list" in item) {
          return {
            type: "list",
            listType: "bullet",
            tag: "ul",
            start: 1,
            format: "",
            indent: 0,
            version: 1,
            direction: "ltr",
            children: item.list.map((t, i) => ({
              type: "listitem",
              value: i + 1,
              format: "",
              indent: 0,
              version: 1,
              direction: "ltr",
              children: [text(t)],
            })),
          };
        }
        return { type: "heading", tag: "h3", format: "", indent: 0, version: 1, direction: "ltr", children: [text(item.heading)] };
      }),
    },
  };
}
