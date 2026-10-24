// Fails if any SVG in public/ can run code or load anything external.
// Run: node scripts/check-svg.mjs   (also wired into `pnpm check:svg`)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const allowedTags = new Set(["svg", "g", "path", "defs", "style", "title", "desc"]);
const bad = [
  [/<\s*script/i, "script element"],
  [/<\s*foreignObject/i, "foreignObject"],
  [/<\s*(image|use|a|iframe|object|embed|animate|set|link|feImage)\b/i, "element that can load or link external content"],
  [/\son[a-z]+\s*=/i, "event handler attribute"],
  [/(?:xlink:)?href\s*=/i, "href attribute"],
  [/javascript:|data:|vbscript:/i, "script or data URL"],
  [/<!ENTITY|<!DOCTYPE/i, "DTD or entity declaration"],
  [/@import|url\s*\(/i, "CSS import or url()"],
  [/expression\s*\(|behavior\s*:/i, "legacy CSS script hook"],
];

let failed = false;
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
for (const file of walk("public").filter((f) => f.endsWith(".svg") && !f.includes("block-previews"))) {
  const src = readFileSync(file, "utf8");
  const problems = bad.filter(([re]) => re.test(src)).map(([, why]) => why);
  for (const [, tag] of src.matchAll(/<\s*([a-zA-Z][\w:-]*)/g)) {
    if (!allowedTags.has(tag)) problems.push(`tag <${tag}> is not on the allow list`);
  }
  if (problems.length) {
    failed = true;
    console.error(`FAIL ${file}: ${[...new Set(problems)].join("; ")}`);
  } else console.log(`ok   ${file}`);
}
process.exit(failed ? 1 : 0);
