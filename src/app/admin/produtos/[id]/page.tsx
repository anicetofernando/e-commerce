import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/admin-data";
import { getCategories, getBrandsWithModels } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/actions/admin-products";

export const metadata: Metadata = { title: "Editar Produto — Admin" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
    getBrandsWithModels(),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <AdminPageHeader title={product.name} description={`SKU: ${product.sku}`} />
      <ProductForm
        action={boundUpdate}
        categories={categories}
        brands={brands}
        product={{
          ...product,
          compatibility: product.compatibility.map((c) => ({ machineModelId: c.machineModelId })),
        }}
      />
    </div>
  );
}
