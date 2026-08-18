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
  EQ_ROW0_TOP,
  EQ_ROW_H,
  EQ_COLS,
  EQ_GRID_COLOR,
  EQ_GRID_V_X,
  EQ_GRID_THICKNESS,
  LB_PAIR1_TOP,
  LB_PAIR1_ROW_H,
  LB_PAIR2_TOP,
  LB_PAIR2_ROW_H,
  LB_PAIR2_RIGHT_TOP,
  LB_PAIR2_RIGHT_ROW_H,
  LB_ROW_BG_PAIR1,
  LB_ROW_BG_PAIR2_LEFT,
  LB_ROW_BG_PAIR2_RIGHT,
  LB_GRID_COLOR,
  LB_GRID_THICKNESS,
  LB_SEPARATOR_COLOR,
  LB_SEPARATOR_THICKNESS,
  LB_ACCENT_X_LEFT,
  LB_ACCENT_X_RIGHT,
  LB_HLINE_LEFT_X1,
  LB_HLINE_RIGHT_X0,
  LB_DIVIDER_X,
  LB_LEFT_X0,
  LB_LABEL_X0_LEFT,
  LB_VALUE_X1_RIGHT,
  LB_TIRE_ROW_H,
  lbRowOffset,
  lbTotalHeight,
  type LbRowHeights,
  EQUIPMENT_TABLES,
  LABOR_TABLES,
  type EquipmentTableConfig,
  type LaborTableConfig,
} from "@/lib/pricing-data";
import { computeRow, fmt2, parseLenient } from "@/lib/pricing-calc";

// A4 landscape in PDF points — the same ratio as the source photos
// (2526×1786 ≈ 841.89×595.28), so each page fills edge to edge with no
// letterboxing or stretch.
const PAGE_W = 841.89;
const PAGE_H = 595.28;
const SX = PAGE_W / IMG_W;
const SY = PAGE_H / IMG_H;
const INK = rgb(28 / 255, 28 / 255, 28 / 255);
const MZN_INK = rgb(122 / 255, 74 / 255, 31 / 255);
const BASE_SIZE = 14.5;
const MIN_SIZE = 6;

function toPdfRect(r: BoxRect) {
  const x = r.left * SX;
  const width = r.width * SX;
  const height = r.height * SY;
  const y = PAGE_H - r.top * SY - height;
  return { x, y, width, height };
}

function toPdfPoint(px: number, py: number) {
  return { x: px * SX, y: PAGE_H - py * SY };
}

/** Redraws the printed sheet's thin decorative grid — the group divider
 * rules and column dividers — since the opaque field backgrounds painted
 * over them already. Drawn last, on top of every field on the page. */
