import type { Metadata } from "next";
import { getAdminQuestionnaireResponses } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { QUESTIONNAIRE_QUESTIONS, formatQuestionnaireAnswer } from "@/lib/questionnaire";

export const metadata: Metadata = { title: "Consulta ao Cliente — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminQuestionnairePage() {
  const responses = await getAdminQuestionnaireResponses();

  return (
    <div>
      <AdminPageHeader
        title="Consulta ao Cliente"
        description={`${responses.length} resposta${responses.length === 1 ? "" : "s"} ao questionário de modelo de negócio.`}
      />

      {responses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 bg-white py-16 text-center text-sm text-ink-500">
          Ainda não há respostas. Partilhe o link{" "}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">/consulta-negocio</code> com o cliente.
        </div>
      ) : (
        <div className="space-y-6">
          {responses.map((r) => {
            const answers = r.answers as Record<string, unknown>;
            return (
              <div key={r.id} className="overflow-hidden rounded-xl border border-ink-100 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 bg-ink-50/60 px-5 py-4">
                  <div>
                    <p className="font-bold text-ink-900">{r.respondentName}</p>
                    {r.respondentRole && <p className="text-xs text-ink-500">{r.respondentRole}</p>}
                  </div>
                  <p className="text-xs text-ink-400">{formatDateTime(r.submittedAt)}</p>
                </div>
                <dl className="divide-y divide-ink-50">
                  {Object.entries(QUESTIONNAIRE_QUESTIONS).map(([key, label]) => (
                    <div key={key} className="grid gap-1 px-5 py-3 sm:grid-cols-[1fr_1fr] sm:gap-4">
                      <dt className="text-sm text-ink-500">{label}</dt>
                      <dd className="text-sm font-medium text-ink-900">{formatQuestionnaireAnswer(key, answers)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
