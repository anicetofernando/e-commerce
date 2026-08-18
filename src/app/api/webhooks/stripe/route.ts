import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates";
import { formatCurrency } from "@/lib/utils";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe não está configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura em falta." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[stripe webhook] Assinatura inválida:", error);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderNumber = session.metadata?.orderNumber;
    if (orderNumber) {
      const order = await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: "PAGO",
          status: "CONFIRMADA",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
        },
      });

      await sendEmail({
        to: order.customerEmail,
        subject: `Encomenda ${orderNumber} recebida`,
        html: orderConfirmationEmail({
          orderNumber,
          customerName: order.customerName,
          total: formatCurrency(Number(order.total)),
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