function drawEquipmentGrid(page: PDFPage) {
  const color = rgb(EQ_GRID_COLOR[0] / 255, EQ_GRID_COLOR[1] / 255, EQ_GRID_COLOR[2] / 255);
  const tableTop = EQ_ROW0_TOP;
  const tableBottom = EQ_ROW0_TOP + 17 * EQ_ROW_H;
  const left = EQ_COLS[0];
  const right = EQ_COLS[EQ_COLS.length - 1];

  EQ_GRID_V_X.forEach((x) => {
    const start = toPdfPoint(x, tableTop);
    const end = toPdfPoint(x, tableBottom);
    page.drawLine({ start, end, thickness: EQ_GRID_THICKNESS, color });
  });

  EQ_GROUPS.forEach(([start], gi) => {
    if (gi === 0) return; // top edge of the first group is the table's outer border, not a divider
    const y = EQ_ROW0_TOP + start * EQ_ROW_H;
    const s = toPdfPoint(left, y);
    const e = toPdfPoint(right, y);
    page.drawLine({ start: s, end: e, thickness: EQ_GRID_THICKNESS, color });
  });
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

/** The original's two longest labor labels ("Sunday/Holiday Rate (by
 * technician)", "Travel fee within from the city of Beira") wrap onto a
 * second line rather than shrinking — every other label on the sheet is
 * the same size. drawField's single-line shrink-to-fit doesn't replicate
 * that, so long labels came out tiny instead of wrapped. Tries the single
 * line at the table's normal size first; if it doesn't fit, greedily
 * word-wraps into two lines at that same size; only falls back to
 * shrinking if even two lines can't fit the row. */
function drawWrappedLabel(page: PDFPage, font: PDFFont, text: string, rect: BoxRect, bg: RGB, padding = 4) {
  const r = toPdfRect(rect);
  page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(bg[0] / 255, bg[1] / 255, bg[2] / 255) });
  if (!text) return;
  const maxWidth = Math.max(1, r.width - padding * 2);

  if (font.widthOfTextAtSize(text, BASE_SIZE) <= maxWidth) {
    const y = r.y + (r.height - BASE_SIZE) / 2 + BASE_SIZE * 0.21;
    page.drawText(text, { x: r.x + padding, y, size: BASE_SIZE, font, color: INK });
    return;
  }

  const words = text.split(" ");
  if (words.length < 2) {
    const size = fitSize(font, text, maxWidth, BASE_SIZE);
    const y = r.y + (r.height - size) / 2 + size * 0.21;
    page.drawText(text, { x: r.x + padding, y, size, font, color: INK });
    return;
  }

  // Picks whichever split point makes the WIDER of the two lines as narrow
  // as possible — greedily maximizing line1 instead (the usual word-wrap
  // approach) picks badly when one word is much longer than the rest (e.g.
  // "Domingos/Feriados", no space to break on): it strands that word alone
  // with everything else crammed onto line2, forcing a far more aggressive
  // shrink than a balanced split would need.
  let line1 = words[0];
  let line2 = words.slice(1).join(" ");
  let widestLine = Math.max(font.widthOfTextAtSize(line1, BASE_SIZE), font.widthOfTextAtSize(line2, BASE_SIZE));
  for (let i = 2; i < words.length; i++) {
    const candidate1 = words.slice(0, i).join(" ");
    const candidate2 = words.slice(i).join(" ");
    const w = Math.max(font.widthOfTextAtSize(candidate1, BASE_SIZE), font.widthOfTextAtSize(candidate2, BASE_SIZE));
    if (w < widestLine) {
      widestLine = w;
      line1 = candidate1;
      line2 = candidate2;
    }
  }

  const lineMult = 1.02;
  const size = Math.min(BASE_SIZE, (BASE_SIZE * maxWidth) / widestLine);

  if (size * lineMult * 2 > r.height) {
    const fallbackSize = fitSize(font, text, maxWidth, BASE_SIZE);
    const y = r.y + (r.height - fallbackSize) / 2 + fallbackSize * 0.21;
    page.drawText(text, { x: r.x + padding, y, size: fallbackSize, font, color: INK });
    return;
  }

  const lineH = size * lineMult;
  const blockBottom = r.y + (r.height - lineH * 2) / 2;
  page.drawText(line1, { x: r.x + padding, y: blockBottom + lineH + size * 0.21, size, font, color: INK });
  page.drawText(line2, { x: r.x + padding, y: blockBottom + size * 0.21, size, font, color: INK });
}

/** The Total cell doubles as the câmbio conversion display: once an admin
 * fills in the shared USD→MZN rate, the on-screen editor shows a second,
 * smaller "≈ X MZN" line under the total (see .ov-total-cell / .mzn in
 * pricing.css) — this mirrors that exact two-line layout in the PDF so the
 * export shows the same thing the editor does, not just the USD total. */
