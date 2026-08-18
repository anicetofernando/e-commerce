"use client";

import { useActionState } from "react";
import { submitQuestionnaire } from "@/actions/questionnaire";
import { Input, Label, Textarea, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

function RadioOption({ name, value, children }: { name: string; value: string; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-ink-200 p-3 text-sm text-ink-700 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50/50 has-[:checked]:ring-2 has-[:checked]:ring-brand-500/15">
      <input type="radio" name={name} value={value} required className="mt-0.5 accent-brand-600" />
      <span>{children}</span>
    </label>
  );
}

function OutroOption({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-ink-200 px-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50/50 has-[:checked]:ring-2 has-[:checked]:ring-brand-500/15 sm:col-span-2">
      <label className="flex shrink-0 cursor-pointer items-center gap-2 py-3 text-sm text-ink-700">
        <input type="radio" name={name} value="outro" className="accent-brand-600" />
        Outro:
      </label>
      <input
        type="text"
        name={`${name}Outro`}
        placeholder="Especifique..."
        className="w-full border-0 bg-transparent py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-100 bg-white p-5 sm:p-6">
      <h2 className="mb-5 border-b border-ink-100 pb-3 text-sm font-bold tracking-wide text-ink-500 uppercase">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Q({ n, text, children }: { n: number; text: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-900">
        <span className="mr-2 text-ink-400">{n}.</span>
        {text}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function QuestionnaireForm() {
  const [state, action] = useActionState(submitQuestionnaire, undefined);

  if (state?.message && !state.errors) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-bold text-green-800">Obrigado!</h2>
        <p className="mt-2 text-sm text-green-700">
          As suas respostas foram enviadas com sucesso. A nossa equipa vai analisá-las para
          continuar o desenvolvimento do site.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <FormAlert message={state?.errors ? state.message : undefined} tone="error" />

      <section className="rounded-lg border border-ink-100 bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="respondentName">O seu nome</Label>
            <Input id="respondentName" name="respondentName" required />
            <FieldError messages={state?.errors?.respondentName} />
          </div>
          <div>
            <Label htmlFor="respondentRole">Cargo / função (opcional)</Label>
            <Input id="respondentRole" name="respondentRole" placeholder="Ex: Gerente, Sócio-gerente..." />
          </div>
        </div>
      </section>

      <Section title="Preço">
        <Q n={1} text="O preço da peça deve estar sempre visível no site, ou o cliente só o vê depois de pedir?">
          <RadioOption name="a1" value="sempre_visivel">Sempre visível — o cliente compra directamente</RadioOption>
          <RadioOption name="a1" value="escondido_cotacao">Escondido — só depois de &quot;Pedir Cotação&quot;</RadioOption>
          <RadioOption name="a1" value="misto">Misto — preço de referência visível, final por cotação em compras grandes</RadioOption>
          <OutroOption name="a1" />
        </Q>
      </Section>

      <Section title="Encomendas e Entrega">
        <Q n={2} text="Como é que o cliente recebe a encomenda?">
          <RadioOption name="c1" value="entrega">Entrega em obra/casa</RadioOption>
          <RadioOption name="c1" value="levantamento">Levantamento no armazém</RadioOption>
          <RadioOption name="c1" value="ambas">As duas, à escolha do cliente</RadioOption>
          <OutroOption name="c1" />
        </Q>
        <Q n={3} text="O cliente precisa de ver a localização da entrega em tempo real (GPS), ou basta ver o estado a mudar (Pendente → Confirmada → Enviada → Entregue)?">
          <RadioOption name="c3" value="gps">Sim, localização em tempo real (GPS)</RadioOption>
          <RadioOption name="c3" value="estado_simples">Basta o estado da encomenda mudar</RadioOption>
          <OutroOption name="c3" />
        </Q>
      </Section>

      <Section title="Stock">
        <Q n={4} text="O site deve mostrar a quantidade exacta em stock, ou só &quot;Disponível&quot; / &quot;Esgotado&quot;?">
          <RadioOption name="e1" value="quantidade_exacta">Quantidade exacta (ex: &quot;8 unidades&quot;)</RadioOption>
          <RadioOption name="e1" value="disponivel_esgotado">Só &quot;Disponível&quot; / &quot;Esgotado&quot;</RadioOption>
          <OutroOption name="e1" />
        </Q>
        <Q n={5} text="Um cliente pode encomendar uma peça sem stock (sob consulta, com prazo de chegada)?">
          <RadioOption name="e2" value="sim_sob_consulta">Sim, sob consulta</RadioOption>
          <RadioOption name="e2" value="nao_so_stock">Não, só o que já está em armazém</RadioOption>
          <OutroOption name="e2" />
        </Q>
      </Section>

      <Section title="Clientes">
        <Q n={6} text="O site é para empresas (B2B), para particulares (B2C), ou os dois?">
          <RadioOption name="g1" value="b2b">Só empresas (B2B)</RadioOption>
          <RadioOption name="g1" value="b2c">Só particulares (B2C)</RadioOption>
          <RadioOption name="g1" value="ambos">Os dois</RadioOption>
          <OutroOption name="g1" />
        </Q>
      </Section>

      <Section title="Aluguer, Transporte e Manutenção">
        <Q n={7} text="Estes serviços devem ter reserva/agendamento online, ou continuam a ser só &quot;Pedir Orçamento&quot;?">
          <RadioOption name="h1" value="reserva_online">Reserva/agendamento online</RadioOption>
          <RadioOption name="h1" value="so_orcamento">Só &quot;Pedir Orçamento&quot;</RadioOption>
          <OutroOption name="h1" />
        </Q>
      </Section>

      <section className="rounded-lg border border-ink-100 bg-white p-5 sm:p-6">
        <Label htmlFor="notas">Notas adicionais (opcional)</Label>
        <Textarea id="notas" name="notas" rows={4} placeholder="Alguma coisa que não se enquadre nas perguntas acima..." />
      </section>

      <SubmitButton size="lg" className="w-full justify-center">Enviar Respostas</SubmitButton>
    </form>
  );
}
