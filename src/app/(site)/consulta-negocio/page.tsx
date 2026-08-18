import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";

export const metadata: Metadata = { title: "Consulta ao Cliente", robots: { index: false, follow: false } };

export default function BusinessQuestionnairePage() {
  return (
    <div className="bg-ink-50/40 py-12">
      <Container className="max-w-3xl">
        <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">Definição do Modelo de Negócio</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-600">
          Para o site funcionar como o negócio realmente funciona, precisamos de confirmar
          algumas regras de preço, entrega, stock e garantia.
        </p>

        <div className="mt-8">
          <QuestionnaireForm />
        </div>
      </Container>
    </div>
  );
}
