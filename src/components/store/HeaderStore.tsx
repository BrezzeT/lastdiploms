"use client";
import { useState } from "react";
import { User, ShoppingCart, Zap, LogOut, Home } from "lucide-react";
import Link from "next/link";
import AuthModal from "../shared/AuthModal";
import CartModal from "./CartModal";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useCartStore } from "@/src/store/useCartStore";
import dynamic from "next/dynamic";

const CartBadge = dynamic(() => import("./CartBadge"), {
  ssr: false,
});
export default function HeaderStore() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { openCart } = useCartStore();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center gap-2 group shrink-0">
              <Zap className="w-6 h-6 text-violet-600 group-hover:text-violet-500 transition-colors animate-pulse" />
              <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                ShopFlow
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100/80 border border-zinc-200/40 rounded-full px-2 py-1.5 min-h-10 shadow-xs">
            <>
              {user ? (
                <>
                  <div className="flex flex-col items-start px-2">
                    <span className="text-sm font-bold text-zinc-800 truncate max-w-25">
                      {user.name}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-zinc-200/80" />
                  <button
                    type="button"
                    onClick={clearUser}
                    className="p-1.5 text-zinc-500 hover:text-red-600 transition-colors rounded-full hover:bg-white"
                    aria-label="Вийти"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200"
                  aria-label="Увійти або зареєструватися"
                  type="button"
                >
                  <User className="w-4.5 h-4.5" />
                </button>
              )}
              <div className="w-px h-4 bg-zinc-200/80" />
              <button
                type="button"
                onClick={openCart}
                className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200 relative"
                aria-label="Кошик"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <CartBadge />
              </button>
              <div className="w-px h-4 bg-zinc-200/80" />
              <Link
                href={"/admin"}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors rounded-full"
              >
                <Home className="w-4.5 h-4.5" />
              </Link>
            </>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartModal />
    </>
  );
}
