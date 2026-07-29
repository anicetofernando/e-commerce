import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Rating } from "@/components/ui/rating";

const TESTIMONIALS = [
  {
    name: "Carlos Machava",
    company: "Construções Machava, Lda",
    quote:
      "A Albimaq tem sido o nosso fornecedor de confiança para peças hidráulicas. Entrega rápida e peças que encaixam à primeira, sem retrabalho.",
  },
  {
    name: "Fátima Nhantumbo",
    company: "Nhantumbo Terraplanagem",
    quote:
      "Equipa técnica muito atenta — ajudaram-nos a identificar a peça correta apenas com o número de série da máquina. Recomendo vivamente.",
  },
  {
    name: "Eng. Sérgio Tembe",
    company: "Tembe Mineração e Logística",
    quote:
      "Stock permanente de filtros e óleos, o que reduz muito o tempo de paragem das nossas escavadoras. Ótima relação qualidade-preço.",
  },
];

export function Testimonials() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Testemunhos" title="Empresas que Confiam na Albimaq" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col rounded-lg border border-ink-100 bg-white p-6">
              <Quote className="mb-3 text-brand-300" size={28} />
              <Rating value={5} size={14} className="mb-3" />
              <p className="flex-1 text-sm leading-relaxed text-ink-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 border-t border-ink-100 pt-4">
                <p className="text-sm font-bold text-ink-900">{t.name}</p>
                <p className="text-xs text-ink-500">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
