import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Política de Privacidade" };
export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="max-w-3xl py-14">
      <h1 className="text-3xl font-black text-ink-900">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-ink-500">Última atualização: julho de 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-600">
        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">1. Dados que Recolhemos</h2>
          <p>
            Recolhemos os dados fornecidos diretamente por si ao criar uma conta, efetuar uma encomenda ou
            submeter um formulário de contacto: nome, email, telefone, endereço de entrega e, quando
            aplicável, dados da empresa (NUIT).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">2. Finalidade do Tratamento</h2>
          <p>
            Utilizamos os seus dados para processar encomendas, gerir a sua conta, prestar apoio ao cliente,
            confirmar compatibilidade de peças e, com o seu consentimento, enviar comunicações comerciais
            através da newsletter.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">3. Partilha de Dados</h2>
          <p>
            Não vendemos os seus dados pessoais a terceiros. Os dados podem ser partilhados com parceiros
            logísticos exclusivamente para efeitos de entrega da sua encomenda.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">4. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra
            acesso não autorizado, perda ou divulgação indevida, incluindo encriptação de palavras-passe.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">5. Os Seus Direitos</h2>
          <p>
            Pode solicitar a qualquer momento o acesso, retificação ou eliminação dos seus dados pessoais,
            bem como retirar o consentimento para comunicações de marketing, contactando-nos através de{" "}
            <a href={`mailto:${settings.email}`} className="text-brand-600 hover:underline">{settings.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">6. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site, nomeadamente para manter a sessão da
            sua conta e o conteúdo do carrinho de compras.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-ink-900">7. Alterações a Esta Política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos a consulta regular desta página
            para se manter informado sobre eventuais alterações.
          </p>
        </section>
      </div>
    </Container>
  );
}
