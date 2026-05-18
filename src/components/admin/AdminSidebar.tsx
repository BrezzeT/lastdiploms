"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Zap } from "lucide-react";
import { ADMIN_MENU_ITEMS } from "@/src/constants/admin";
import { useAdminStore } from "@/src/store/useAdminStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useAdminStore();

  return (
    <aside
      className={`h-screen sticky top-0 bg-black border-r border-white/5 transition-all duration-300 flex flex-col z-50
        ${isOpen ? "w-20" : "w-64"}
        max-lg:fixed max-lg:top-16 max-lg:left-0 max-lg:w-full max-lg:h-[calc(100vh-64px)]
        ${isOpen ? "max-lg:translate-x-0 max-lg:visible" : "max-lg:-translate-x-full max-lg:invisible max-lg:pointer-events-none"}
      `}
    >
      <div
        className={`h-16 flex items-center border-b border-white/5 overflow-hidden transition-all max-lg:hidden ${
          isOpen ? "justify-center px-0" : "px-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isOpen && (
            <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
              ShopFlow
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 mt-4">
        {ADMIN_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`flex items-center transition-all group rounded-xl py-3 max-lg:py-4 ${
                isOpen
                  ? "lg:justify-center lg:px-0 justify-start px-6 gap-4"
                  : "px-3 gap-3"
              } ${
                isActive
                  ? "bg-violet-600/10 text-violet-400"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${isActive ? "text-violet-400" : "group-hover:text-white"}`}
              />
              <span
                className={`text-sm max-lg:text-base font-medium whitespace-nowrap ${
                  isOpen ? "lg:hidden block" : "block"
                }`}
              >
                {item.label}
              </span>
              {isActive && !isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6] lg:block hidden" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <Link
          href="/"
          className={`flex items-center transition-all group rounded-xl py-2.5 ${
            isOpen ? "lg:justify-center lg:px-0" : "px-3 gap-3"
          } text-zinc-500 hover:text-red-400 hover:bg-red-400/5`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`text-sm font-medium ${isOpen ? "lg:hidden" : "block"}`}
          >
            Вихід
          </span>
        </Link>
      </div>
    </aside>
  );
}
