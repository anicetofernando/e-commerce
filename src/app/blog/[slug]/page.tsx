import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getBlogPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container className="max-w-2xl py-12">
      <Link href="/blog" className="mb-6 flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600">
        <ChevronLeft size={16} /> Voltar ao blog
      </Link>

      <p className="text-xs text-ink-400">{formatDate(post.publishedAt)} · {post.author}</p>
      <h1 className="mt-2 text-2xl font-black text-ink-900 sm:text-3xl">{post.title}</h1>

      <div className="relative my-8 aspect-video overflow-hidden rounded-lg bg-ink-50">
        <Image src={post.coverImageUrl} alt={post.title} fill sizes="700px" className="object-contain p-12" />
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-ink-700">
        <p>{post.content}</p>
      </div>
    </Container>
  );
}
