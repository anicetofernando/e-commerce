import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data";

export async function CtaBand() {
  const settings = await getSiteSettings();

  return (
    <section
      className="bg-cover bg-center py-14"
      style={{ backgroundImage: "url('/images/hero/cta-band.svg')" }}
    >
      <Container className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Não encontrou a peça que procura?</h2>
          <p className="mt-2 max-w-xl text-sm text-ink-300">
            A nossa equipa técnica ajuda-o a identificar a referência correta a partir do número de série da
            sua máquina ou de uma peça danificada.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-3">
          <Button href="/contacto" size="lg">
            <MessageCircle size={17} />
            Falar com a Equipa
          </Button>
          <Button
            href={`tel:${settings.phonePrimary}`}
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:border-brand-400 hover:text-brand-400"
          >
            <Phone size={17} />
            {settings.phonePrimary}
          </Button>
        </div>
      </Container>
    </section>
  );
}
