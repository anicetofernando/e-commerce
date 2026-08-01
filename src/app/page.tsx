import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromoBanners } from "@/components/home/promo-banners";
import { BrandsStrip } from "@/components/home/brands-strip";
import { Testimonials } from "@/components/home/testimonials";
import { BlogPreview } from "@/components/home/blog-preview";
import { CtaBand } from "@/components/home/cta-band";
import { ProductTabs } from "@/components/home/product-tabs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  getNewProducts,
  getBlogPosts,
} from "@/lib/data";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured, popular, recent, posts, brands] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getPopularProducts(8),
    getNewProducts(8),
    getBlogPosts(3),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <Hero />
      <BrandsStrip brands={brands} />
      <CategoryGrid categories={categories} />

      {featured.length > 0 && (
        <section className="bg-ink-50/60 py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Selecionados"
              title="Produtos em Destaque"
              description="Peças mais procuradas pelas empresas de construção e mineração em Moçambique."
              href="/loja"
            />
            <div className="mt-8">
              <ProductTabs
                tabs={[
                  { key: "populares", label: "Mais Populares", products: popular },
                  { key: "destaques", label: "Destaques", products: featured },
                  { key: "novidades", label: "Novidades", products: recent },
                ]}
              />
            </div>
          </Container>
        </section>
      )}

      <PromoBanners />
      <Testimonials />
      <BlogPreview posts={posts} />
      <CtaBand />
    </>
  );
}
