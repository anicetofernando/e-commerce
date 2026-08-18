import type { Metadata } from "next";
import { getCategories, getBrandsWithModels } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/actions/admin-products";

export const metadata: Metadata = { title: "Novo Produto — Admin" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrandsWithModels()]);

  return (
    <div>
      <AdminPageHeader title="Novo Produto" description="Adicione um novo produto ao catálogo." />
      <ProductForm action={createProduct} categories={categories} brands={brands} />
    </div>
  );
}
