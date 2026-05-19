"use client";
import { useState } from "react";
import {
  User,
  ShoppingCart,
  Zap,
  LogOut,
  LayoutDashboard,
  Home,
  LayoutGrid,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import AuthModal from "../shared/AuthModal";
import CartModal from "./CartModal";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useCartStore } from "@/src/store/useCartStore";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CartBadge = dynamic(() => import("./CartBadge"), {
  ssr: false,
});

export default function HeaderStore() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { openCart } = useCartStore();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-10">
            <Link href={"/"} className="flex items-center gap-2 group shrink-0">
              <Zap className="w-6 h-6 text-violet-600 group-hover:text-violet-500 transition-colors animate-pulse" />
              <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                ShopFlow
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-semibold transition-colors py-1.5 ${
                  isActive("/")
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Головна
              </Link>
              <Link
                href="/catalog"
                className={`text-sm font-semibold transition-colors py-1.5 ${
                  isActive("/catalog")
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Каталог
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-zinc-100/80 border border-zinc-200/40 rounded-full px-2 py-1.5 min-h-10 shadow-xs">
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
                  className="p-1.5 text-zinc-500 hover:text-red-600 transition-colors rounded-full hover:bg-white cursor-pointer"
                  aria-label="Вийти"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200 cursor-pointer"
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
              className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all duration-200 relative cursor-pointer"
              aria-label="Кошик"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <CartBadge />
            </button>
            {user?.role === "admin" && (
              <>
                <div className="w-px h-4 bg-zinc-200/80" />
                <Link
                  href={"/admin"}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors rounded-full"
                  aria-label="Панель керування"
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </Link>
              </>
            )}
          </div>
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:text-zinc-950 active:scale-90 transition-all duration-200 relative cursor-pointer"
              aria-label="Кошик"
            >
              <ShoppingCart className="w-5 h-5" />
              <CartBadge />
            </button>
            {user && (
              <button
                onClick={clearUser}
                className="p-2 bg-red-50 text-red-500 rounded-full active:scale-90 transition-all duration-200 cursor-pointer"
                aria-label="Вийти"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm bg-white/75 backdrop-blur-lg border border-zinc-200/50 rounded-full px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
            isActive("/") ? "text-violet-600 scale-110" : "text-zinc-500"
          }`}
          aria-label="Головна"
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
          aria-label="Каталог"
        >
          <LayoutGrid className="w-5 h-5" />
          {isActive("/catalog") && (
            <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
          )}
        </Link>
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center p-2 rounded-full text-zinc-500 active:scale-95 transition-transform relative cursor-pointer"
          aria-label="Кошик"
        >
          <ShoppingCart className="w-5 h-5" />
          <CartBadge />
        </button>
        {user ? (
          user.role === "admin" ? (
            <Link
              href="/admin"
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
                isActive("/admin")
                  ? "text-violet-600 scale-110"
                  : "text-zinc-500"
              }`}
              aria-label="Адмін панель"
            >
              <LayoutDashboard className="w-5 h-5" />
              {isActive("/admin") && (
                <span className="absolute bottom-0 w-1 h-1 bg-violet-600 rounded-full" />
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-1 bg-zinc-100 rounded-full px-2.5 py-1">
              <span className="text-[11px] font-extrabold text-zinc-700 truncate max-w-15">
                {user.name.split(" ")[0]}
              </span>
            </div>
          )
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-full text-zinc-500 active:scale-95 transition-transform cursor-pointer"
            aria-label="Увійти"
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
