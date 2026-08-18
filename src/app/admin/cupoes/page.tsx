import type { Metadata } from "next";
import { getAdminCoupons } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CouponManager } from "@/components/admin/coupon-manager";

export const metadata: Metadata = { title: "Cupões — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div>
      <AdminPageHeader title="Cupões de Desconto" description="Códigos promocionais aplicáveis no checkout." />
      <CouponManager coupons={coupons} />
    </div>
  );
}
