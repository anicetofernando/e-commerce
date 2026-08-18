// Row content and pixel geometry for the ALBIMAQ equipment-rental / labor-
// services price sheet, measured against the source PDF pages rendered at
// 2526×1786px. Positions are turned into percentages at render time so the
// overlay stays aligned with the background photo at any screen width.

export const IMG_W = 2526;
export const IMG_H = 1786;

export function pct(v: number, total: number): number {
  return Math.round((v / total) * 100000) / 1000;
}

export type BoxRect = { left: number; top: number; width: number; height: number };

/** Pure pixel-space geometry (2526×1786 reference) for one equipment cell —
 * shared by the on-screen overlay (converted to %) and the PDF export
 * (converted to points), so the two can never drift apart. */
export function eqBoxRect(rowStart: number, rowSpan: number, colIdx: number): BoxRect {
  const top = EQ_ROW0_TOP + rowStart * EQ_ROW_H;
  const height = EQ_ROW_H * rowSpan;
  const left = EQ_COLS[colIdx];
  const width = EQ_COLS[colIdx + 1] - EQ_COLS[colIdx];
  return { left, top, width, height };
}

// A constant per-row height for most labor blocks, or an explicit array
// for the ones whose rows genuinely aren't uniform in the source photo
// (the tire block: 3 taller rows, then 7 shorter ones — see LB_TIRE_ROW_H).
export type LbRowHeights = number | number[];

export function lbRowOffset(rowH: LbRowHeights, rowIdx: number): number {
  if (typeof rowH === "number") return rowIdx * rowH;
  let sum = 0;
  for (let i = 0; i < rowIdx; i++) sum += rowH[i];
  return sum;
}

export function lbRowHeight(rowH: LbRowHeights, rowIdx: number): number {
  return typeof rowH === "number" ? rowH : rowH[rowIdx];
}

export function lbTotalHeight(rowH: LbRowHeights, rowCount: number): number {
  return typeof rowH === "number" ? rowH * rowCount : rowH.reduce((a, b) => a + b, 0);
}

/** Same idea for one labor-table row (either column of either pair). */
export function lbBoxRect(top0: number, rowH: LbRowHeights, rowIdx: number, col: "left" | "right"): BoxRect {
  const top = top0 + lbRowOffset(rowH, rowIdx);
  const height = lbRowHeight(rowH, rowIdx);
  const [left, width] = col === "left" ? [LB_LEFT_X0, LB_LEFT_X1 - LB_LEFT_X0] : [LB_RIGHT_X0, LB_RIGHT_X1 - LB_RIGHT_X0];
  return { left, top, width, height };
}

