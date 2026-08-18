import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import {
  IMG_W,
  IMG_H,
  eqBoxRect,
  lbBoxRect,
  type BoxRect,
  type RGB,
  EQ_GROUPS,
  EQ_NODIESEL,
  EQ_SERVICE_MERGE,
  EQ_ROW_BG,
  LB_PAIR1_TOP,
  LB_PAIR1_ROW_H,
  LB_PAIR2_TOP,
  LB_PAIR2_ROW_H,
  LB_PAIR2_RIGHT_TOP,
  LB_PAIR2_RIGHT_ROW_H,
  LB_ROW_BG_PAIR1,
  LB_ROW_BG_PAIR2_LEFT,
  LB_ROW_BG_PAIR2_RIGHT,
  EQUIPMENT_TABLES,
  LABOR_TABLES,
  type EquipmentTableConfig,
  type LaborTableConfig,
} from "@/lib/pricing-data";
import { computeRow, parseLenient } from "@/lib/pricing-calc";

// A4 landscape in PDF points — the same ratio as the source photos
// (2526×1786 ≈ 841.89×595.28), so each page fills edge to edge with no
// letterboxing or stretch.
const PAGE_W = 841.89;
const PAGE_H = 595.28;
const SX = PAGE_W / IMG_W;
const SY = PAGE_H / IMG_H;
const INK = rgb(28 / 255, 28 / 255, 28 / 255);
const BASE_SIZE = 14.5;
const MIN_SIZE = 6;

function toPdfRect(r: BoxRect) {
  const x = r.left * SX;
  const width = r.width * SX;
  const height = r.height * SY;
  const y = PAGE_H - r.top * SY - height;
  return { x, y, width, height };
}

/** Shrink font size until `text` fits `maxWidth`, never below MIN_SIZE — the
 * PDF equivalent of the on-screen editor's live overflow-fit. */
function fitSize(font: PDFFont, text: string, maxWidth: number, startSize: number): number {
  let size = startSize;
  while (size > MIN_SIZE && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

/** The source photo already has this exact spot printed on it — a field
 * that's merely re-drawn without first covering the original would show
 * both at once (the bug this project has already chased down twice for the
 * on-screen overlay and the browser print path). Always paint the matching
 * cell color underneath before drawing text. */
function drawField(
  page: PDFPage,
  font: PDFFont,
  text: string,
  rect: BoxRect,
  align: "left" | "center" | "right",
  bg: RGB,
  padding = 4,
) {
  const r = toPdfRect(rect);
  page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(bg[0] / 255, bg[1] / 255, bg[2] / 255) });
  if (!text) return;
  const maxWidth = Math.max(1, r.width - padding * 2);
  const size = fitSize(font, text, maxWidth, BASE_SIZE);
  const textWidth = font.widthOfTextAtSize(text, size);
  let x: number;
  if (align === "left") x = r.x + padding;
  else if (align === "right") x = r.x + r.width - padding - textWidth;
  else x = r.x + (r.width - textWidth) / 2;
  const y = r.y + (r.height - size) / 2 + size * 0.21;
  page.drawText(text, { x, y, size, font, color: INK });
}

async function loadImage(pdfDoc: PDFDocument, bgImage: string) {
  const filePath = path.join(process.cwd(), "public", bgImage);
  const bytes = await readFile(filePath);
  return pdfDoc.embedJpg(bytes);
}

