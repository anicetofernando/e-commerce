import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Finalizar Compra" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  const addresses = user
    ? await prisma.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: "desc" } })
    : [];

  return (
    <Container className="py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">Finalizar Compra</h1>
      <CheckoutForm
        defaultName={user?.name}
        defaultEmail={user?.email}
        defaultPhone={user?.phone ?? undefined}
        addresses={addresses}
      />
    </Container>
  );
}
