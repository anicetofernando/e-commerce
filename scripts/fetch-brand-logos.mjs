import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "brands");
await mkdir(outDir, { recursive: true });

const UA = "AlbimaqPecasBot/1.0 (https://albimaq-pecas.vercel.app; vendas@albimaq.co.mz) node-fetch";
const COMMONS = "https://commons.wikimedia.org/w/api.php";

const BRANDS = [
  { slug: "caterpillar", search: "Caterpillar Inc logo", match: (t) => t.includes("caterpillar") },
  { slug: "komatsu", search: "Komatsu Limited logo", match: (t) => t.includes("komatsu") },
  { slug: "volvo-ce", search: "Volvo logo", match: (t) => t.includes("volvo") },
  { slug: "jcb", search: "JCB excavator logo", match: (t) => t.includes("jcb") },
  {
    slug: "case-ce",
    search: "Case Construction Equipment logo",
    match: (t) => t.includes("case construction") || t.includes("case ih") || t.includes("case_construction"),
  },
  { slug: "new-holland-ce", search: "New Holland Agriculture logo", match: (t) => t.includes("new holland") },
  { slug: "bobcat", search: "Bobcat logo", match: (t) => t.includes("bobcat") },
  {
    slug: "hyundai-ce",
    search: "Hyundai Construction Equipment logo",
    match: (t) => t.includes("hyundai"),
  },
  { slug: "doosan", search: "Doosan logo", match: (t) => t.includes("doosan") },
  {
    slug: "hitachi",
    search: "Hitachi logo",
    match: (t) => t.includes("hitachi"),
  },
  { slug: "liebherr", search: "Liebherr logo", match: (t) => t.includes("liebherr") },
  {
    slug: "john-deere",
    search: "John Deere logo",
    match: (t) => t.includes("john deere") || t.includes("john_deere") || t.includes("deere & company") || t.includes("deere and company"),
  },
];

function extRank(title) {
  const t = title.toLowerCase();
  if (t.endsWith(".svg")) return 0;
  if (t.endsWith(".png")) return 1;
  if (t.endsWith(".webp")) return 2;
  if (t.endsWith(".jpg") || t.endsWith(".jpeg")) return 3;
  return 4;
}

async function commonsSearch(query) {
  const url = `${COMMONS}?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(
    query,
  )}&format=json&srlimit=15`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  return (json?.query?.search ?? []).map((r) => r.title);
}

async function imageInfo(title) {
  const url = `${COMMONS}?action=query&titles=${encodeURIComponent(
    title,
  )}&prop=imageinfo&iiprop=url|mime|size&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  const pages = json?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0] ?? null;
}

const FORCE = process.argv.includes("--force");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]?.split(",");

const results = [];

for (const b of BRANDS) {
  if (ONLY && !ONLY.includes(b.slug)) continue;
  const outPathCheck = path.join(outDir, `${b.slug}.png`);
  if (!FORCE) {
    const { existsSync } = await import("node:fs");
    if (existsSync(outPathCheck)) {
      console.log(`[${b.slug}] skip (already exists)`);
      continue;
    }
  }
  try {
    const titles = await commonsSearch(b.search);
    const vectorOrRaster = titles.filter((t) => /\.(svg|png)$/i.test(t));
    const withLogo = vectorOrRaster.filter((t) => t.toLowerCase().includes("logo"));
    const pool = withLogo.filter((t) => b.match(t.toLowerCase()));

    pool.sort((a, b2) => extRank(a) - extRank(b2));

    let chosen = null;
    let info = null;
    for (const title of pool.slice(0, 6)) {
      const candidateInfo = await imageInfo(title);
      if (candidateInfo?.url) {
        chosen = title;
        info = candidateInfo;
        break;
      }
    }

    if (!chosen) {
      console.log(`[${b.slug}] NO CANDIDATE. raw titles: ${titles.slice(0, 8).join(" | ")}`);
      results.push({ ...b, ok: false, reason: "no-candidate", rawTitles: titles.slice(0, 8) });
      continue;
    }

    const imgRes = await fetch(info.url, { headers: { "User-Agent": UA } });
    if (!imgRes.ok) {
      console.log(`[${b.slug}] download failed ${info.url}: ${imgRes.status}`);
      results.push({ ...b, ok: false, reason: `download-${imgRes.status}`, chosen, url: info.url });
      continue;
    }
    const buf = Buffer.from(await imgRes.arrayBuffer());

    const outPath = path.join(outDir, `${b.slug}.png`);
    await sharp(buf, { density: 384 })
      .resize({ width: 480, height: 240, fit: "inside", withoutEnlargement: false })
      .flatten({ background: "#ffffff" })
      .extend({ top: 20, bottom: 20, left: 20, right: 20, background: "#ffffff" })
      .png({ quality: 92 })
      .toFile(outPath);

    console.log(`[${b.slug}] OK  chosen="${chosen}"  url=${info.url}`);
    results.push({ ...b, ok: true, chosen, url: info.url, mime: info.mime });
  } catch (err) {
    console.log(`[${b.slug}] ERROR ${err.message}`);
    results.push({ ...b, ok: false, reason: String(err.message) });
  }
}

await writeFile(path.join(outDir, "_sources.json"), JSON.stringify(results, null, 2));
console.log("\nDone. Summary:");
for (const r of results) {
  console.log(`  ${r.ok ? "OK  " : "FAIL"} ${r.slug}${r.chosen ? `  <- ${r.chosen}` : ""}`);
}
