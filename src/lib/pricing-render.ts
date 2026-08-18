import "server-only";
import {
  IMG_W,
  IMG_H,
  pct,
  rgb,
  EQ_ROW0_TOP,
  EQ_ROW_H,
  EQ_COLS,
  EQ_ROW_BG,
  EQ_GROUPS,
  EQ_NODIESEL,
  EQ_SERVICE_MERGE,
  LB_LEFT_X0,
  LB_LEFT_X1,
  LB_RIGHT_X0,
  LB_RIGHT_X1,
  LB_PAIR1_TOP,
  LB_PAIR1_ROW_H,
  LB_PAIR2_TOP,
  LB_PAIR2_ROW_H,
  LB_ROW_BG_PAIR1,
  LB_ROW_BG_PAIR2_LEFT,
  LB_ROW_BG_PAIR2_RIGHT,
  type EquipmentTableConfig,
  type LaborTableConfig,
} from "@/lib/pricing-data";
import { computeRow, parseLenient } from "@/lib/pricing-calc";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function eqStyle(rowStart: number, rowSpan: number, colIdx: number, bg: string): string {
  const top = EQ_ROW0_TOP + rowStart * EQ_ROW_H;
  const height = EQ_ROW_H * rowSpan;
  const left = EQ_COLS[colIdx];
  const width = EQ_COLS[colIdx + 1] - EQ_COLS[colIdx];
  return `left:${pct(left, IMG_W)}%;top:${pct(top, IMG_H)}%;width:${pct(width, IMG_W)}%;height:${pct(height, IMG_H)}%;--cellbg:${bg};`;
}

/**
 * Render one equipment table (the overlay layer only — the caller wraps this
 * with the background <img>). Every field's current value is `overrides[key]
 * ?? <printed original>`, and `data-orig` always holds the printed original
 * so the client JS can tell an edited field apart from an untouched one.
 */
export function renderEquipmentTable(
  config: EquipmentTableConfig,
  overrides: Record<string, string>,
  sharedDiesel: string,
  sharedDieselOrig: string,
): string {
  const prefix = config.prefix;
  const dieselVal = sharedDiesel;
  const dieselChanged = dieselVal !== sharedDieselOrig;

  const groupOf = new Map<number, { gi: number; start: number; span: number }>();
  EQ_GROUPS.forEach(([start, span], gi) => {
    for (let r = start; r < start + span; r++) groupOf.set(r, { gi, start, span });
  });

  const html: string[] = [];

  config.rows.forEach((row, i) => {
    const g = groupOf.get(i)!;
    const bg = rgb(EQ_ROW_BG[i]);
    const hoursId = `${prefix}-h${g.gi + 1}`;
    const noDiesel = EQ_NODIESEL.has(i);
    const groupStart = i === g.start;
    const unLabelOrig = config.unLabels[g.gi];
    const hoursOrig = unLabelOrig === "Day" || unLabelOrig === "Dia" ? "1" : "8";

    // Equipment
    const equipKey = `${prefix}-r${i}-equip`;
    const equipVal = overrides[equipKey] ?? row.equip;
    html.push(
      `<input class="ov ov-text${equipVal !== row.equip ? " dirty" : ""}" style="${eqStyle(i, 1, 0, bg)}text-align:left;" name="${equipKey}" value="${esc(equipVal)}" data-orig="${esc(row.equip)}">`,
    );

    // Service (handles the "Copper" merge)
    if (i in EQ_SERVICE_MERGE) {
      const span = EQ_SERVICE_MERGE[i];
      const serviceKey = `${prefix}-r${i}-service`;
      const serviceVal = overrides[serviceKey] ?? (row.service ?? "");
      html.push(
        `<input class="ov ov-text${serviceVal !== row.service ? " dirty" : ""}" style="${eqStyle(i, span, 1, bg)}text-align:left;" name="${serviceKey}" value="${esc(serviceVal)}" data-orig="${esc(row.service ?? "")}">`,
      );
    } else if (row.service !== null) {
      const serviceKey = `${prefix}-r${i}-service`;
      const serviceVal = overrides[serviceKey] ?? row.service;
      html.push(
        `<input class="ov ov-text${serviceVal !== row.service ? " dirty" : ""}" style="${eqStyle(i, 1, 1, bg)}text-align:left;" name="${serviceKey}" value="${esc(serviceVal)}" data-orig="${esc(row.service)}">`,
      );
    }

    // Un + Hours (only on the first row of a rowspan group)
    if (groupStart) {
      const unKey = `${hoursId}-un`;
      const unVal = overrides[unKey] ?? unLabelOrig;
      const hoursKey = `${hoursId}-hours`;
      const hoursVal = overrides[hoursKey] ?? hoursOrig;
      html.push(
        `<input class="ov ov-text${unVal !== unLabelOrig ? " dirty" : ""}" style="${eqStyle(g.start, g.span, 2, bg)}text-align:center;" name="${unKey}" value="${esc(unVal)}" data-orig="${esc(unLabelOrig)}">`,
      );
      html.push(
        `<input id="${hoursId}" class="ov ov-plainnum hours-input${hoursVal !== hoursOrig ? " dirty" : ""}" style="${eqStyle(g.start, g.span, 3, bg)}text-align:center;" name="${hoursKey}" value="${esc(hoursVal)}" data-orig="${esc(hoursOrig)}" data-role="hours">`,
      );
    }

    // Sem / Com / Total
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
      dieselPct: parseLenient(dieselVal),
      dieselChanged,
      hoursChanged,
      noDiesel,
    });

    const semDirty = semVal !== row.sem;
    const comDirty = !noDiesel && row.com != null && com !== row.com;
    const totalDirty = total !== row.total;

    html.push(`<div class="row-group" data-hours-ref="${hoursId}"${noDiesel ? " data-nodiesel" : ""}>`);
    html.push(
      `  <div class="ov ov-cell${semDirty ? " dirty" : ""}" style="${eqStyle(i, 1, 4, bg)}"><input class="sem ov-money" name="${semKey}" value="${esc(semVal)}" data-orig="${esc(row.sem)}" data-role="sem"><span class="ov-unit">USD</span></div>`,
    );
    if (noDiesel) {
      html.push(`  <div class="ov ov-cell" style="${eqStyle(i, 1, 5, bg)}"><span class="com" data-orig="${esc(row.com ?? "")}">${esc(row.com ?? "")}</span>${row.com !== null ? '<span class="ov-unit">USD</span>' : ""}</div>`);
    } else {
      html.push(
        `  <div class="ov ov-cell${comDirty ? " dirty" : ""}" style="${eqStyle(i, 1, 5, bg)}"><span class="com" data-orig="${esc(row.com ?? "")}">${esc(com ?? "")}</span><span class="ov-unit">USD</span></div>`,
      );
    }
    html.push(
      `  <div class="ov ov-cell ov-total-cell${totalDirty ? " dirty" : ""}" style="${eqStyle(i, 1, 6, bg)}"><div class="total-line"><span class="total" data-orig="${esc(row.total)}">${esc(total)}</span><span class="ov-unit">USD</span></div><div class="mzn"></div></div>`,
    );
    html.push(`</div>`);
  });

  return `
    <div class="pricing-card">
      <div class="pricing-frame">
        <img class="pricing-bg" src="${config.bgImage}" alt="${esc(config.title)}" width="${IMG_W}" height="${IMG_H}">
        <div class="pricing-overlay">
${html.join("\n")}
        </div>
      </div>
    </div>`;
}

