"use client";

import { useState } from "react";
import { useAuthStore } from "../users/store/useAuthStore";
import { updateUserProfile } from "@/src/modules/users/user.actions";
import { Save, Layers } from "lucide-react";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bob",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
];

const settingsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "linear",
    },
  },
};

export default function ProfileSettings() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ім'я не може бути порожнім");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfile(user._id || "", { name, avatar });
      if (res.success) {
        setUser({
          ...user,
          name: res.data.name,
          avatar: res.data.avatar,
        });
        toast.success("Профіль успішно оновлено!");
      } else {
        toast.error(`Помилка: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Щось пішло не так");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={settingsVariants}
      initial="hidden"
      animate="visible"
      className=" bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6"
    >
      <div>
        <h3 className="text-lg font-black text-zinc-900 tracking-tight">
          Особисті дані
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Оновіть своє ім&apos;я або оберіть унікальний аватар.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 pl-1">
            Ім&apos;я
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200/80 focus:border-violet-500/50 focus:bg-white rounded-2xl py-3 px-4 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/10 transition-all font-medium"
            placeholder="Введіть ваше ім'я"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 pl-1">
            Електронна пошта (не можна змінити)
          </label>
          <input
            aria-label="Email"
            type="email"
            disabled
            value={user.email}
            className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl py-3 px-4 text-sm text-zinc-400 outline-none cursor-not-allowed font-medium"
          />
        </div>

        <div className="space-y-4 pt-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 pl-1 block">
            Оберіть готовий аватар
          </label>
          <div className="grid grid-cols-6 gap-3">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(url)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 bg-violet-50/30 flex items-center justify-center p-1 cursor-pointer transition-all ${
                  avatar === url
                    ? "border-violet-500 scale-105 shadow-md shadow-violet-500/10"
                    : "border-zinc-150 hover:border-zinc-300 hover:scale-102"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Avatar Preset"
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 pl-1">
              Або вставте посилання на власне фото
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200/80 focus:border-violet-500/50 focus:bg-white rounded-2xl py-3 px-4 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-violet-500/10 transition-all font-medium"
              placeholder="https://example.com/your-avatar.jpg"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full text-sm transition-all shadow-md shadow-violet-600/10 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
