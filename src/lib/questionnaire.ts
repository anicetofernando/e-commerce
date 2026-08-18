export const QUESTIONNAIRE_QUESTIONS: Record<string, string> = {
  a1: "Preço sempre visível, ou só depois de pedir?",
  c1: "Como o cliente recebe a encomenda?",
  c3: "GPS em tempo real, ou estado simples?",
  e1: "Quantidade exacta em stock, ou disponível/esgotado?",
  e2: "Permite encomenda sem stock (sob consulta)?",
  g1: "B2B, B2C, ou os dois?",
  h1: "Reserva online, ou só pedir orçamento?",
  notas: "Notas adicionais",
};

const OUTRO_FIELD: Record<string, string> = {
  a1: "a1Outro",
  c1: "c1Outro",
  c3: "c3Outro",
  e1: "e1Outro",
  e2: "e2Outro",
  g1: "g1Outro",
  h1: "h1Outro",
};

export const QUESTIONNAIRE_LABELS: Record<string, string> = {
  sempre_visivel: "Sempre visível — compra directa",
  escondido_cotacao: "Escondido — só por cotação",
  misto: "Misto — referência visível, final por cotação",
  entrega: "Entrega em obra/casa",
  levantamento: "Levantamento no armazém",
  ambas: "As duas, à escolha do cliente",
  gps: "Localização em tempo real (GPS)",
  estado_simples: "Só o estado a mudar",
  quantidade_exacta: "Quantidade exacta",
  disponivel_esgotado: "Só \"Disponível\" / \"Esgotado\"",
  sim_sob_consulta: "Sim, sob consulta",
  nao_so_stock: "Não, só o que está em armazém",
  b2b: "Só empresas (B2B)",
  b2c: "Só particulares (B2C)",
  ambos: "Os dois",
  reserva_online: "Reserva/agendamento online",
  so_orcamento: "Só \"Pedir Orçamento\"",
  outro: "Outro",
};

export function formatQuestionnaireAnswer(key: string, answers: Record<string, unknown>): string {
  const value = answers[key];

  if (typeof value === "string" && value.trim()) {
    if (value === "outro" && OUTRO_FIELD[key]) {
      const detail = answers[OUTRO_FIELD[key]];
      return typeof detail === "string" && detail.trim() ? `Outro — ${detail}` : "Outro";
    }
    return QUESTIONNAIRE_LABELS[value] ?? value;
  }

  return "—";
}
