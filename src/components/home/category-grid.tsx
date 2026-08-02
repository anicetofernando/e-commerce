import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CategoryNavData } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: CategoryNavData[] }) {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading title="Compre por Categoria" href="/loja" centered />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/loja?categoria=${c.slug}`}
              className="group flex flex-col items-center rounded-lg border border-ink-100 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-ink-900/5"
            >
              <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full bg-ink-50">
                {c.imageUrl && (
                  <Image src={c.imageUrl} alt={c.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <span className="text-sm font-semibold text-ink-900 group-hover:text-brand-600">{c.name}</span>
              <span className="mt-0.5 text-xs text-ink-400">{c.productCount} peças</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
