import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { logout } from "@/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const [messages, reviews] = await Promise.all([
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  return (
    <div className="flex h-screen bg-ink-50/60">
      <AdminSidebar counts={{ messages, reviews }} />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-ink-100 bg-white px-6">
          <span className="text-sm text-ink-600">
            Sessão de <span className="font-semibold text-ink-900">{admin.name}</span>
          </span>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-ink-500 hover:text-brand-600">
              Sair
            </button>
          </form>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
