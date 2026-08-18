import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/actions/auth";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Confirmar Email" };
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await verifyEmail(token);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {result.success ? (
        <CheckCircle2 size={48} className="text-green-600" />
      ) : (
        <XCircle size={48} className="text-red-600" />
      )}
      <h1 className="mt-4 text-xl font-bold text-ink-900">{result.message}</h1>
      <Button href="/conta" className="mt-6">
        Ir para a Minha Conta
      </Button>
      {!result.success && (
        <p className="mt-3 text-sm text-ink-500">
          Pode <Link href="/conta" className="font-semibold text-brand-600 hover:underline">reenviar o email de confirmação</Link> a partir da sua conta.
        </p>
      )}
    </Container>
  );
}
