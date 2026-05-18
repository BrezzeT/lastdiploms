"use client";
import { useState } from "react";
import { ChevronLeft, Save, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES, PRODUCT_COLORS } from "@/src/constants/admin";
import { createProduct } from "@/src/lib/actions/product.actions";

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
    sku: "",
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
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад до списку
        </Link>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Збереження..." : "Зберегти товар"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">
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
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-violet-500/50 transition-all"
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
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-zinc-400 text-sm outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-4 opacity-60 grayscale-[0.5]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Зображення</h3>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-zinc-500 font-bold uppercase tracking-widest">
                Скоро буде
              </span>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  disabled
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-600 outline-none cursor-not-allowed"
                />
              </div>
              <button
                disabled
                className="w-full py-2.5 rounded-xl border border-dashed border-white/5 text-zinc-700 text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Додати ще одне фото
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Ціна та Склад</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Ціна
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">
                    ₴
                  </span>
                  <input
                    aria-label="Ціна"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5" />

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
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    SKU
                  </label>
                  <input
                    aria-label="SKU"
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="IPH-15"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Категорія та Опції
            </h3>

            <div className="space-y-4">
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      formData.category === cat.id
                        ? "bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                        : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.category && (
              <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.find(
                    (c) => c.id === formData.category,
                  )?.subcategories.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setFormData({ ...formData, brand })}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                        formData.brand === brand
                          ? "bg-white text-black border-white"
                          : "bg-black/40 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.brand && (
              <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-5 gap-3">
                  {PRODUCT_COLORS.map((color) => {
                    const isSelected = formData.color === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() => {
                          setFormData({ ...formData, color: color.name });
                        }}
                        className={`relative aspect-square rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? "border-violet-500 scale-110 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                            : "border-white/10"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      ></button>
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
