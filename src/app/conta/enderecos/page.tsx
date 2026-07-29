import type { Metadata } from "next";
import { Star, Trash2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { removeAddress, setDefaultAddress } from "@/actions/account";
import { AddressForm } from "@/components/account/address-form";
import { Badge } from "@/components/ui/badge";
import { PROVINCE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Os Meus Endereços" };
export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await requireUser();
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-ink-900">Os Meus Endereços</h1>

        {addresses.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
            Ainda não tem endereços guardados.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-lg border border-ink-100 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-ink-900">{addr.label}</p>
                  {addr.isDefault && <Badge tone="brand">Principal</Badge>}
                </div>
                <p className="text-sm text-ink-600">{addr.recipientName}</p>
                <p className="text-sm text-ink-600">{addr.phone}</p>
                <p className="text-sm text-ink-600">
                  {addr.street}, {addr.neighborhood}, {addr.city}, {PROVINCE_LABELS[addr.province]}
                </p>

                <div className="mt-3 flex gap-3">
                  {!addr.isDefault && (
                    <form action={setDefaultAddress.bind(null, addr.id)}>
                      <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
                        <Star size={13} /> Tornar principal
                      </button>
                    </form>
                  )}
                  <form action={removeAddress.bind(null, addr.id)}>
                    <button type="submit" className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline">
                      <Trash2 size={13} /> Remover
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-ink-900">Adicionar Novo Endereço</h2>
        <AddressForm />
      </div>
    </div>
  );
}
