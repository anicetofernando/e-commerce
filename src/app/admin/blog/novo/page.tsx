import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createBlogPost } from "@/actions/admin-blog";

export const metadata: Metadata = { title: "Novo Artigo — Admin" };

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader title="Novo Artigo" description="Publique um novo artigo no blog técnico." />
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
