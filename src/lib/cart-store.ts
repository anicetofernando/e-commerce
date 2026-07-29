"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  image: string;
  stockQuantity: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        const maxQty = item.stockQuantity;
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty || i.quantity + quantity) }
                : i,
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: Math.min(quantity, maxQty || quantity) }],
            isOpen: true,
          });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.stockQuantity || quantity) }
              : i,
          ),
        });
      },
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "albimaq-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, totalQuantity };
}
