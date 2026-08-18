import type { Metadata } from "next";
import Link from "next/link";
import { getAdminReviews } from "@/lib/admin-data";
import { formatDate, cn } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Pagination } from "@/components/ui/pagination";
import { ReviewRowActions } from "@/components/admin/review-row-actions";

export const metadata: Metadata = { title: "Avaliações — Admin" };
export const dynamic = "force-dynamic";

const TABS = [
  { value: undefined, label: "Todas" },
  { value: "pendentes", label: "Pendentes" },
  { value: "aprovadas", label: "Aprovadas" },
] as const;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "pendentes" | "aprovadas"; pagina?: string }>;
}) {
  const params = await searchParams;
  const { reviews, total, page, totalPages } = await getAdminReviews({
    status: params.status,
    page: params.pagina ? Number(params.pagina) : 1,
  });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (params.status) sp.set("status", params.status);
    sp.set("pagina", String(p));
    return `/admin/avaliacoes?${sp.toString()}`;
  }

  return (
    <div>
      <AdminPageHeader title="Avaliações" description={`${total} avaliação${total === 1 ? "" : "ões"} no total.`} />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/avaliacoes?status=${tab.value}` : "/admin/avaliacoes"}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium",
              params.status === tab.value ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-white py-16 text-center text-sm text-ink-500">
            Nenhuma avaliação encontrada.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-ink-100 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} size={14} />
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        review.isApproved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {review.isApproved ? "Aprovada" : "Pendente"}
                    </span>
                  </div>
                  <p className="mt-1.5 font-semibold text-ink-900">{review.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{review.comment}</p>
                  <p className="mt-2 text-xs text-ink-400">
                    {review.user.name} ({review.user.email}) em{" "}
                    <Link href={`/produto/${review.product.slug}`} className="font-medium text-brand-600 hover:text-brand-700">
                      {review.product.name}
                    </Link>{" "}
                    · {formatDate(review.createdAt)}
                  </p>
                </div>
                <ReviewRowActions id={review.id} isApproved={review.isApproved} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
