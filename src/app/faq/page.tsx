import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = { title: "Perguntas Frequentes" };

const FAQS = [
  {
    question: "Como sei se uma peça é compatível com a minha máquina?",
    answer:
      "Cada peça no nosso catálogo indica a marca e o(s) modelo(s) de máquina compatíveis, além do número OEM e referências cruzadas. Também pode usar o localizador \"Encontrar por Máquina\" para filtrar peças pela marca e modelo do seu equipamento. Em caso de dúvida, contacte a nossa equipa técnica com o número de série da máquina.",
  },
  {
    question: "Quais são os métodos de pagamento disponíveis?",
    answer:
      "Aceitamos transferência bancária, M-Pesa, e-Mola e numerário na entrega (sujeito a confirmação e disponibilidade na sua zona). Após finalizar a encomenda, a nossa equipa entra em contacto para confirmar os detalhes do pagamento.",
  },
  {
    question: "Para onde fazem entregas e quanto tempo demora?",
    answer:
      "Entregamos em todas as províncias de Moçambique. Encomendas para a Área Metropolitana de Maputo chegam geralmente em 1 a 3 dias úteis; outras províncias entre 3 a 7 dias úteis, dependendo da disponibilidade de stock e da localização.",
  },
  {
    question: "As peças têm garantia?",
    answer:
      "Sim. A maioria das peças novas tem garantia entre 3 a 12 meses contra defeitos de fabrico, indicada na página do produto. Peças recondicionadas têm garantia específica, também indicada individualmente.",
  },
  {
    question: "Vendem apenas peças novas?",
    answer:
      "Trabalhamos principalmente com peças novas, mas também disponibilizamos peças recondicionadas e usadas em bom estado para determinados componentes de maior valor, como turbocompressores, sempre identificadas claramente no produto.",
  },
  {
    question: "Fazem vendas por grosso para empresas e frotas?",
    answer:
      "Sim. Para empresas com frotas de equipamento, oferecemos condições comerciais específicas para compras recorrentes ou em maior volume. Contacte a nossa equipa comercial para uma proposta personalizada.",
  },
  {
    question: "Posso devolver ou trocar uma peça?",
    answer:
      "Aceitamos trocas em até 7 dias após a receção, desde que a peça esteja na embalagem original e sem sinais de instalação, exceto em casos de defeito de fabrico, que seguem os termos de garantia.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <div className="bg-ink-900 py-14">
        <Container>
          <h1 className="text-3xl font-black text-white">Perguntas Frequentes</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-300">
            Respostas rápidas às dúvidas mais comuns sobre compatibilidade, entregas, pagamentos e garantia.
          </p>
        </Container>
      </div>

      <Container className="max-w-3xl py-14">
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-ink-100 bg-white p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink-900">
                {faq.question}
                <ChevronDown size={18} className="shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
          Não encontrou a resposta que procurava?{" "}
          <a href={`mailto:${CONTACT_INFO.email}`} className="font-semibold text-brand-600 hover:underline">
            Contacte a nossa equipa
          </a>
          .
        </div>
      </Container>
    </div>
  );
}
