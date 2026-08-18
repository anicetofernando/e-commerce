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

function recalcRow(row: HTMLElement, dieselEl: HTMLInputElement | null, diesel: number, fx: number) {
  const semEl = row.querySelector<HTMLInputElement>(".sem");
  if (!semEl) return;
  const hoursRef = row.dataset.hoursRef;
  const hoursInput = hoursRef ? (document.getElementById(hoursRef) as HTMLInputElement | null) : null;
  const noDiesel = row.hasAttribute("data-nodiesel");
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

function recalcScope(triggerEl: HTMLElement, card: HTMLElement) {
  const section = card.closest("section");
  const controls = section?.querySelector(".pricing-controls");
  const dieselEl = controls?.querySelector<HTMLInputElement>(".diesel-input") ?? null;
  const fxEl = controls?.querySelector<HTMLInputElement>(".fx-input") ?? null;
  const diesel = dieselEl ? Number(dieselEl.value.replace(",", ".")) || 0 : 0;
  const fx = fxEl ? Number(fxEl.value.replace(",", ".")) || 0 : 0;

  let rows: HTMLElement[];
  if (triggerEl.matches(".sem")) {
    const rg = triggerEl.closest<HTMLElement>(".row-group");
    rows = rg ? [rg] : [];
  } else if (triggerEl.matches(".hours-input")) {
    rows = Array.from(card.querySelectorAll<HTMLElement>(`.row-group[data-hours-ref="${triggerEl.id}"]`));
  } else {
    rows = Array.from(card.querySelectorAll<HTMLElement>(".row-group"));
  }
  rows.forEach((row) => recalcRow(row, dieselEl, diesel, fx));
}

function markDirty(el: HTMLInputElement) {
  if (!("orig" in el.dataset)) return;
  const changed = el.value !== el.dataset.orig;
  const target = el.closest(".ov-cell") ?? el.closest(".ov-row") ?? el;
  target.classList.toggle("dirty", changed);
}

export function PricingTableEditor({ sections }: { sections: PricingSection[] }) {
  const [state, formAction] = useActionState(savePricingTable, undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onInput = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(".sem, .hours-input, .diesel-input, .fx-input")) {
        const card = t.closest<HTMLElement>(".pricing-card");
        if (card) recalcScope(t, card);
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(".money-input")) {
        const n = Number(t.value.replace(/\./g, "").replace(",", ".")) || 0;
        t.value = new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
      } else if (t.matches(".plain-num-input, .hours-input")) {
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
      <div className="pricing-editor-chrome sticky top-0 z-10 -mx-6 mb-4 flex flex-wrap items-center gap-3 border-b border-ink-100 bg-white/95 px-6 py-3 backdrop-blur lg:-mx-8 lg:px-8">
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
        <button
          type="button"
          onClick={() => window.print()}
          className="ml-auto rounded-full border border-ink-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
        >
          Descarregar PDF
        </button>
      </div>

      <form action={formAction}>
        <div className="pricing-editor-chrome mb-4 flex items-center gap-3">
          <SubmitButton>Guardar Alterações</SubmitButton>
          <FormAlert message={state?.message ?? state?.error} tone={state?.error ? "error" : "success"} />
        </div>

        <div className="space-y-9">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="pricing-section scroll-mt-20" dangerouslySetInnerHTML={{ __html: s.html }} />
          ))}
        </div>

        <div className="pricing-editor-chrome mt-6 flex items-center gap-3">
          <SubmitButton>Guardar Alterações</SubmitButton>
          <FormAlert message={state?.message ?? state?.error} tone={state?.error ? "error" : "success"} />
        </div>
      </form>
    </div>
  );
}
