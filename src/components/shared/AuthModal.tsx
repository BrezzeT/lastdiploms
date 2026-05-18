"use client";

import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { registerUser, loginUser } from "@/src/lib/actions/user.actions";
import { User as UserType } from "@/src/types";
import { useAuthStore } from "@/src/store/useAuthStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { setUser } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register") {
      const res = await registerUser(formData as UserType);
      if (res.success) {
        setUser({
          _id: res.data._id,
          name: formData.name,
          email: formData.email,
          role: "user",
          balance: 0,
        });
        onClose();
      } else {
        alert(res.error);
      }
    } else {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      if (res.success) {
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          balance: res.data.balance,
        });
        onClose();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

        <button
          aria-label="Закрити"
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {mode === "login" ? "Вхід" : "Реєстрація"}
          </h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            {mode === "login"
              ? "Раді бачити вас знову"
              : "Створіть свій профіль для покупок"}
          </p>
        </div>

        <div className="flex bg-black/40 p-1 rounded-2xl mb-8 border border-white/5">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              mode === "login"
                ? "bg-white/10 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Вхід
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              mode === "register"
                ? "bg-white/10 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Реєстрація
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`overflow-hidden transition-all duration-500 ${
              mode === "register"
                ? "max-h-24 opacity-100 mb-4"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 ml-1">
                Ім&apos;я
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 focus:bg-black/60 transition-all placeholder:text-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 ml-1">
              Електронна пошта
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 focus:bg-black/60 transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 ml-1">
              Пароль
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 focus:bg-black/60 transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-5 bg-violet-600 text-white rounded-3xl font-bold text-base hover:bg-violet-500 transition-all active:scale-95 shadow-lg shadow-violet-600/10"
            >
              {mode === "login" ? "Увійти" : "Створити акаунт"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