export function renderLaborTable(config: LaborTableConfig, overrides: Record<string, string>): string {
  const prefix = config.prefix;

  function lbStyle(top0: number, rowH: number, rowIdx: number, col: "left" | "right", bg: string): string {
    const top = top0 + rowIdx * rowH;
    const [left, width] = col === "left" ? [LB_LEFT_X0, LB_LEFT_X1 - LB_LEFT_X0] : [LB_RIGHT_X0, LB_RIGHT_X1 - LB_RIGHT_X0];
    return `left:${pct(left, IMG_W)}%;top:${pct(top, IMG_H)}%;width:${pct(width, IMG_W)}%;height:${pct(rowH, IMG_H)}%;--cellbg:${bg};`;
  }

  function block(
    name: "labor" | "tire" | "extra" | "forklift",
    top0: number,
    rowH: number,
    col: "left" | "right",
    bgList: string | string[],
  ): string {
    return config.blocks[name]
      .map((item, i) => {
        const bg = Array.isArray(bgList) ? bgList[i] : bgList;
        const lblKey = `${prefix}-${name}-${i}-lbl`;
        const valKey = `${prefix}-${name}-${i}-val`;
        const lblVal = overrides[lblKey] ?? item.label;
        const valVal = overrides[valKey] ?? item.value;
        const dirty = lblVal !== item.label || valVal !== item.value;
        return `      <div class="ov ov-row${dirty ? " dirty" : ""}" style="${lbStyle(top0, rowH, i, col, bg)}"><input class="ov-text lbl-input" name="${lblKey}" value="${esc(lblVal)}" data-orig="${esc(item.label)}"><span class="ov-row-val"><input class="money-input labor-money" name="${valKey}" value="${esc(valVal)}" data-orig="${esc(item.value)}"><span class="ov-unit">${esc(config.unit)}</span></span></div>`;
      })
      .join("\n");
  }

  const rows = [
    block("labor", LB_PAIR1_TOP, LB_PAIR1_ROW_H, "left", rgb(LB_ROW_BG_PAIR1)),
    block("tire", LB_PAIR1_TOP, LB_PAIR1_ROW_H, "right", rgb(LB_ROW_BG_PAIR1)),
    block("extra", LB_PAIR2_TOP, LB_PAIR2_ROW_H, "left", LB_ROW_BG_PAIR2_LEFT.map(rgb)),
    block("forklift", LB_PAIR2_TOP, LB_PAIR2_ROW_H, "right", LB_ROW_BG_PAIR2_RIGHT.map(rgb)),
  ].join("\n");

  return `
    <div class="pricing-card">
      <div class="pricing-frame">
        <img class="pricing-bg" src="${config.bgImage}" alt="${esc(config.title)}" width="${IMG_W}" height="${IMG_H}">
        <div class="pricing-overlay">
${rows}
        </div>
      </div>
    </div>`;
}
