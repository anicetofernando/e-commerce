"use client";

import { useActionState } from "react";
import { Select, Input, Label, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateOrderStatus } from "@/actions/admin-orders";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";

export function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
  trackingNumber,
  carrier,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
  trackingNumber?: string | null;
  carrier?: string | null;
}) {
  const boundAction = updateOrderStatus.bind(null, orderId);
  const [state, formAction] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <FormAlert message={state?.message} tone={state?.errors ? "error" : "success"} />
      <div>
        <Label>Estado da Encomenda</Label>
        <Select name="status" defaultValue={status}>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Estado do Pagamento</Label>
        <Select name="paymentStatus" defaultValue={paymentStatus}>
          {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Transportadora (opcional)</Label>
        <Input name="carrier" defaultValue={carrier ?? ""} placeholder="ex: DHL, TNT..." />
      </div>
      <div>
        <Label>Número de Rastreio (opcional)</Label>
        <Input name="trackingNumber" defaultValue={trackingNumber ?? ""} />
      </div>
      <SubmitButton className="w-full">Guardar</SubmitButton>
    </form>
  );
}
