"use client";

import { useState } from "react";
import { X, Save, Sparkles, Loader2 } from "lucide-react";
import { updateProduct } from "@/src/modules/products/product.actions";
import { Product as ProductType } from "@/src/modules/shared/types";
import { generateDescription } from "../product.gemini.actions";

interface EditProductModalProps {
  product: ProductType;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
}: EditProductModalProps) {
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    isFeatured: product.isFeatured || false,
    description: product.description || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProduct(product._id || "", editForm);
    if (res.success) {
      onClose();
    } else {
      alert(`Помилка: ${res.error}`);
    }
    setIsSaving(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDescription(
        editForm.name,
        product.category,
        product.brand,
      );
      if (result.success && result.data) {
        setEditForm({ ...editForm, description: result.data });
      } else {
        alert(result.error || "Помилка генерації");
      }
    } catch {
      alert("Не вдалося підключитися до сервісу генерації");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0b0c10] border border-zinc-800/80 rounded-3xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Редагування товару</h3>
          <button
            aria-label="Закрити модальне вікно"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">
              Назва товару
            </label>
            <input
              aria-label="Назва товару"
              type="text"
              required
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-violet-500/50 focus:bg-zinc-950 rounded-2xl py-2.5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Ціна (₴)
              </label>
              <input
                aria-label="Ціна товару"
                type="number"
                required
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: Number(e.target.value) })
                }
                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-violet-500/50 focus:bg-zinc-950 rounded-2xl py-2.5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Кількість (шт)
              </label>
              <input
                aria-label="Кількість товару"
                type="number"
                required
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: Number(e.target.value) })
                }
                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-violet-500/50 focus:bg-zinc-950 rounded-2xl py-2.5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Опис товару
              </label>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white disabled:opacity-50 text-[10px] font-bold transition-all cursor-pointer active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Генерується...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Згенерувати ШІ
                  </>
                )}
              </button>
            </div>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Опис товару..."
              className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-violet-500/50 focus:bg-zinc-950 rounded-2xl py-2.5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 transition-all min-h-28 resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl">
            <input
              type="checkbox"
              id="editIsFeatured"
              checked={editForm.isFeatured}
              onChange={(e) =>
                setEditForm({ ...editForm, isFeatured: e.target.checked })
              }
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500/10 focus:ring-offset-zinc-900 focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="editIsFeatured"
              className="text-xs font-bold text-zinc-300 cursor-pointer select-none uppercase tracking-wider"
            >
              Рекомендований товар (на головній)
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900/40 text-xs font-bold transition-all cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              {isSaving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
