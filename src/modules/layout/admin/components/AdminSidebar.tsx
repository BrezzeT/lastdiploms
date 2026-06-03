"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Zap } from "lucide-react";
import { ADMIN_MENU_ITEMS } from "@/src/modules/shared/constants";
import { useAdminStore } from "@/src/modules/shared/store/useAdminStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useAdminStore();

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0b0c10] border-r border-zinc-800/40 transition-all duration-300 flex flex-col z-50
        ${isOpen ? "w-20" : "w-64"}
        max-lg:fixed max-lg:top-16 max-lg:left-0 max-lg:w-full max-lg:h-[calc(100vh-64px)]
        ${isOpen ? "max-lg:translate-x-0 max-lg:visible" : "max-lg:-translate-x-full max-lg:invisible max-lg:pointer-events-none"}
      `}
    >
      <div
        className={`h-16 flex items-center border-b border-zinc-800/40 overflow-hidden transition-all max-lg:hidden ${
          isOpen ? "justify-center px-0" : "px-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isOpen && (
            <span className="font-bold text-lg tracking-tight  whitespace-nowrap bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              ShopFlow
            </span>
          )}
        </Link>
      </div>

      <div
        className={`px-4 mb-1 mt-6 max-lg:px-8 ${isOpen ? "lg:hidden" : "block"}`}
      >
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          Навігація
        </span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1.5">
        {ADMIN_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center transition-all duration-200 group rounded-2xl ${
                isOpen
                  ? "lg:justify-center lg:w-12 lg:h-12 lg:mx-auto lg:px-0 justify-start px-6 py-4 lg:py-0 gap-4"
                  : "px-4 py-3.5 gap-3.5"
              } ${
                isActive
                  ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-600/15"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 transition-colors"}`}
              />
              <span
                className={`text-sm max-lg:text-base font-semibold whitespace-nowrap ${
                  isOpen ? "lg:hidden block" : "block"
                }`}
              >
                {item.label}
              </span>
              {isActive && !isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] lg:block hidden animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800/40">
        <Link
          href="/"
          className={`flex items-center transition-all duration-200 group rounded-2xl ${
            isOpen
              ? "lg:justify-center lg:w-12 lg:h-12 lg:mx-auto lg:px-0 justify-start px-6 py-4 lg:py-0 gap-4"
              : "px-4 py-3 gap-3.5"
          } text-zinc-400 hover:text-red-400 hover:bg-red-500/10`}
        >
          <LogOut className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span
            className={`text-sm font-semibold max-lg:text-base ${isOpen ? "lg:hidden" : "block"}`}
          >
            Вихід
          </span>
        </Link>
      </div>
    </aside>
  );
}
