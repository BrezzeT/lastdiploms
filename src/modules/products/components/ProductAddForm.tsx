"use client";
import { useState } from "react";
import { ChevronLeft, Save, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
} from "@/src/modules/layout/shared/constants";
import { createProduct } from "@/src/modules/products/product.actions";

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    category: "",
    brand: "",
    color: "",
    stock: 0,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, name, slug });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Будь ласка, заповніть основні поля (Назва, Ціна, Категорія)");
      return;
    }
    setIsSaving(true);
    try {
      const result = await createProduct(formData);
      if (result.success) {
        router.push("/admin/products");
      } else {
        alert("Помилка: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Назад до списку</span>
        </Link>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Збереження..." : "Зберегти товар"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0b0c10]/40 border border-zinc-800/40 p-5 sm:p-6 rounded-3xl space-y-5">
            <h3 className="text-base font-bold text-white">
              Основна інформація
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Назва товару
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Наприклад: Apple iPhone 15 Pro"
                className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="apple-iphone-15-pro"
                className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-3 px-4 text-zinc-400 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 transition-all"
              />
            </div>
          </div>

          <div className="bg-[#0b0c10]/40 border border-zinc-800/30 p-5 sm:p-6 rounded-3xl space-y-4 opacity-60 grayscale-[0.4]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Зображення</h3>
              <span className="text-[10px] bg-zinc-800/60 px-2.5 py-1 rounded-full text-zinc-500 font-bold uppercase tracking-widest border border-zinc-700/30">
                Скоро буде
              </span>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  disabled
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-950/20 border border-zinc-800/30 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-zinc-600 outline-none cursor-not-allowed placeholder:text-zinc-700"
                />
              </div>
              <button
                disabled
                className="w-full py-2.5 rounded-2xl border border-dashed border-zinc-800/40 text-zinc-700 text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Додати ще одне фото
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0b0c10]/40 border border-zinc-800/40 p-5 sm:p-6 rounded-3xl space-y-5">
            <h3 className="text-base font-bold text-white">Ціна та Склад</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Ціна
              </label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold pointer-events-none">
                  ₴
                </span>
                <input
                  aria-label="Ціна"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
              </div>
            </div>

            <div className="h-px bg-zinc-800/40" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Залишок
                </label>
                <input
                  aria-label="Залишок"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  placeholder="0"
                  className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0b0c10]/40 border border-zinc-800/40 p-5 sm:p-6 rounded-3xl space-y-5">
            <h3 className="text-base font-bold text-white">
              Категорія та Опції
            </h3>

            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      category: cat.id,
                      brand: "",
                      color: "",
                    })
                  }
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    formData.category === cat.id
                      ? "bg-linear-to-r from-violet-600 to-indigo-600 border-transparent text-white shadow-lg shadow-violet-600/15"
                      : "bg-zinc-950/40 border-zinc-800/40 text-zinc-400 hover:text-white hover:border-zinc-600/40 hover:bg-zinc-900/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {formData.category && (
              <div className="space-y-3 pt-4 border-t border-zinc-800/40 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Бренд
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.find(
                    (c) => c.id === formData.category,
                  )?.subcategories.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setFormData({ ...formData, brand })}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                        formData.brand === brand
                          ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                          : "bg-zinc-950/40 border-zinc-800/40 text-zinc-500 hover:text-white hover:border-zinc-600/40"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.brand && (
              <div className="space-y-3 pt-4 border-t border-zinc-800/40 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Колір
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-5 gap-3">
                  {PRODUCT_COLORS.map((color) => {
                    const isSelected = formData.color === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() =>
                          setFormData({ ...formData, color: color.name })
                        }
                        className={`relative aspect-square rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "border-violet-500 scale-110 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                            : "border-zinc-700/40 hover:border-zinc-500/60 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
