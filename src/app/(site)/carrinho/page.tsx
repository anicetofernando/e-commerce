import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = { title: "Carrinho de Compras" };

export default function CarrinhoPage() {
  return <CartPageClient />;
}
