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
    <header className="h-16 border-b border-white/5 bg-black sticky top-0 z-40 flex items-center justify-between pl-6 pr-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Зміна режиму меню"
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-violet-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <h1 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
        <Calendar size={14} className="text-violet-500" />
        <span className="capitalize">{today}</span>
      </div>
    </header>
  );
}
