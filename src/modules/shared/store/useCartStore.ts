import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/src/modules/shared/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (newItem) => {
        const existing = get().items.find(
          (i) => i.productId === newItem.productId,
        );
        if (existing) {
          const newQuantity = Math.min(
            existing.quantity + newItem.quantity,
            newItem.stock,
          );
          set({
            items: get().items.map((i) =>
              i.productId === newItem.productId
                ? { ...i, quantity: newQuantity }
                : i,
            ),
          });
        } else {
          const limitedItem = {
            ...newItem,
            quantity: Math.min(newItem.quantity, newItem.stock),
          };
          set({ items: [...get().items, limitedItem] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        } else {
          set({
            items: get().items.map((i) => {
              if (i.productId === productId) {
                return { ...i, quantity: Math.min(quantity, i.stock) };
              }
              return i;
            }),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
