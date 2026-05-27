"use client";
import { useState, useEffect } from "react";
import {
  User,
  ShoppingCart,
  Zap,
  LogOut,
  Home,
  LayoutGrid,
  LogIn,
  User2,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import AuthModal from "@/src/modules/users/components/AuthModal";
import CartModal from "@/src/modules/layout/store/components/CartDraw";
import { useAuthStore } from "@/src/modules/users/store/useAuthStore";
import { useCartStore } from "@/src/modules/layout/shared/store/useCartStore";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CartBadge = dynamic(
  () => import("@/src/modules/layout/store/components/CartBadge"),
  {
    ssr: false,
  },
);

export default function HeaderStore() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { openCart } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center gap-2 group shrink-0">
              <Zap className="w-6 h-6 text-violet-600 group-hover:text-violet-500 transition-colors animate-pulse" />
              <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                ShopFlow/
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isMounted && user && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-sm border border-emerald-200/60 shadow-xs cursor-default transition-all hover:bg-emerald-100/50 hover:border-emerald-300/50">
                <Wallet className="w-4 h-4" />
                {user.balance.toLocaleString()} ₴
              </div>
            )}

            <div className="flex items-center gap-1 bg-zinc-100/80 border border-zinc-200 rounded-full px-2 min-h-10 shadow-xs">
              {isMounted && user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-violet-700 p-2 rounded-full hover:bg-white transition-all duration-200 cursor-pointer"
                  >
                    <User2 className="w-4 h-4" />
                  </Link>
                  <div className="w-px h-5 bg-zinc-200 mx-1" />
                  <button
                    type="button"
                    onClick={clearUser}
                    className="p-2 text-zinc-500 hover:text-red-600 transition-colors rounded-full hover:bg-white cursor-pointer"
                    aria-label="Вийти"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200 cursor-pointer"
                  aria-label="Увійти або зареєструватися"
                  type="button"
                >
                  <User className="w-4.5 h-4.5" />
                </button>
              )}
              <div className="w-px h-5 bg-zinc-200 mx-1" />
              <button
                type="button"
                onClick={openCart}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200 relative cursor-pointer"
                aria-label="Кошик"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <CartBadge />
              </button>
              <div className="w-px h-5 bg-zinc-200 mx-1" />
              <Link
                href={"/admin"}
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors rounded-full"
              >
                <Home className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button
              aria-label="Кошик"
              type="button"
              onClick={openCart}
              className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:text-zinc-950 active:scale-90 transition-all duration-200 relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              <CartBadge />
            </button>
            {isMounted && user && (
              <button
                aria-label="Вийти"
                type="button"
                onClick={clearUser}
                className="p-2 bg-red-50 text-red-500 rounded-full active:scale-90 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="hidden md:block w-full border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto h-10 flex items-center justify-start gap-12">
          <Link
            href="/catalog"
            className={`text-sm font-semibold transition-all duration-200 h-full flex items-center border-b-2 px-1 -mb-px ${
              isActive("/catalog")
                ? "text-violet-600 border-violet-600 font-bold"
                : "text-zinc-500 hover:text-zinc-900 border-transparent"
            }`}
          >
            Каталог
          </Link>
        </div>
      </div>

      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[85%] max-w-72 bg-white/75 backdrop-blur-lg border border-zinc-200/50 rounded-full px-4 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
            isActive("/") ? "text-violet-600 scale-110" : "text-zinc-500"
          }`}
        >
          <Home className="w-5 h-5" />
          {isActive("/") && (
            <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
          )}
        </Link>

        <Link
          href="/catalog"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
            isActive("/catalog") ? "text-violet-600 scale-110" : "text-zinc-500"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          {isActive("/catalog") && (
            <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
          )}
        </Link>

        <button
          aria-label="Кошик"
          onClick={openCart}
          className="flex flex-col items-center justify-center p-2 rounded-full text-zinc-500 active:scale-95 transition-transform relative cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          <CartBadge />
        </button>

        {isMounted && user ? (
          user.role === "admin" ? (
            <Link
              href="/admin"
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
                isActive("/admin")
                  ? "text-violet-600 scale-110"
                  : "text-zinc-500"
              }`}
            >
              <Home className="w-5 h-5" />
              {isActive("/admin") && (
                <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
              )}
            </Link>
          ) : (
            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
                isActive("/profile")
                  ? "text-violet-600 scale-110"
                  : "text-violet-600 bg-violet-50/80"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-pulse" />
              {isActive("/profile") && (
                <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
              )}
            </Link>
          )
        ) : (
          <button
            type="button"
            aria-label="Увійти"
            onClick={() => setIsAuthOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-full text-zinc-500 active:scale-95 transition-transform cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartModal />
    </>
  );
}
