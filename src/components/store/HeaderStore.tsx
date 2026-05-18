"use client";
import { useState, useEffect } from "react";
import { User, ShoppingCart, Zap, LogOut, Home } from "lucide-react";
import Link from "next/link";
import AuthModal from "../shared/AuthModal";
import CartModal from "./CartModal";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useCartStore } from "@/src/store/useCartStore";
import { getUserBalance } from "@/src/lib/actions/user.actions";
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
      <header className="sticky top-0 z-50 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <Link href={"/"} className="flex items-center gap-2 group">
              <Zap className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
              <div className="text-xl font-semibold text-white group-hover:text-white/80 transition-colors">
                ShopFlow
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-1 bg-zinc-950/40 border border-white/5 rounded-2xl px-2 py-1.5 min-h-10">
            <>
              {user ? (
                <>
                  <div className="flex flex-col items-start px-2">
                    <span className="text-md font-bold text-white truncate max-w-25">
                      {user.name}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <button
                    type="button"
                    onClick={clearUser}
                    className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors rounded-lg"
                    aria-label="Вийти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-all"
                  aria-label="Увійти або зареєструватися"
                  type="button"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
              <div className="w-px h-4 bg-white/10" />
              <button
                type="button"
                onClick={openCart}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-all relative"
                aria-label="Кошик"
              >
                <ShoppingCart className="w-5 h-5" />
                <CartBadge />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <Link
                href={"/admin"}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg"
              >
                <Home className="w-5 h-5" />
              </Link>
            </>
          </div>
        </div>
      </header>

      <nav className="bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-2">
          <Link
            href="/catalog"
            className="px-3 py-1 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            Каталог
          </Link>
          <Link
            href="/catalog?new=true"
            className="px-3 py-1 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            Новинки
          </Link>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartModal />
    </>
  );
}