export type RGB = [number, number, number];
export function rgb([r, g, b]: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}`;
}

// ================= EQUIPMENT TABLE GEOMETRY =================
export const EQ_ROW0_TOP = 478.0;
export const EQ_ROW_H = (1506.0 - 478.0) / 17;
// 8 boundaries -> 7 columns: equip, service, un, hours, sem, com, total
export const EQ_COLS = [30, 595, 988, 1135, 1331, 1712, 2093, 2486];

// The printed sheet has thin decorative divider lines (grid) that the opaque
// per-field background rectangles necessarily paint over — these are redrawn
// on top afterward so the exported PDF matches the original pixel-for-pixel.
// Values pixel-measured directly from the source photo (native 2526×1786).
export const EQ_GRID_COLOR: RGB = [204, 118, 57];
export const EQ_GRID_V_X = [604, 1011, 1111, 1288, 1659, 2038];
// Measured ~2-3px at native 2526px width; scaled to the 841.89pt PDF page
// that's under 1pt (2526/841.89 ≈ 3× — a 2.2pt line was roughly 3× too bold).
export const EQ_GRID_THICKNESS = 0.75;

export const EQ_ROW_BG: RGB[] = [
  [226, 226, 226], [230, 230, 230], [230, 230, 230], [230, 230, 230],
  [230, 229, 227], [230, 229, 225], [228, 224, 221], [230, 225, 222],
  [231, 223, 220], [228, 220, 217], [227, 218, 211], [227, 210, 201],
  [228, 213, 203], [224, 211, 196], [220, 201, 186], [224, 200, 181],
  [224, 197, 177],
];

export type EquipmentRow = {
  equip: string;
  /** null = this row's service cell is merged into the previous row's */
  service: string | null;
  sem: string;
  /** null = no "with diesel" figure printed for this row (blank cell) */
  com: string | null;
  total: string;
};

export const EQ_ROWS_EN: EquipmentRow[] = [
  { equip: "2 X Forklift 2,5 Ton", service: "Sulfur", sem: "28,75", com: "37,37", total: "230,00" },
  { equip: "8 X Forklift 3 Ton", service: "Fertilizer", sem: "28,75", com: "37,37", total: "230,00" },
  { equip: "1 X Forklift 4 Ton", service: "Copper", sem: "31,63", com: "41,12", total: "253,00" },
  { equip: "1 X Forklift 4,5 Ton", service: null, sem: "34,50", com: "44,85", total: "276,00" },
  { equip: "Front Loadt CAT950G", service: "Sulfur", sem: "75,00", com: "97,50", total: "600,00" },
  { equip: "Front Loadt CAT950G", service: "Fertilizer", sem: "55,00", com: "71,50", total: "440,00" },
  { equip: "2 X Manitou Mt1435", service: "Sulfur", sem: "65,00", com: "84,50", total: "520,00" },
  { equip: "2 X Manitou Mt1435", service: "Chromium", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Fertilizer", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Man Basket", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Clamps for Drums", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "Mini Loader BOBCAT S175/S185", service: "Chromium Iron", sem: "34,80", com: "45,24", total: "278,40" },
  { equip: "Mini Loader BOBCAT S175/S185", service: "Other aggregates", sem: "32,48", com: "42,22", total: "259,84" },
  { equip: "Mini Loader BOBCAT S175/S185", service: "Mechanical sweeper", sem: "62,06", com: "80,67", total: "496,48" },
  { equip: "Ramps Containers", service: "", sem: "6,00", com: "-", total: "6,00" },
  { equip: "COMPRESSOR AIR (8Bars)", service: "", sem: "29,00", com: "37,70", total: "232,00" },
  { equip: "HAMMERS BREAKERS", service: "", sem: "7,25", com: null, total: "58,00" },
];
export const EQ_UN_EN = ["Hour", "Hour", "Hour", "Hour", "Day", "Hour"];

export const EQ_ROWS_PT: EquipmentRow[] = [
  { equip: "2 X Empilhadeira 2,5 Toneladas", service: "Enxofre", sem: "28,75", com: "37,37", total: "230,00" },
  { equip: "8 X Empilhadeira 3 Toneladas", service: "Fertilizante", sem: "28,75", com: "37,37", total: "230,00" },
  { equip: "1 X Empilhadeira 4 Toneladas", service: "Cobre", sem: "31,63", com: "41,12", total: "253,00" },
  { equip: "1 X Empilhadeira 4,5 Toneladas", service: null, sem: "34,50", com: "44,85", total: "276,00" },
  { equip: "Pá Mecânica CAT950G", service: "Enxofre", sem: "75,00", com: "97,50", total: "600,00" },
  { equip: "Pá Mecânica CAT950G", service: "Fertilizante", sem: "55,00", com: "71,50", total: "440,00" },
  { equip: "2 X Manitou Mt1435", service: "Enxofre", sem: "65,00", com: "84,50", total: "520,00" },
  { equip: "2 X Manitou Mt1435", service: "Cromo", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Fertilizante", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Cesta de Homem", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "2 X Manitou Mt1435", service: "Braçadeiras Tambores", sem: "52,20", com: "67,86", total: "417,60" },
  { equip: "BOBCAT S175/S185", service: "Ferro Cromo", sem: "34,80", com: "45,24", total: "278,40" },
  { equip: "BOBCAT S175/S185", service: "Outros agregados", sem: "32,48", com: "42,22", total: "259,84" },
  { equip: "BOBCAT S175/S185", service: "Vassoura Mecânica", sem: "62,06", com: "80,67", total: "496,48" },
  { equip: "Rampas de Contentor", service: "", sem: "6,00", com: "-", total: "6,00" },
  { equip: "COMPRESSOR DE AIR (8Bars)", service: "", sem: "29,00", com: "37,70", total: "232,00" },
  { equip: "MARTELOS DEMOLIDORES", service: "", sem: "7,25", com: null, total: "58,00" },
];
export const EQ_UN_PT = ["Hora", "Hora", "Hora", "Hora", "Dia", "Hora"];

/** [rowStart, rowSpan] for each Un/Min-Hour-Day merged group */
export const EQ_GROUPS: [number, number][] = [[0, 4], [4, 2], [6, 5], [11, 3], [14, 1], [15, 2]];
/** row indices with no "with diesel" recalculation (Ramps, Hammers) */
export const EQ_NODIESEL = new Set([14, 16]);
/** row index -> how many rows its Service cell spans (Copper) */
export const EQ_SERVICE_MERGE: Record<number, number> = { 2: 2 };

// ================= LABOR TABLE GEOMETRY =================
export const LB_DIVIDER_L = 1152;
export const LB_DIVIDER_R = 1168;
export const LB_LEFT_X0 = 58;
export const LB_LEFT_X1 = LB_DIVIDER_L;
export const LB_RIGHT_X0 = LB_DIVIDER_R;
export const LB_RIGHT_X1 = 2468;
// Top of row 0 and row-to-row spacing, measured directly against the source
// image (not derived from the header bar position — the two didn't share a
// fixed offset, which is why the boxes used to sit almost a full row too
// high). Pair 2's labels wrap to two lines, so its rows are taller.
export const LB_PAIR1_TOP = 564.0;
export const LB_PAIR1_ROW_H = 59.0;
// The tire block's 10 rows are NOT uniform height like the rest of the
// table (measured against the source photo): the first 3 are taller
// (~61px) than the remaining 7 (~46.5px). Using LB_PAIR1_ROW_H uniformly
// here overshoots the block's true bottom edge by ~20px, painting the row
// background into the blank margin before the next yellow header — visible
// as a mismatched color band touching it.
export const LB_TIRE_ROW_H: number[] = [60, 61.5, 61, 46.5, 46, 46.5, 47.5, 46, 46, 47];
export const LB_PAIR2_TOP = 1359.0;
export const LB_PAIR2_ROW_H = 98.0;
// Forklift Mobilization (pair 2's right column) isn't vertically synced with
// Extra Service Fees on the left — the source layout starts it noticeably
// higher, with slightly taller rows. Measured separately.
export const LB_PAIR2_RIGHT_TOP = 1328.0;
export const LB_PAIR2_RIGHT_ROW_H = 108.0;

export const LB_ROW_BG_PAIR1: RGB = [230, 230, 230];
export const LB_ROW_BG_PAIR2_LEFT: RGB[] = [[230, 209, 192], [226, 197, 179]];
export const LB_ROW_BG_PAIR2_RIGHT: RGB[] = [[234, 201, 184], [231, 196, 176]];

// A second, subtler layer of decorative structure on top of the row
// backgrounds — same problem as the equipment grid (the opaque field
// backgrounds paint over it), measured the same way: pixel-sampled directly
// against the source photo. Distinct from LB_DIVIDER_L/R (the thick bar
// between the two half-page columns), which nothing ever paints over.
export const LB_GRID_COLOR: RGB = [188, 118, 78];
export const LB_GRID_THICKNESS = 0.75;
export const LB_SEPARATOR_COLOR: RGB = [251, 251, 251];
export const LB_SEPARATOR_THICKNESS = 0.6;
// Outer content margin — a thin vertical rule inset from the block's outer
// edge, same x on every block on that side.
export const LB_ACCENT_X_LEFT = 347;
export const LB_ACCENT_X_RIGHT = 2181;
// Left-column labels (labor, extra fees) start well clear of the accent
// line's gutter in the original — not flush against the block's own left
// edge, which is where the field box (and its background fill) still
// starts. Right-column labels sit right after the thick center divider
// with only normal padding, so they need no equivalent adjustment.
export const LB_LABEL_X0_LEFT = 372;
// Mirror on the other side: right-column values (tire, forklift) end well
// clear of their accent line's gutter — a wide value like "18.400,00 MZN"
// would otherwise run right up into the line if simply right-aligned to
// the field box's true right edge.
export const LB_VALUE_X1_RIGHT = 2156;
// Horizontal row separators stop short of the thick center divider by a
// fixed gutter (measured, not derived) rather than spanning the full width.
export const LB_HLINE_LEFT_X1 = 1092;
export const LB_HLINE_RIGHT_X0 = 1220;
// Label/value divider x — hand-placed per column in the original, so it
// isn't a fixed fraction of the block width; measured per block.
export const LB_DIVIDER_X: Record<"labor" | "tire" | "extra" | "forklift", number> = {
  labor: 756,
  tire: 1886,
  extra: 785,
  forklift: 1886,
};

export type LaborItem = { label: string; value: string };
export type LaborBlocks = { labor: LaborItem[]; tire: LaborItem[]; extra: LaborItem[]; forklift: LaborItem[] };

export const LB_EN: LaborBlocks = {
  labor: [
    { label: "Auto Mechanics", value: "2.150,00" },
    { label: "Auto Electrician", value: "2.150,00" },
    { label: "Locksmith", value: "2.150,00" },
    { label: "Auto Painter/Hatter", value: "2.150,00" },
  ],
  tire: [
    { label: "Rear Tires 6.50-10", value: "4.250,00" },
    { label: "Front Tires 28X9-15.70", value: "5.500,00" },
    { label: "Rear Tires 7.00-12", value: "4.550,00" },
    { label: "Front Tires 300-15 C315/70-15", value: "9.150,00" },
    { label: "Tires 18.00-25", value: "12.000,00" },
    { label: "Tires 12.00-24", value: "3.750,00" },
    { label: "Tires 12.00-20", value: "2.850,00" },
    { label: "Tires 10-16.5", value: "2.850,00" },
    { label: "Tires 15.5/80-24", value: "3.750,00" },
    { label: "Tires 8.25X15", value: "5.500,00" },
  ],
  extra: [
    { label: "Sunday/Holiday Rate (by technician)", value: "4.100,00" },
    { label: "Travel fee within from the city of Beira", value: "2.100,00" },
  ],
  forklift: [
    { label: "Light Trailer (Up to 5 Tons)", value: "8.700,00" },
    { label: "Low Truck (Up to 30 Tons)", value: "18.400,00" },
  ],
};

export const LB_PT: LaborBlocks = {
  labor: [
    { label: "Mecânica Auto", value: "2.150,00" },
    { label: "Electrecista Auto", value: "2.150,00" },
    { label: "Serralheiro", value: "2.150,00" },
    { label: "Pintor/Chapeiro Auto", value: "2.150,00" },
  ],
  tire: [
    { label: "Pneus Traseiros 6.50-10", value: "4.250,00" },
    { label: "Pneus Dianteiros 28X9-15.70", value: "5.500,00" },
    { label: "Pneus Traseiros 7.00-12", value: "4.550,00" },
    { label: "Pneus Dianteiros 300-15 C315/70-15", value: "9.150,00" },
    { label: "Pneus 18.00-25", value: "12.000,00" },
    { label: "Pneus 12.00-24", value: "3.750,00" },
    { label: "Pneus 12.00-20", value: "2.850,00" },
    { label: "Pneus 10-16.5", value: "2.850,00" },
    { label: "Pneus 15.5/80-24", value: "3.750,00" },
    { label: "Pneus 8.25X15", value: "5.500,00" },
  ],
  extra: [
    { label: "Taxa Domingos/Feriados (por técnico)", value: "4.100,00" },
    { label: "Taxa Deslocação dentro da cidade Beira", value: "2.100,00" },
  ],
  forklift: [
    { label: "Atrelado Ligeiro (Até 5 Toneladas)", value: "8.700,00" },
    { label: "Camião com Rebaixada (Até 30 Toneladas)", value: "18.400,00" },
  ],
};

export type EquipmentTableConfig = {
  prefix: string;
  title: string;
  headers: [string, string, string, string, string, string, string];
  rows: EquipmentRow[];
  unLabels: string[];
  bgImage: string;
};

export type LaborTableConfig = {
  prefix: string;
  title: string;
  blockTitles: { labor: string; tire: string; extra: string; forklift: string };
  blocks: LaborBlocks;
  unit: string;
  footer: string;
  bgImage: string;
};

export const EQUIPMENT_TABLES: EquipmentTableConfig[] = [
  {
    prefix: "en-eq",
    title: "Equipment Rental Table",
    headers: [
      "Equipment", "Service", "Un", "Min Hour Day",
      "Price Unit (USD) (Without Diesel)", "Price Unit (USD) (With Diesel)", "Total Day (USD) (Without Diesel)",
    ],
    rows: EQ_ROWS_EN,
    unLabels: EQ_UN_EN,
    bgImage: "/precos/page-en-eq.jpg",
  },
  {
    prefix: "pt-eq",
    title: "Tabela de Aluguer de Equipamentos",
    headers: [
      "Equipamentos", "Serviços", "Un", "Min Hora Dia",
      "Preço Unit (USD) (Sem Diesel)", "Preço Unit (USD) (Com Diesel)", "Total/Dia (USD) (Sem Diesel)",
    ],
    rows: EQ_ROWS_PT,
    unLabels: EQ_UN_PT,
    bgImage: "/precos/page-pt-eq.jpg",
  },
];

export const LABOR_TABLES: LaborTableConfig[] = [
  {
    prefix: "en-lb",
    title: "Labor Services",
    blockTitles: {
      labor: "Labor Services",
      tire: "Tire Services from 2 to 5 Ton",
      extra: "Extra Service Fees",
      forklift: "Forklift Mobilization",
    },
    blocks: LB_EN,
    unit: "MZN",
    footer: "The legal VAT in force in Mozambique (16%), if applicable, is added to the prices mentioned.",
    bgImage: "/precos/page-en-lb.jpg",
  },
  {
    prefix: "pt-lb",
    title: "Serviços de Mão de Obra",
    blockTitles: {
      labor: "Serviços de Mão de Obra",
      tire: "Serviços de Pneus de 2 a 5 Ton",
      extra: "Taxas de Serviços Extra",
      forklift: "Mobilização Forklift",
    },
    blocks: LB_PT,
    unit: "MZN",
    footer: "Aos preços mencionados, acresce o IVA legal em vigor em Moçambique (16%), se aplicável.",
    bgImage: "/precos/page-pt-lb.jpg",
  },
];
