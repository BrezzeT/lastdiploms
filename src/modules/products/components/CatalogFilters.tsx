"use client";

import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES, CATEGORY_STYLES } from "../../shared/constants";
import { LayoutGrid } from "lucide-react";

interface CatalogFilterProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function CatalogFilters({
  activeFilter,
  onFilterChange,
}: CatalogFilterProps) {
  const filters = [
    { id: "all", label: "Всі", Icon: LayoutGrid, accent: "text-violet-600" },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      Icon: CATEGORY_STYLES[cat.id]?.icon || LayoutGrid,
      accent:
        CATEGORY_STYLES[cat.id]?.iconBg?.split(" ")[1] || "text-violet-600",
    })),
  ];

  return (
    <div className="flex justify-center sm:justify-start mt-8 mb-6 max-w-full ">
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-zinc-100/70 border border-zinc-200/80 overflow-x-auto max-w-full scrollbar-hide">
        {filters.map(({ id, label, Icon, accent }) => {
          const isActive = activeFilter === id;

          return (
            <button
              key={id}
              onClick={() => onFilterChange(id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? `${accent} font-bold`
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-zinc-200/60"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
