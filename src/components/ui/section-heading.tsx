import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "Ver tudo",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-bold tracking-widest text-brand-600 uppercase">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-600">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {hrefLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
