import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "images");

const BRAND_500 = "#f2600c";
const BRAND_600 = "#e04a00";
const BRAND_100 = "#ffe6d5";
const INK_900 = "#101826";
const INK_800 = "#1a2436";

function wrap(inner, { id, bgFrom = "#fff1e6", bgTo = "#ffffff" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgFrom}" />
      <stop offset="100%" stop-color="${bgTo}" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg-${id})" />
  <circle cx="400" cy="400" r="270" fill="${BRAND_100}" opacity="0.5" />
  <g transform="translate(400 400)" fill="none" stroke="${INK_800}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </g>
</svg>`;
}

function gearPath(cx, cy, rOuter, rInner, teeth, toothLen) {
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI * i) / teeth;
    const r = i % 2 === 0 ? rOuter + toothLen : rOuter;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${BRAND_500}" stroke="${INK_800}" stroke-width="10" />
    <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#fff" stroke="${INK_800}" stroke-width="10" />`;
}

const icons = {
  motor: `
    <rect x="-140" y="-60" width="280" height="160" rx="18" fill="#fff" />
    <rect x="-140" y="-60" width="280" height="160" rx="18" />
    <rect x="-100" y="-140" width="60" height="80" rx="8" fill="${BRAND_500}" />
    <rect x="0" y="-140" width="60" height="80" rx="8" fill="${BRAND_500}" />
    <circle cx="-80" cy="20" r="26" fill="none" />
    <circle cx="20" cy="20" r="26" fill="none" />
    <line x1="-140" y1="100" x2="140" y2="100" />
    <line x1="-160" y1="130" x2="160" y2="130" />
  `,
  hidraulica: `
    <rect x="-160" y="-40" width="220" height="80" rx="12" fill="#fff" />
    <rect x="60" y="-60" width="110" height="120" rx="10" fill="${BRAND_500}" />
    <line x1="170" y1="-30" x2="220" y2="-30" />
    <line x1="170" y1="30" x2="220" y2="30" />
    <circle cx="-160" cy="0" r="18" fill="#fff" />
    <path d="M -220 -90 L -160 -40" />
    <path d="M -220 90 L -160 40" />
  `,
  transmissao: `
    ${gearPath(-70, -20, 90, 40, 10, 26)}
    ${gearPath(120, 90, 55, 24, 8, 18)}
  `,
  eletrica: `
    <rect x="-110" y="-160" width="220" height="320" rx="24" fill="#fff" />
    <rect x="-70" y="-200" width="50" height="40" fill="${INK_800}" />
    <rect x="20" y="-200" width="50" height="40" fill="${INK_800}" />
    <line x1="-60" y1="-80" x2="60" y2="-80" stroke="${BRAND_500}" />
    <line x1="-60" y1="-20" x2="60" y2="-20" stroke="${BRAND_500}" />
    <line x1="-60" y1="40" x2="60" y2="40" stroke="${BRAND_500}" />
    <path d="M -20 -140 L -50 0 L 10 0 L -20 160" fill="none" stroke="${BRAND_600}" stroke-width="14" />
  `,
  filtros: `
    <rect x="-90" y="-180" width="180" height="360" rx="26" fill="#fff" />
    <rect x="-90" y="-180" width="180" height="70" rx="20" fill="${BRAND_500}" />
    <line x1="-90" y1="-40" x2="90" y2="-40" />
    <line x1="-90" y1="20" x2="90" y2="20" />
    <line x1="-90" y1="80" x2="90" y2="80" />
    <line x1="-90" y1="140" x2="90" y2="140" />
  `,
  travoes: `
    <circle cx="0" cy="0" r="180" fill="#fff" />
    <circle cx="0" cy="0" r="180" />
    <circle cx="0" cy="0" r="60" fill="${BRAND_500}" stroke="${INK_800}" />
    <circle cx="0" cy="-120" r="14" fill="${INK_800}" stroke="none" />
    <circle cx="104" cy="60" r="14" fill="${INK_800}" stroke="none" />
    <circle cx="-104" cy="60" r="14" fill="${INK_800}" stroke="none" />
  `,
  arrefecimento: `
    <rect x="-160" y="-190" width="320" height="380" rx="20" fill="#fff" />
    ${Array.from({ length: 8 })
      .map((_, i) => `<line x1="${-140 + i * 40}" y1="-170" x2="${-140 + i * 40}" y2="170" stroke-width="8" />`)
      .join("")}
    <rect x="-180" y="-210" width="360" height="30" rx="10" fill="${BRAND_500}" stroke="none" />
    <rect x="-180" y="180" width="360" height="30" rx="10" fill="${BRAND_500}" stroke="none" />
  `,
  rodagem: `
    <path d="M -200 40 a 200 90 0 0 1 400 0" fill="none" />
    <path d="M -200 40 a 200 90 0 0 0 400 0" fill="none" />
    ${[-190, -135, -80, -25, 30, 85, 140, 190]
      .map((x) => `<circle cx="${x}" cy="${Math.abs(x) > 150 ? 40 : x % 2 === 0 ? 128 : -48}" r="26" fill="${BRAND_500}" stroke="${INK_800}" />`)
      .join("")}
  `,
  pneus: `
    <circle cx="0" cy="0" r="190" fill="${INK_800}" stroke="none" />
    <circle cx="0" cy="0" r="190" />
    <circle cx="0" cy="0" r="95" fill="#fff" stroke="${INK_800}" />
    <circle cx="0" cy="0" r="34" fill="${BRAND_500}" stroke="${INK_800}" />
    ${Array.from({ length: 8 })
      .map((_, i) => {
        const a = (Math.PI * i) / 4;
        return `<line x1="${95 * Math.cos(a)}" y1="${95 * Math.sin(a)}" x2="${190 * Math.cos(a)}" y2="${190 * Math.sin(a)}" stroke="#fff" stroke-width="14" />`;
      })
      .join("")}
  `,
  ferramentas: `
    <path d="M -170 -170 a 60 60 0 1 0 40 40 L 40 -50 a 60 60 0 1 0 40 40 L -30 130 -130 30 Z" fill="${BRAND_500}" stroke="${INK_800}" />
    <rect x="-30" y="30" width="200" height="46" rx="10" transform="rotate(45 -30 30)" fill="#fff" />
  `,
  lubrificantes: `
    <path d="M -70 -190 h140 l20 60 v300 a20 20 0 0 1 -20 20 h-140 a20 20 0 0 1 -20 -20 v-300 Z" fill="#fff" />
    <rect x="-90" y="-10" width="180" height="90" fill="${BRAND_500}" stroke="none" />
    <rect x="-40" y="-230" width="80" height="50" rx="8" fill="${INK_800}" stroke="none" />
  `,
  carroceria: `
    <path d="M -190 60 q 0 -140 190 -140 q 190 0 190 140 v40 h-380 Z" fill="#fff" />
    <path d="M -110 -60 q 40 -40 110 -40 q 70 0 110 40" fill="none" />
    <rect x="-190" y="100" width="380" height="30" rx="10" fill="${BRAND_500}" stroke="none" />
    <circle cx="-110" cy="130" r="34" fill="${INK_800}" stroke="none" />
    <circle cx="110" cy="130" r="34" fill="${INK_800}" stroke="none" />
  `,
};