function drawTotalField(page: PDFPage, font: PDFFont, totalText: string, mznText: string | null, rect: BoxRect, bg: RGB, padding = 4) {
  const r = toPdfRect(rect);
  page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(bg[0] / 255, bg[1] / 255, bg[2] / 255) });
  const maxWidth = Math.max(1, r.width - padding * 2);

  if (!mznText) {
    if (!totalText) return;
    const size = fitSize(font, totalText, maxWidth, BASE_SIZE);
    const textWidth = font.widthOfTextAtSize(totalText, size);
    const x = r.x + (r.width - textWidth) / 2;
    const y = r.y + (r.height - size) / 2 + size * 0.21;
    page.drawText(totalText, { x, y, size, font, color: INK });
    return;
  }

  let totalSize = fitSize(font, totalText, maxWidth, BASE_SIZE);
  let mznSize = fitSize(font, mznText, maxWidth, totalSize * 0.78);
  const lineMult = 1.15;
  const vPad = 2;
  while (totalSize > MIN_SIZE && (totalSize * lineMult + mznSize * lineMult) > r.height - vPad) {
    totalSize -= 0.5;
    mznSize = fitSize(font, mznText, maxWidth, totalSize * 0.78);
  }

  const totalWidth = font.widthOfTextAtSize(totalText, totalSize);
  const mznWidth = font.widthOfTextAtSize(mznText, mznSize);
  const mznLineH = mznSize * lineMult;

  const blockBottom = r.y + (r.height - (totalSize * lineMult + mznLineH)) / 2;
  const mznY = blockBottom + mznSize * 0.21;
  const totalY = blockBottom + mznLineH + totalSize * 0.21;

  page.drawText(totalText, { x: r.x + (r.width - totalWidth) / 2, y: totalY, size: totalSize, font, color: INK });
  page.drawText(mznText, { x: r.x + (r.width - mznWidth) / 2, y: mznY, size: mznSize, font, color: MZN_INK });
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
  sharedFx: string,
) {
  const prefix = config.prefix;
  const dieselChanged = sharedDiesel !== sharedDieselOrig;
  const fx = parseLenient(sharedFx);

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

    const { com, total, totalNum } = computeRow({
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
    // "≈" isn't in WinAnsi (StandardFonts.Helvetica's encoding) — pdf-lib
    // throws trying to embed it, unlike the on-screen editor which can show
    // the real glyph in any browser font. "~" is the closest WinAnsi has.
    const mznText = fx > 0 ? `~ ${fmt2(totalNum * fx)} MZN` : null;
    drawTotalField(page, font, `${total} USD`, mznText, eqBoxRect(i, 1, 6), bg);
  });

  drawEquipmentGrid(page);
}

/** Redraws the labor blocks' second, subtler layer of decorative structure
 * that the opaque field backgrounds erase: the outer content-margin accent
 * rule, the label/value divider, and the white row separators — distinct
 * from LB_DIVIDER_L/R (the thick bar between the two half-page columns),
 * which nothing paints over and so needs no redrawing. */
function drawLaborGrid(page: PDFPage, top0: number, rowH: LbRowHeights, rowCount: number, col: "left" | "right", dividerX: number) {
  const gridColor = rgb(LB_GRID_COLOR[0] / 255, LB_GRID_COLOR[1] / 255, LB_GRID_COLOR[2] / 255);
  const sepColor = rgb(LB_SEPARATOR_COLOR[0] / 255, LB_SEPARATOR_COLOR[1] / 255, LB_SEPARATOR_COLOR[2] / 255);
  const accentX = col === "left" ? LB_ACCENT_X_LEFT : LB_ACCENT_X_RIGHT;
  const hlineX0 = col === "left" ? accentX : LB_HLINE_RIGHT_X0;
  const hlineX1 = col === "left" ? LB_HLINE_LEFT_X1 : accentX;
  const top = top0;
  const bottom = top0 + lbTotalHeight(rowH, rowCount);

  for (const x of [accentX, dividerX]) {
    const start = toPdfPoint(x, top);
    const end = toPdfPoint(x, bottom);
    page.drawLine({ start, end, thickness: LB_GRID_THICKNESS, color: gridColor });
  }

  for (let i = 1; i < rowCount; i++) {
    const y = top0 + lbRowOffset(rowH, i);
    const start = toPdfPoint(hlineX0, y);
    const end = toPdfPoint(hlineX1, y);
    page.drawLine({ start, end, thickness: LB_SEPARATOR_THICKNESS, color: sepColor });
  }
}

