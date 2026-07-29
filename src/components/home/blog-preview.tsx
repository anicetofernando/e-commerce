import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/generated/prisma/client";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Blog Técnico" title="Dicas e Manutenção" href="/blog" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
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
                <p className="text-xs text-ink-400">{formatDate(post.publishedAt)}</p>
                <h3 className="mt-1.5 line-clamp-2 text-base font-bold text-ink-900 group-hover:text-brand-600">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
