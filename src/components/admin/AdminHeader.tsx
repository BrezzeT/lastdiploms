"use client";
import { Menu, Calendar } from "lucide-react";
import { useAdminStore } from "@/src/store/useAdminStore";
import { useMemo } from "react";

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = "Огляд" }: AdminHeaderProps) {
  const { toggleSidebar } = useAdminStore();

  const today = useMemo(() => {
    return new Date().toLocaleDateString("uk-UA", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  return (
    <header className="h-16 border-b border-zinc-800/40 bg-[#0b0c10] sticky top-0 z-40 flex items-center justify-between pl-6 pr-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Зміна режиму меню"
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl border border-zinc-800/40 bg-zinc-900/30 text-violet-400 hover:text-white hover:bg-zinc-800/50 hover:border-zinc-700/60 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-zinc-800/60 hidden sm:block" />

          <h1 className="text-lg font-black text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-zinc-400 text-xs font-semibold bg-zinc-900/40 px-3.5 py-2 rounded-xl border border-zinc-800/40 shadow-xs">
        <Calendar size={14} className="text-violet-400" />
        <span className="capitalize">{today}</span>
      </div>
    </header>
  );
}