function drawEquipmentPage(
  pdfDoc: PDFDocument,
  page: PDFPage,
  config: EquipmentTableConfig,
  overrides: Record<string, string>,
  font: PDFFont,
  sharedDiesel: string,
  sharedDieselOrig: string,
) {
  const prefix = config.prefix;
  const dieselChanged = sharedDiesel !== sharedDieselOrig;

  const groupOf = new Map<number, { gi: number; start: number; span: number }>();
  EQ_GROUPS.forEach(([start, span], gi) => {
    for (let r = start; r < start + span; r++) groupOf.set(r, { gi, start, span });
  });

  config.rows.forEach((row, i) => {
    const g = groupOf.get(i)!;
    const hoursId = `${prefix}-h${g.gi + 1}`;
    const noDiesel = EQ_NODIESEL.has(i);
    const groupStart = i === g.start;
    const unLabelOrig = config.unLabels[g.gi];
    const hoursOrig = unLabelOrig === "Day" || unLabelOrig === "Dia" ? "1" : "8";
    const bg = EQ_ROW_BG[i];

    const equipKey = `${prefix}-r${i}-equip`;
    drawField(page, font, overrides[equipKey] ?? row.equip, eqBoxRect(i, 1, 0), "left", bg);

    if (i in EQ_SERVICE_MERGE) {
      const span = EQ_SERVICE_MERGE[i];
      const serviceKey = `${prefix}-r${i}-service`;
      drawField(page, font, overrides[serviceKey] ?? (row.service ?? ""), eqBoxRect(i, span, 1), "left", bg);
    } else if (row.service !== null) {
      const serviceKey = `${prefix}-r${i}-service`;
      drawField(page, font, overrides[serviceKey] ?? row.service, eqBoxRect(i, 1, 1), "left", bg);
    }

    if (groupStart) {
      const unKey = `${hoursId}-un`;
      drawField(page, font, overrides[unKey] ?? unLabelOrig, eqBoxRect(g.start, g.span, 2), "center", bg);
      const hoursKey = `${hoursId}-hours`;
      drawField(page, font, overrides[hoursKey] ?? hoursOrig, eqBoxRect(g.start, g.span, 3), "center", bg);
    }

    const semKey = `${prefix}-r${i}-sem`;
    const semVal = overrides[semKey] ?? row.sem;
    const hoursValForCalc = overrides[`${hoursId}-hours`] ?? hoursOrig;
    const hoursChanged = hoursValForCalc !== hoursOrig;

    const { com, total } = computeRow({
      sem: semVal,
      semOrig: row.sem,
      comOrig: row.com,
      totalOrig: row.total,
      hours: hoursValForCalc,
      hoursOrig,
      dieselPct: parseLenient(sharedDiesel),
      dieselChanged,
      hoursChanged,
      noDiesel,
    });

    drawField(page, font, `${semVal} USD`, eqBoxRect(i, 1, 4), "center", bg);
    if (noDiesel) {
      drawField(page, font, row.com === null ? "" : `${row.com} USD`, eqBoxRect(i, 1, 5), "center", bg);
    } else {
      drawField(page, font, `${com} USD`, eqBoxRect(i, 1, 5), "center", bg);
    }
    drawField(page, font, `${total} USD`, eqBoxRect(i, 1, 6), "center", bg);
  });
}

function drawLaborPage(page: PDFPage, config: LaborTableConfig, overrides: Record<string, string>, font: PDFFont) {
  const prefix = config.prefix;

  function block(
    name: "labor" | "tire" | "extra" | "forklift",
    top0: number,
    rowH: number,
    col: "left" | "right",
    bgList: RGB | RGB[],
  ) {
    config.blocks[name].forEach((item, i) => {
      const bg: RGB = typeof bgList[0] === "number" ? (bgList as RGB) : (bgList as RGB[])[i];
      const rect = lbBoxRect(top0, rowH, i, col);
      const lblKey = `${prefix}-${name}-${i}-lbl`;
      const valKey = `${prefix}-${name}-${i}-val`;
      const lblVal = overrides[lblKey] ?? item.label;
      const valVal = overrides[valKey] ?? item.value;

      const lblRect: BoxRect = { ...rect, width: rect.width * 0.6 };
      const valRect: BoxRect = { ...rect, left: rect.left + rect.width * 0.6, width: rect.width * 0.4 };
      drawField(page, font, lblVal, lblRect, "left", bg);
      drawField(page, font, `${valVal} ${config.unit}`, valRect, "right", bg);
    });
  }

  block("labor", LB_PAIR1_TOP, LB_PAIR1_ROW_H, "left", LB_ROW_BG_PAIR1);
  block("tire", LB_PAIR1_TOP, LB_PAIR1_ROW_H, "right", LB_ROW_BG_PAIR1);
  block("extra", LB_PAIR2_TOP, LB_PAIR2_ROW_H, "left", LB_ROW_BG_PAIR2_LEFT);
  block("forklift", LB_PAIR2_RIGHT_TOP, LB_PAIR2_RIGHT_ROW_H, "right", LB_ROW_BG_PAIR2_RIGHT);
}

export async function generatePricingPdf(
  overrides: Record<string, string>,
  sharedDiesel: string,
  sharedDieselOrig: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const config of EQUIPMENT_TABLES) {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const img = await loadImage(pdfDoc, config.bgImage);
    page.drawImage(img, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    drawEquipmentPage(pdfDoc, page, config, overrides, font, sharedDiesel, sharedDieselOrig);
  }

  for (const config of LABOR_TABLES) {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const img = await loadImage(pdfDoc, config.bgImage);
    page.drawImage(img, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    drawLaborPage(page, config, overrides, font);
  }

  return pdfDoc.save();
}
