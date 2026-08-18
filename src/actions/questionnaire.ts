"use server";

import { prisma } from "@/lib/db";
import { businessQuestionnaireSchema } from "@/lib/validation";
import type { AuthFormState } from "@/actions/auth";

export async function submitQuestionnaire(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = businessQuestionnaireSchema.safeParse({
    respondentName: formData.get("respondentName"),
    respondentRole: formData.get("respondentRole") || "",
    a1: formData.get("a1"),
    a1Outro: formData.get("a1Outro") || "",
    c1: formData.get("c1"),
    c1Outro: formData.get("c1Outro") || "",
    c3: formData.get("c3"),
    c3Outro: formData.get("c3Outro") || "",
    e1: formData.get("e1"),
    e1Outro: formData.get("e1Outro") || "",
    e2: formData.get("e2"),
    e2Outro: formData.get("e2Outro") || "",
    g1: formData.get("g1"),
    g1Outro: formData.get("g1Outro") || "",
    h1: formData.get("h1"),
    h1Outro: formData.get("h1Outro") || "",
    notas: formData.get("notas") || "",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Falta responder a algumas perguntas obrigatórias." };
  }

  const { respondentName, respondentRole, ...answers } = validated.data;

  await prisma.businessQuestionnaireResponse.create({
    data: {
      respondentName,
      respondentRole: respondentRole || null,
      answers,
    },
  });

  return { message: "Respostas enviadas com sucesso. Obrigado!" };
}
