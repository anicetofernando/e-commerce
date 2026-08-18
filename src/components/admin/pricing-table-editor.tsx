"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { savePricingTable } from "@/actions/admin-pricing";
import { computeRow } from "@/lib/pricing-calc";

export type PricingSection = { id: string; navLabel: string; html: string };

// Shrink ONE element's own font-size (never its siblings') until its
// container stops overflowing, so an edited number can never spill into the
// neighbouring cell — it just gets a little smaller, exactly like a printed
// sheet would need a condensed digit style for a bigger figure.
function fitToContainer(container: Element, el: HTMLElement) {
  el.style.fontSize = "";
  let guard = 40;
  while (container.scrollWidth > container.clientWidth + 0.5 && guard-- > 0) {
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (!size || size <= 6) break;
    el.style.fontSize = `${size - 0.5}px`;
  }
}

function recalcRow(row: HTMLElement, diesel: number, fx: number) {
  const semEl = row.querySelector<HTMLInputElement>(".sem");
  if (!semEl) return;
  const hoursRef = row.dataset.hoursRef;
  const hoursInput = hoursRef ? (document.getElementById(hoursRef) as HTMLInputElement | null) : null;
  const noDiesel = row.hasAttribute("data-nodiesel");
  const dieselEl = document.getElementById("shared-diesel") as HTMLInputElement | null;
  const dieselChanged = dieselEl ? dieselEl.value !== dieselEl.dataset.orig : false;
  const hoursChanged = hoursInput ? hoursInput.value !== hoursInput.dataset.orig : false;

  const comEl = row.querySelector<HTMLElement>(".com");
  const totalEl = row.querySelector<HTMLElement>(".total");
  const mznEl = row.querySelector<HTMLElement>(".mzn");

  const result = computeRow({
    sem: semEl.value,
    semOrig: semEl.dataset.orig ?? semEl.value,
    comOrig: !noDiesel && comEl ? (comEl.dataset.orig ?? "") : null,
    totalOrig: totalEl?.dataset.orig ?? "0",
    hours: hoursInput?.value ?? "0",
    hoursOrig: hoursInput?.dataset.orig ?? "0",
    dieselPct: diesel,
    dieselChanged,
    hoursChanged,
    noDiesel,
  });

  if (comEl && result.com !== null) {
    comEl.textContent = result.com;
    const cell = comEl.closest(".ov-cell");
    if (cell) {
      cell.classList.toggle("dirty", result.com !== comEl.dataset.orig);
      fitToContainer(cell, comEl);
    }
  }
  if (totalEl) {
    totalEl.textContent = result.total;
    const cell = totalEl.closest(".ov-total-cell");
    if (cell) {
      cell.classList.toggle("dirty", result.total !== totalEl.dataset.orig);
      fitToContainer(totalEl.closest(".total-line") ?? cell, totalEl);
    }
  }
  if (mznEl) {
    if (fx > 0) {
      mznEl.textContent = `≈ ${new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(result.totalNum * fx)} MZN`;
      mznEl.classList.add("show");
    } else {
      mznEl.textContent = "";
      mznEl.classList.remove("show");
    }
  }
}

// % Diesel and Câmbio are ONE shared pair of fields for the whole page (not
// per-table), so a diesel/fx edit recalculates every equipment row-group on
// the page; a price or hours edit only touches its own row/group.
function recalcScope(triggerEl: HTMLInputElement, root: HTMLElement, diesel: number, fx: number) {
  let rows: HTMLElement[];
  if (triggerEl.matches(".sem")) {
    const rg = triggerEl.closest<HTMLElement>(".row-group");
    rows = rg ? [rg] : [];
  } else if (triggerEl.matches(".hours-input")) {
    const card = triggerEl.closest<HTMLElement>(".pricing-card");
    rows = card ? Array.from(card.querySelectorAll<HTMLElement>(`.row-group[data-hours-ref="${triggerEl.id}"]`)) : [];
  } else {
    rows = Array.from(root.querySelectorAll<HTMLElement>(".row-group"));
  }
  rows.forEach((row) => recalcRow(row, diesel, fx));
}

function markDirty(el: HTMLInputElement) {
  if (!("orig" in el.dataset)) return;
  const changed = el.value !== el.dataset.orig;
  const target = el.closest(".ov-cell") ?? el.closest(".ov-row") ?? el;
  target.classList.toggle("dirty", changed);
}

// A labor-row label/value is a single-line <input>, but several of the
// printed originals wrap to two lines in their (narrow) column — "Taxa
// Domingos/Feriados (por técnico)", "Camião com Rebaixada (Até 30
// Toneladas)". Without this, that text just runs past the row's edge and
// gets clipped. Shrinking it to fit is the same trick recalcRow already
// uses for a wider recalculated total.
//
// A label input's own width IS its true box (set directly from lbFieldRects
// in pricing-render.ts), so it's its own container. A money input isn't —
// its CSS width is a fixed em-based guess, not the precisely measured value
// box — so it has to be measured against its wrapping .ov-cell instead,
// which is that true box; shrinking the input's font-size still shrinks its
// own em-based width in step, so this still converges correctly.
function fitLaborField(el: HTMLElement) {
  const container = el.classList.contains("labor-money") ? (el.closest(".ov-cell") ?? el) : el;
  fitToContainer(container, el);
}

