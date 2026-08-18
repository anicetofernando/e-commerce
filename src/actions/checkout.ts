"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validation";
import { generateOrderNumber, formatCurrency } from "@/lib/utils";
import { DEFAULT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { evaluateCoupon, toCouponRecord } from "@/lib/coupon";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates";

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutSubmission = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  province: string;
  city: string;
  neighborhood: string;
  street: string;
  reference?: string;
  notes?: string;
  paymentMethod: string;
  couponCode?: string;
  items: CheckoutItemInput[];
};

export type CheckoutResult =
  | { success: true; orderNumber: string }
  | { success: false; message: string; errors?: Record<string, string[]> };

export async function placeOrder(input: CheckoutSubmission): Promise<CheckoutResult> {
  const validated = checkoutSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, message: "Verifique os dados do formulário.", errors: validated.error.flatten().fieldErrors };
  }

  if (!input.items?.length) {
    return { success: false, message: "O seu carrinho está vazio." };
  }

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

  if (products.length !== productIds.length) {
    return { success: false, message: "Um ou mais produtos do carrinho já não estão disponíveis." };
  }

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stockQuantity < item.quantity) {
      return {
        success: false,
        message: `Stock insuficiente para "${product?.name ?? "produto"}". Reveja o seu carrinho.`,
      };
    }
  }

  const subtotal = input.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  // The discount is always recomputed from the database here — the client
  // only ever supplies a coupon code, never a discount amount.
  const data = validated.data;
  let discountAmount = 0;
  let couponCode: string | null = null;
  if (data.couponCode) {
    const normalizedCode = data.couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } });
    const evaluation = evaluateCoupon(coupon ? toCouponRecord(coupon) : null, subtotal);
    if (!evaluation.valid) {
      return { success: false, message: evaluation.message };
    }
    discountAmount = evaluation.discountAmount;
    couponCode = normalizedCode;
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const total = Math.max(subtotal - discountAmount, 0) + shippingCost;

  const user = await getCurrentUser();
  const orderNumber = generateOrderNumber();

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        orderNumber,
        userId: user?.id,
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        province: data.province,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        reference: data.reference || null,
        notes: data.notes || null,
        couponCode,
        discountAmount,
        subtotal,
        shippingCost,
        total,
        items: {
          create: input.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              productSku: product.sku,
              unitPrice: product.price,
              quantity: item.quantity,
              lineTotal: Number(product.price) * item.quantity,
            };
          }),
        },
      },
    });

    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    if (couponCode) {
      await tx.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } });
    }
  });

  await sendEmail({
    to: data.customerEmail,
    subject: `Encomenda ${orderNumber} recebida`,
    html: orderConfirmationEmail({ orderNumber, customerName: data.customerName, total: formatCurrency(total) }),
  });

  return { success: true, orderNumber };
}