function drawLaborPage(page: PDFPage, config: LaborTableConfig, overrides: Record<string, string>, font: PDFFont) {
  const prefix = config.prefix;

  function block(
    name: "labor" | "tire" | "extra" | "forklift",
    top0: number,
    rowH: LbRowHeights,
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

      const lblFullRect: BoxRect = { ...rect, width: rect.width * 0.6 };
      const valFullRect: BoxRect = { ...rect, left: rect.left + rect.width * 0.6, width: rect.width * 0.4 };
      drawField(page, font, "", lblFullRect, "left", bg); // background only, full width
      drawField(page, font, "", valFullRect, "right", bg); // background only, full width

      // Text itself is boxed to the TRUE divider position (LB_DIVIDER_X,
      // measured against the source photo) rather than the naive 60/40
      // split above — that split only ever existed to size the background
      // fill and editable-field hit areas, and doesn't match where the
      // original photo's divider line actually sits. The outer edge (label
      // on the left side, value on the right) is boxed to the accent-line
      // gutter for the same reason: erasing the redrawn grid with overlap.
      const gap = 20;
      const dividerX = LB_DIVIDER_X[name];
      const lblTextRect: BoxRect =
        col === "left"
          ? { ...lblFullRect, left: LB_LABEL_X0_LEFT, width: dividerX - gap - LB_LABEL_X0_LEFT }
          : { ...lblFullRect, width: dividerX - gap - rect.left };
      const valTextRect: BoxRect =
        col === "left"
          ? { ...valFullRect, left: dividerX + gap, width: rect.left + rect.width - (dividerX + gap) }
          : { ...valFullRect, left: dividerX + gap, width: LB_VALUE_X1_RIGHT - (dividerX + gap) };
      drawWrappedLabel(page, font, lblVal, lblTextRect, bg);
      drawField(page, font, `${valVal} ${config.unit}`, valTextRect, "right", bg);
    });
    drawLaborGrid(page, top0, rowH, config.blocks[name].length, col, LB_DIVIDER_X[name]);
  }

  block("labor", LB_PAIR1_TOP, LB_PAIR1_ROW_H, "left", LB_ROW_BG_PAIR1);
  // Tire has its own per-row heights (see LB_TIRE_ROW_H) — its rows aren't
  // uniform like the rest of the table.
  block("tire", LB_PAIR1_TOP, LB_TIRE_ROW_H, "right", LB_ROW_BG_PAIR1);
  block("extra", LB_PAIR2_TOP, LB_PAIR2_ROW_H, "left", LB_ROW_BG_PAIR2_LEFT);
  block("forklift", LB_PAIR2_RIGHT_TOP, LB_PAIR2_RIGHT_ROW_H, "right", LB_ROW_BG_PAIR2_RIGHT);
}

export async function generatePricingPdf(
  overrides: Record<string, string>,
  sharedDiesel: string,
  sharedDieselOrig: string,
  sharedFx: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const config of EQUIPMENT_TABLES) {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const img = await loadImage(pdfDoc, config.bgImage);
    page.drawImage(img, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    drawEquipmentPage(pdfDoc, page, config, overrides, font, sharedDiesel, sharedDieselOrig, sharedFx);
  }

  for (const config of LABOR_TABLES) {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const img = await loadImage(pdfDoc, config.bgImage);
    page.drawImage(img, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
    drawLaborPage(page, config, overrides, font);
  }

  return pdfDoc.save();
}