function fitAllLaborFields(root: ParentNode) {
  root.querySelectorAll<HTMLElement>(".lbl-input, .labor-money").forEach(fitLaborField);
}

export function PricingTableEditor({
  sections,
  sharedDiesel,
  sharedDieselOrig,
  sharedFx,
}: {
  sections: PricingSection[];
  sharedDiesel: string;
  sharedDieselOrig: string;
  sharedFx: string;
}) {
  const [state, formAction] = useActionState(savePricingTable, undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  // Captured once — the effect below injects this HTML exactly one time and
  // never again, so a later re-render (e.g. after saving) can't touch it.
  const initialSections = useRef(sections);

  // Every field lives inside a section injected here as raw HTML, imperatively,
  // OUTSIDE React's reconciliation (a plain DOM write, not dangerouslySetInnerHTML).
  // This is deliberate: React re-renders this component after every save (the
  // server action revalidates the route), and if the markup were JSX-managed,
  // React would diff and rewrite it on that re-render — wiping out or duplicating
  // whatever the browser's own DOM mutations (recalculated totals, dirty-state
  // classes, this-run's edits) had done in the meantime. Writing it once, then
  // leaving it alone, is what keeps one field's edit from disturbing any other.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    initialSections.current.forEach((s) => {
      const el = root.querySelector<HTMLElement>(`section[data-section-id="${s.id}"]`);
      if (el && !el.dataset.injected) {
        el.innerHTML = s.html;
        el.dataset.injected = "1";
      }
    });
    fitAllLaborFields(root);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onInput = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(".sem, .hours-input, .diesel-input, .fx-input")) {
        const dieselEl = document.getElementById("shared-diesel") as HTMLInputElement | null;
        const fxEl = document.getElementById("shared-fx") as HTMLInputElement | null;
        const diesel = dieselEl ? Number(dieselEl.value.replace(",", ".")) || 0 : 0;
        const fx = fxEl ? Number(fxEl.value.replace(/\./g, "").replace(",", ".")) || 0 : 0;
        recalcScope(t, root, diesel, fx);
      } else if (t.matches(".lbl-input, .labor-money")) {
        fitLaborField(t);
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(".money-input, .fx-input")) {
        const n = Number(t.value.replace(/\./g, "").replace(",", ".")) || 0;
        t.value = new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
      } else if (t.matches(".plain-num-input, .hours-input, .diesel-input")) {
        t.value = String(Number(t.value.replace(",", ".")) || 0);
      }
      markDirty(t);
    };

    root.addEventListener("input", onInput);
    root.addEventListener("focusout", onFocusOut, true);
    return () => {
      root.removeEventListener("input", onInput);
      root.removeEventListener("focusout", onFocusOut, true);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <div className="pricing-editor-chrome sticky top-0 z-10 -mx-6 mb-4 flex flex-wrap items-end gap-5 border-b border-ink-100 bg-white/95 px-6 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <div className="field">
          <label className="mb-1 block text-[11px] font-bold tracking-wide text-ink-500 uppercase" htmlFor="shared-diesel">
            % Diesel
          </label>
          <input
            id="shared-diesel"
            form="pricing-form"
            name="shared-diesel"
            className="diesel-input w-24 rounded-md border border-ink-300 px-2.5 py-1.5 text-sm"
            defaultValue={sharedDiesel}
            data-orig={sharedDieselOrig}
            inputMode="decimal"
          />
        </div>
        <div className="field">
          <label className="mb-1 block text-[11px] font-bold tracking-wide text-ink-500 uppercase" htmlFor="shared-fx">
            Câmbio (USD→MZN)
          </label>
          <input
            id="shared-fx"
            form="pricing-form"
            name="shared-fx"
            className="fx-input w-32 rounded-md border border-ink-300 px-2.5 py-1.5 text-sm"
            defaultValue={sharedFx}
            placeholder="ex: 64,50"
            inputMode="decimal"
          />
        </div>
        <p className="max-w-xs text-xs text-ink-500">
          Válido para as duas tabelas de equipamentos. Preencha o câmbio para ver o equivalente em MZN por baixo do
          &quot;Total/Dia&quot;.
        </p>
        <nav className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100"
            >
              {s.navLabel}
            </a>
          ))}
        </nav>
        <a
          href="/admin/precos/pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto rounded-full border border-ink-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
        >
          Descarregar PDF
        </a>
      </div>

      <form id="pricing-form" action={formAction}>
        <div className="pricing-editor-chrome mb-4 flex items-center gap-3">
          <SubmitButton>Guardar Alterações</SubmitButton>
          <FormAlert message={state?.message ?? state?.error} tone={state?.error ? "error" : "success"} />
        </div>

        <div className="space-y-9">
          {sections.map((s) => (
            <section key={s.id} id={s.id} data-section-id={s.id} className="pricing-section scroll-mt-20" />
          ))}
        </div>

        <div className="pricing-editor-chrome mt-6 flex items-center gap-3">
          <SubmitButton>Guardar Alterações</SubmitButton>
        </div>
      </form>
    </div>
  );
}
