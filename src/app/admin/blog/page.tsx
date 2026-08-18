import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminBlogPosts } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { BlogRowActions } from "@/components/admin/blog-row-actions";

export const metadata: Metadata = { title: "Blog — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div>
      <AdminPageHeader
        title="Blog Técnico"
        description={`${posts.length} artigo${posts.length === 1 ? "" : "s"} publicado${posts.length === 1 ? "" : "s"}.`}
        action={
          <Button href="/admin/blog/novo">
            <Plus size={16} /> Novo Artigo
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-500">Nenhum artigo publicado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50/60">
                <tr className="text-xs text-ink-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Autor</th>
                  <th className="px-4 py-3 font-semibold">Publicado em</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-ink-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/blog/${post.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{post.author}</td>
                    <td className="px-4 py-3 text-ink-500">{formatDate(post.publishedAt)}</td>
                    <td className="px-4 py-3">
                      <BlogRowActions id={post.id} title={post.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