const meta = {
  motor: { bgFrom: "#fff1e6" },
  hidraulica: { bgFrom: "#eef4ff" },
  transmissao: { bgFrom: "#fff1e6" },
  eletrica: { bgFrom: "#fff8e1" },
  filtros: { bgFrom: "#eefbf1" },
  travoes: { bgFrom: "#fdeeee" },
  arrefecimento: { bgFrom: "#eafcff" },
  rodagem: { bgFrom: "#f3f1ff" },
  pneus: { bgFrom: "#f2f2f2" },
  ferramentas: { bgFrom: "#fff1e6" },
  lubrificantes: { bgFrom: "#fdf6e3" },
  carroceria: { bgFrom: "#eef4ff" },
};

mkdirSync(path.join(root, "categories"), { recursive: true });

for (const [key, inner] of Object.entries(icons)) {
  const svg = wrap(inner, { id: key, ...meta[key] });
  writeFileSync(path.join(root, "categories", `${key}.svg`), svg, "utf8");
}

// ---------------------------------------------------------------------------
// Hero + promo banners
// ---------------------------------------------------------------------------

function heroBanner({ id, from, to, cogColor = "rgba(255,255,255,0.08)" }) {
  const cogs = Array.from({ length: 3 })
    .map((_, i) => {
      const cx = 260 + i * 480;
      const cy = i % 2 === 0 ? 180 : 620;
      const r = 160 + (i % 2) * 60;
      return `<g transform="translate(${cx} ${cy})">${gearOutline(r, cogColor)}</g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800">
  <defs>
    <linearGradient id="hero-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="1600" height="800" fill="url(#hero-${id})" />
  ${cogs}
</svg>`;
}

function gearOutline(r, color) {
  const teeth = 12;
  const toothLen = r * 0.18;
  const rInner = r * 0.62;
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI * i) / teeth;
    const rad = i % 2 === 0 ? r + toothLen : r;
    pts.push(`${rad * Math.cos(angle)},${rad * Math.sin(angle)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="18" />
    <circle r="${rInner}" fill="none" stroke="${color}" stroke-width="18" />`;
}

mkdirSync(path.join(root, "hero"), { recursive: true });

writeFileSync(
  path.join(root, "hero", "hero-main.svg"),
  heroBanner({ id: "main", from: INK_900, to: "#1f2b45" }),
  "utf8",
);
writeFileSync(
  path.join(root, "hero", "promo-hidraulica.svg"),
  heroBanner({ id: "promo1", from: BRAND_600, to: BRAND_500, cogColor: "rgba(255,255,255,0.15)" }),
  "utf8",
);
writeFileSync(
  path.join(root, "hero", "promo-filtros.svg"),
  heroBanner({ id: "promo2", from: INK_800, to: INK_900, cogColor: "rgba(242,96,12,0.35)" }),
  "utf8",
);
writeFileSync(
  path.join(root, "hero", "cta-band.svg"),
  heroBanner({ id: "cta", from: "#0c1220", to: INK_800, cogColor: "rgba(242,96,12,0.25)" }),
  "utf8",
);

console.log("Ilustrações geradas em public/images/categories e public/images/hero");
