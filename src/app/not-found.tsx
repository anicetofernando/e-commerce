import { PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <PackageSearch size={56} className="text-brand-300" />
      <h1 className="text-4xl font-black text-ink-900">404</h1>
      <p className="max-w-sm text-sm text-ink-500">
        Não encontrámos a página ou peça que procura. Pode ter sido removida ou o endereço está incorreto.
      </p>
      <div className="mt-2 flex gap-3">
        <Button href="/">Voltar ao Início</Button>
        <Button href="/loja" variant="outline">Ver Catálogo</Button>
      </div>
    </Container>
  );
}
