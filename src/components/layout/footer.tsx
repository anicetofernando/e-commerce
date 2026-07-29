import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getCategories } from "@/lib/data";
import { CONTACT_INFO } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/layout/social-icons";

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-ink-900 text-ink-300">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
            A Albimaq Peças fornece peças originais e alternativas de alta qualidade para máquinas de
            construção, movimentação de terras e equipamento industrial em todo Moçambique.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-brand-600 hover:text-white">
              <FacebookIcon size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-brand-600 hover:text-white">
              <InstagramIcon size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-brand-600 hover:text-white">
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-white uppercase">Institucional</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/sobre" className="hover:text-brand-400">Sobre Nós</Link></li>
            <li><Link href="/contacto" className="hover:text-brand-400">Contacto</Link></li>
            <li><Link href="/blog" className="hover:text-brand-400">Blog Técnico</Link></li>
            <li><Link href="/faq" className="hover:text-brand-400">Perguntas Frequentes</Link></li>
            <li><Link href="/termos-condicoes" className="hover:text-brand-400">Termos e Condições</Link></li>
            <li><Link href="/politica-privacidade" className="hover:text-brand-400">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-white uppercase">Categorias</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/loja?categoria=${c.slug}`} className="hover:text-brand-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-white uppercase">Contactos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-brand-500" />
              <a href={`tel:${CONTACT_INFO.phonePrimary}`} className="hover:text-brand-400">{CONTACT_INFO.phonePrimary}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-brand-500" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-400">{CONTACT_INFO.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <span>{CONTACT_INFO.hours}</span>
            </li>
          </ul>

          <h3 className="mt-6 mb-3 text-sm font-bold tracking-wide text-white uppercase">Newsletter</h3>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Albimaq, Lda. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-2">
            {["M-Pesa", "e-Mola", "Transferência Bancária", "Numerário na Entrega"].map((m) => (
              <span key={m} className="rounded border border-white/10 bg-white/5 px-2 py-1">
                {m}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
