"use client";

import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { registerUser, loginUser } from "@/src/modules/users/user.actions";
import { User as UserType } from "@/src/modules/shared/types";
import { useAuthStore } from "@/src/modules/users/store/useAuthStore";

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
          avatar: res.data.avatar || "",
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
          avatar: res.data.avatar || "",
        });
        onClose();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-[40px] p-10 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

        <button
          aria-label="Закрити"
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {mode === "login" ? "Вхід" : "Реєстрація"}
          </h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            {mode === "login"
              ? "Раді бачити вас знову"
              : "Створіть свій профіль для покупок"}
          </p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-full mb-8 border border-zinc-200/50">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-base font-bold rounded-full transition-all duration-300 ${
              mode === "login"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Вхід
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-base font-bold rounded-full transition-all duration-300 ${
              mode === "register"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
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
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-900 outline-none focus:border-violet-500/50 focus:bg-white transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 ml-1">
              Електронна пошта
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-900 outline-none focus:border-violet-500/50 focus:bg-white transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 ml-1">
              Пароль
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-900 outline-none focus:border-violet-500/50 focus:bg-white transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-3.5 bg-violet-600 text-white rounded-full font-bold text-base hover:bg-violet-500 transition-all active:scale-95 shadow-md shadow-violet-600/10 hover:shadow-violet-600/20"
            >
              {mode === "login" ? "Увійти" : "Реєстрація"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
