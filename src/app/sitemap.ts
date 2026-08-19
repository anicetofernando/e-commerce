import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/email";

// Generated on request, not at build time: the local dev DB (and the build
// environment) isn't guaranteed to be reachable when the build runs.
export const dynamic = "force-dynamic";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/loja", changeFrequency: "daily", priority: 0.9 },
  { path: "/marcas", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/servicos", changeFrequency: "monthly", priority: 0.5 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.4 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.3 },
  { path: "/consulta-negocio", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Run sequentially: the local dev database (PGlite) only handles one
  // connection at a time (see PG_POOL_MAX in README), so concurrent queries
  // here would race for the single connection and fail.
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  const blogPosts = await prisma.blogPost.findMany({
    select: { slug: true, publishedAt: true },
  });

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${siteUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/loja?categoria=${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/produto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
