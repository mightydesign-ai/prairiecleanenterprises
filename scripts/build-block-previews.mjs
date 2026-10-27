/**
 * Draws the layout thumbnails shown in the page editor's "Add Layout" picker (public/block-previews/*.svg).
 * Everything uses the same five greys, so the picker looks calm and the layouts, not the colours, are what you compare.
 *
 *   node scripts/build-block-previews.mjs        (or: pnpm build:previews)
 */
import fs from "node:fs";
import path from "node:path";

// The five greys, darkest to lightest.
const G1 = "#2e2e2e"; // headings and text
const G2 = "#666666"; // buttons, markers, secondary emphasis
const G3 = "#9b9b9b"; // body text, icons
const G4 = "#e4e4e4"; // cards, panels, image areas (light)
const G5 = "#f8f8f8"; // page background, light details

const W = 600;
const H = 400;
const M = 40; // page margin

const r = (x, y, w, h, fill, rx = 4, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${extra} />`;
const c = (cx, cy, rad, fill) => `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" />`;
const outline = (x, y, w, h, stroke, rx = 4, sw = 2) => `<rect x="${x + sw / 2}" y="${y + sw / 2}" width="${w - sw}" height="${h - sw}" rx="${rx}" fill="none" stroke="${stroke}" stroke-width="${sw}" />`;

const eyebrow = (x, y, w = 56) => r(x, y, w, 6, G3, 3);
const title = (x, y, w, fill = G1, h = 16) => r(x, y, w, h, fill, h / 2);
const lines = (x, y, widths, fill = G3, gap = 16, h = 8) => widths.map((w, i) => r(x, y + i * gap, w, h, fill, h / 2)).join("");
const btn = (x, y, w = 96, fill = G2) => r(x, y, w, 32, fill, 8);

/** A photo placeholder: soft panel with a sun and two hills. */
function photo(x, y, w, h, bg = G4, fg = G3, sun = G5) {
  const hill1 = `M${x} ${y + h} L${x} ${y + h * 0.72} Q${x + w * 0.22} ${y + h * 0.42} ${x + w * 0.45} ${y + h * 0.72} T${x + w * 0.9} ${y + h * 0.6} L${x + w} ${y + h * 0.66} L${x + w} ${y + h} Z`;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${bg}" /><path d="${hill1}" fill="${fg}" /><circle cx="${x + w * 0.75}" cy="${y + h * 0.28}" r="${Math.min(w, h) * 0.09}" fill="${sun}" /></g>`.replace(
    `<path d="${hill1}"`,
    `<path d="${hill1}" clip-path="none"`,
  ).replace(' clip-path="none"', "");
}

const person = (cx, cy, rad) =>
  `${c(cx, cy, rad, G3)}${c(cx, cy - rad * 0.28, rad * 0.32, G4)}<path d="M${cx - rad * 0.55} ${cy + rad * 0.62} Q${cx} ${cy - rad * 0.05} ${cx + rad * 0.55} ${cy + rad * 0.62} Z" fill="${G4}" />`;

const frame = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">${r(0, 0, W, H, G5, 0)}${outline(0, 0, W, H, G4, 0, 2)}${body}</svg>\n`;

const heading = (y = 40, w = 220) => eyebrow(M, y) + title(M, y + 18, w);

