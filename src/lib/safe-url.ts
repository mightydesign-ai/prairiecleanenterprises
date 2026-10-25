/**
 * Links come from the CMS. Only allow addresses that are safe to put in an href, so a mistyped or malicious
 * `javascript:` or `data:` link can never run script. Anything else becomes "#".
 */
export function safeHref(href: string | null | undefined): string {
  const value = (href ?? "").trim();
  if (!value) return "#";
  // Site-relative paths and in-page anchors (but not protocol-relative "//host").
  if ((value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? value : "#";
  } catch {
    return "#";
  }
}

/** JSON for a <script type="application/ld+json"> tag. Escapes "<" so data can never close the tag early. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
