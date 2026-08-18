import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Contacto" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="bg-ink-900 py-14">
        <Container>
          <p className="mb-2 text-xs font-bold tracking-widest text-brand-400 uppercase">Fale Connosco</p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Entre em Contacto</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-300">
            Tem dúvidas sobre compatibilidade de uma peça ou precisa de um orçamento? A nossa equipa técnica
            está pronta para ajudar.
          </p>
        </Container>
      </div>

      <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-ink-100 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-ink-900">Envie-nos uma Mensagem</h2>
          <ContactForm />
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-ink-100 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-ink-900">Informações de Contacto</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span className="text-ink-600">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-brand-600" />
                <a href={`tel:${settings.phonePrimary}`} className="text-ink-600 hover:text-brand-600">
                  {settings.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-brand-600" />
                <a href={`mailto:${settings.email}`} className="text-ink-600 hover:text-brand-600">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span className="text-ink-600">{settings.hours}</span>
              </li>
            </ul>
          </div>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-5 text-green-700 hover:bg-green-100"
          >
            <MessageCircle size={24} />
            <div>
              <p className="text-sm font-bold">Fale connosco no WhatsApp</p>
              <p className="text-xs">Resposta rápida para dúvidas sobre peças</p>
            </div>
          </a>
        </div>
      </Container>
    </div>
  );
}
