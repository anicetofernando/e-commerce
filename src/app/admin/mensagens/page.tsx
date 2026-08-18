import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMessages } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Pagination } from "@/components/ui/pagination";
import { MessageRow } from "@/components/admin/message-row";

export const metadata: Metadata = { title: "Mensagens — Admin" };
export const dynamic = "force-dynamic";

const TABS = [
  { value: undefined, label: "Todas" },
  { value: "nao-lidas", label: "Não Lidas" },
  { value: "lidas", label: "Lidas" },
] as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "nao-lidas" | "lidas"; pagina?: string }>;
}) {
  const params = await searchParams;
  const { messages, total, page, totalPages } = await getAdminMessages({
    status: params.status,
    page: params.pagina ? Number(params.pagina) : 1,
  });

  return (
    <div>
      <AdminPageHeader title="Mensagens de Contacto" description={`${total} mensagem${total === 1 ? "" : "ns"} no total.`} />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/mensagens?status=${tab.value}` : "/admin/mensagens"}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium",
              params.status === tab.value ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-white py-16 text-center text-sm text-ink-500">Nenhuma mensagem encontrada.</p>
        ) : (
          messages.map((m) => <MessageRow key={m.id} message={m} />)
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} buildHref={(p) => `/admin/mensagens?pagina=${p}${params.status ? `&status=${params.status}` : ""}`} />
      </div>
    </div>
  );
}
