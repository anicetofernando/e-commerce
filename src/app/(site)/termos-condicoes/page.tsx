import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Termos e Condições" };
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="max-w-3xl py-14">
      <h1 className="text-3xl font-black text-ink-900">Termos e Condições</h1>
      <p className="mt-2 text-sm text-ink-500">Última atualização: julho de 2026</p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">1. Introdução</h2>
          <p>
            Estes Termos e Condições regulam o acesso e utilização do site da Albimaq Peças ({settings.companyName}),
            incluindo a compra de produtos através da nossa loja online. Ao aceder ou efetuar uma compra no
            nosso site, o utilizador aceita integralmente estes termos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">2. Produtos e Disponibilidade</h2>
          <p>
            Fazemos todos os esforços para garantir que a descrição, especificações e disponibilidade dos
            produtos apresentados são exatas. No entanto, a disponibilidade de stock pode variar e será
            confirmada pela nossa equipa após a submissão da encomenda.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">3. Compatibilidade das Peças</h2>
          <p>
            As indicações de compatibilidade (marca, modelo, número OEM e referências cruzadas) têm caráter
            informativo, baseado nos dados disponíveis dos fabricantes. Recomendamos a confirmação com a
            nossa equipa técnica antes da compra em casos de dúvida, através do número de série da máquina.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">4. Preços e Pagamento</h2>
          <p>
            Todos os preços apresentados estão expressos em Meticais (MZN) e podem ser alterados sem aviso
            prévio. O pagamento pode ser efetuado por transferência bancária, M-Pesa, e-Mola, numerário na
            entrega ou cartão internacional de débito/crédito, conforme disponibilidade e confirmação da
            encomenda. O pagamento por cartão internacional é processado em USD, à taxa de câmbio em vigor.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">5. Entregas</h2>
          <p>
            Realizamos entregas em todo o território de Moçambique. Os prazos de entrega apresentados são
            estimativas e podem variar consoante a localização, disponibilidade de stock e condições
            logísticas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">6. Trocas, Devoluções e Garantia</h2>
          <p>
            Aceitamos pedidos de troca até 7 dias após a receção do produto, desde que este se encontre na
            embalagem original e sem sinais de uso ou instalação. Peças com defeito de fabrico estão cobertas
            pela garantia indicada na respetiva página do produto.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">7. Conta de Utilizador</h2>
          <p>
            O utilizador é responsável por manter a confidencialidade das credenciais da sua conta e por
            todas as atividades realizadas através dela.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">8. Lei Aplicável</h2>
          <p>
            Estes Termos e Condições regem-se pela legislação da República de Moçambique. Quaisquer litígios
            serão submetidos aos tribunais competentes moçambicanos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">9. Contactos</h2>
          <p>
            Para questões relacionadas com estes Termos e Condições, contacte-nos através de{" "}
            <a href={`mailto:${settings.email}`} className="text-brand-600 hover:underline">{settings.email}</a>.
          </p>
        </section>
      </div>
    </Container>
  );
}
