// Shared by the server render (initial values) and the client component
// (live recalculation as an admin types), so the formula only lives once.

export function parseLenient(str: string | null | undefined): number {
  let s = String(str ?? "").trim();
  if (!s) return 0;
  s = s.replace(/\s/g, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

export function fmt2(n: number): string {
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  const [intPart, decPart] = rounded.toFixed(2).split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decPart}`;
}

/**
 * Recompute one equipment row's "com diesel" / "total" from its (possibly
 * edited) unit price. When the shared % Diesel / hours field is still at its
 * printed default, we scale from THIS row's own original ratios instead of a
 * flat 30% / ×hours formula — the source price list has small rounding
 * inconsistencies (e.g. 62,06 × 1.3 = 80,68 but the sheet prints 80,67), so
 * an untouched row must reproduce the exact printed value rather than get
 * flagged as "changed" by a rounding artifact.
 */
export function computeRow(params: {
  sem: string;
  semOrig: string;
  comOrig: string | null;
  totalOrig: string;
  hours: string;
  hoursOrig: string;
  dieselPct: number;
  dieselChanged: boolean;
  hoursChanged: boolean;
  noDiesel: boolean;
}) {
  const sem = parseLenient(params.sem);
  const semOrig = parseLenient(params.semOrig);
  const hours = parseLenient(params.hours);

  let com: string | null = null;
  if (!params.noDiesel && params.comOrig != null) {
    const comOrig = parseLenient(params.comOrig);
    const comNum = !params.dieselChanged && semOrig ? sem * (comOrig / semOrig) : sem * (1 + params.dieselPct / 100);
    com = fmt2(comNum);
  }

  const totalOrig = parseLenient(params.totalOrig);
  const totalNum = !params.hoursChanged && semOrig ? sem * (totalOrig / semOrig) : sem * hours;
  const total = fmt2(totalNum);

  return { com, total, totalNum };
}
