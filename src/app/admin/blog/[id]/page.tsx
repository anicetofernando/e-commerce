import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminBlogPostById } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { updateBlogPost } from "@/actions/admin-blog";

export const metadata: Metadata = { title: "Editar Artigo — Admin" };
export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminBlogPostById(id);
  if (!post) notFound();

  const boundUpdate = updateBlogPost.bind(null, id);

  return (
    <div>
      <AdminPageHeader title={post.title} description="Editar artigo do blog." />
      <BlogPostForm action={boundUpdate} post={post} />
    </div>
  );
}