const previews = {
  hero: () =>
    eyebrow(M, 84, 56) +
    title(M, 106, 250, G1, 22) +
    title(M, 138, 200, G1, 22) +
    lines(M, 190, [240, 200], G3) +
    btn(M, 244, 112, G2) +
    outline(M + 124, 244, 104, 32, G3, 8) +
    photo(340, 56, 220, 288, G4, G3, G5),

  highlights: () =>
    r(0, 150, W, 100, G4, 0) +
    [0, 1, 2].map((i) => { const x = 64 + i * 176; return c(x, 200, 7, G2) + r(x + 18, 196, 84, 8, G1, 4) + r(x + 18, 214, 60, 6, G3, 3); }).join(""),

  richText: () =>
    heading(60, 150) + r(M, 120, 100, 6, G3, 3) +
    lines(250, 66, [300, 290, 300, 260, 300, 280, 300, 230, 290, 190], G3, 22, 9),

  imageText: () =>
    heading(60, 180) + lines(M, 128, [240, 230, 240, 200, 240, 170], G3, 22, 9) + photo(330, 50, 230, 300),

  stats: () =>
    eyebrow(M, 50) + title(M, 68, 200, G1) +
    r(0, 120, W, 190, G4, 0) +
    [0, 1, 2, 3].map((i) => { const x = M + i * 134; return r(x, 150, 70, 28, G1, 6) + r(x, 194, 96, 8, G3, 4) + r(x, 210, 70, 8, G3, 4); }).join("") +
    r(M, 338, 220, 8, G3, 4),

  cards: () =>
    heading(40, 240) +
    [0, 1, 2].map((i) => { const x = M + i * 176; return r(x, 110, 160, 250, G4, 12) + photo(x + 8, 118, 144, 100, G5, G3, G4) + title(x + 16, 236, 100, G1, 12) + lines(x + 16, 264, [124, 110, 80], G3, 14, 7) + r(x + 16, 326, 60, 8, G2, 4); }).join(""),

  steps: () =>
    heading(40, 200) +
    r(80, 190, 440, 3, G4, 2) +
    [0, 1, 2, 3].map((i) => { const x = M + 40 + i * 140; return c(x, 191, 24, G2) + c(x, 191, 7, G5) + r(x - 40, 240, 80, 10, G1, 5) + lines(x - 44, 268, [88, 70], G3, 14, 7); }).join(""),

  milestones: () =>
    heading(40, 200) +
    r(M, 200, 520, 3, G3, 2) +
    [0, 1, 2, 3, 4].map((i) => { const x = M + 10 + i * 118; const up = i % 2 === 0; return c(x, 201, 9, i === 4 ? G1 : G2) + r(x - 28, up ? 146 : 234, 56, 9, G1, 4) + r(x - 28, up ? 164 : 252, 70, 6, G3, 3); }).join(""),

  productList: () =>
    heading(40, 220) +
    [0, 1, 2, 3].map((i) => { const x = M + i * 132; return r(x, 110, 120, 250, G4, 12) + photo(x + 6, 116, 108, 96, G5, G3, G4) + title(x + 12, 230, 76, G1, 12) + lines(x + 12, 258, [92, 84, 60], G3, 13, 7) + r(x + 12, 330, 48, 8, G2, 4); }).join(""),

  newsList: () =>
    heading(40, 200) + r(480, 66, 80, 8, G2, 4) +
    [0, 1, 2].map((i) => { const x = M + i * 176; return r(x, 110, 160, 250, G4, 12) + photo(x + 8, 118, 144, 84, G5, G3, G4) + r(x + 16, 220, 70, 7, G2, 3) + title(x + 16, 238, 120, G1, 12) + lines(x + 16, 266, [124, 110, 84], G3, 14, 7); }).join(""),

  team: () =>
    heading(40, 160) +
    [0, 1, 2, 3].map((i) => { const x = 100 + i * 134; return person(x, 190, 42) + r(x - 40, 252, 80, 10, G1, 5) + r(x - 30, 272, 60, 7, G3, 3) + lines(x - 44, 296, [88, 70], G4, 12, 6); }).join(""),

  partners: () =>
    r(M, 48, 120, 8, G3, 4) + title(M, 68, 180) +
    r(0, 140, W, 130, G4, 0) +
    [0, 1, 2, 3].map((i) => { const x = M + i * 132; return r(x, 168, 112, 74, G5, 10) + r(x + 22, 198, 68, 12, G3, 6); }).join("") +
    r(M, 312, 200, 8, G3, 4),

  faq: () =>
    heading(36, 140) +
    [0, 1, 2, 3].map((i) => { const y = 100 + i * 62; return r(M, y, 520, 50, G4, 10) + r(M + 20, y + 20, 200 + (i % 2) * 70, 10, G1, 5) + `<path d="M${M + 484} ${y + 20} L${M + 494} ${y + 30} L${M + 504} ${y + 20}" fill="none" stroke="${G2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`; }).join(""),

  form: () =>
    r(80, 40, 440, 320, G4, 14) +
    eyebrow(110, 66) + title(110, 84, 160) +
    r(110, 128, 180, 34, G5, 8) + r(310, 128, 180, 34, G5, 8) +
    r(110, 176, 180, 34, G5, 8) + r(310, 176, 180, 34, G5, 8) +
    r(110, 224, 380, 64, G5, 8) +
    btn(110, 308, 110, G1),

  cta: () =>
    r(M, 110, 520, 180, G4, 16) +
    title(72, 148, 240, G1, 20) + lines(72, 190, [280, 220], G3, 16, 8) +
    btn(72, 240, 104, G2) + outline(188, 240, 96, 32, G3, 8),
};

const outDir = path.resolve("public/block-previews");
fs.mkdirSync(outDir, { recursive: true });
for (const [name, draw] of Object.entries(previews)) {
  fs.writeFileSync(path.join(outDir, `${name}.svg`), frame(draw()));
}
console.log(`${Object.keys(previews).length} previews written to public/block-previews/`);
