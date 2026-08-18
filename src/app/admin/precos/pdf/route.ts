import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPricingTableOverrides } from "@/lib/admin-data";
import { generatePricingPdf } from "@/lib/pricing-pdf";

export const dynamic = "force-dynamic";

const SHARED_DIESEL_ORIG = "30";

export async function GET() {
  await requireAdmin();

  const overrides = await getPricingTableOverrides();
  const sharedDiesel = overrides["shared-diesel"] ?? SHARED_DIESEL_ORIG;
  const sharedFx = overrides["shared-fx"] ?? "";

  const pdfBytes = await generatePricingPdf(overrides, sharedDiesel, SHARED_DIESEL_ORIG, sharedFx);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="tabela-precos-albimaq.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
