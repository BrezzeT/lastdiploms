"use client";

import { useCartStore } from "@/src/store/useCartStore";

export const CartBadge = () => {
  const { getTotalItems } = useCartStore();
  const count = getTotalItems();

  if (count === 0) return null;

  return (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 rounded-full text-[9px] font-black text-white flex items-center justify-center">
      {count}
    </span>
  );
};

export default CartBadge;
