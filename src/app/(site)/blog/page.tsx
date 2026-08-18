import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog Técnico" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="bg-ink-900 py-14">
        <Container>
          <h1 className="text-3xl font-black text-white">Blog Técnico</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-300">
            Dicas de manutenção, guias de compatibilidade e boas práticas para equipamento pesado.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-lg border border-ink-100 bg-white transition-shadow hover:shadow-lg hover:shadow-ink-900/5"
            >
              <div className="relative aspect-video bg-ink-50">
                <Image src={post.coverImageUrl} alt={post.title} fill sizes="360px" className="object-contain p-8" />
              </div>
              <div className="p-5">
                <p className="text-xs text-ink-400">{formatDate(post.publishedAt)} · {post.author}</p>
                <h2 className="mt-1.5 line-clamp-2 text-base font-bold text-ink-900 group-hover:text-brand-600">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-500">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
