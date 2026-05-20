"use client";

import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Search,
  Edit2,
  Wallet,
  Check,
  X,
  Loader2,
  Shield,
} from "lucide-react";
import { getAllUsers, updateUserBalance } from "@/src/lib/actions/user.actions";
import { User } from "@/src/types";

export default function AdminUserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempBalance, setTempBalance] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getAllUsers();
      if (res?.success) {
        setUsers(res.data);
      }
    };
    loadUsers();
  }, []);

  const handleStartEdit = (user: User) => {
    setEditingId(user._id as string);
    setTempBalance((user.balance || 0).toString());
  };

  const handleSave = async (id: string) => {
    const value = parseFloat(tempBalance);
    if (isNaN(value)) return;
    setIsUpdating(true);
    const res = await updateUserBalance(id, value);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, balance: value } : u)),
      );
      setEditingId(null);
    }
    setIsUpdating(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0c10]/40 p-4 rounded-3xl border border-zinc-800/40 shadow-xs">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Пошук користувачів..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 shadow-inner transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-20">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#0b0c10]/40 border border-zinc-800/40 p-4 sm:p-5 rounded-2xl hover:border-violet-500/30 hover:bg-[#0b0c10]/60 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-violet-950/20 flex items-center justify-center shrink-0 border border-violet-500/10">
                  <UserIcon className="w-5 h-5 text-violet-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-violet-300 transition-colors">
                      {user.name}
                    </h3>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        user.role === "admin"
                          ? "bg-violet-600/20 text-violet-400 border border-violet-500/20"
                          : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/30"
                      }`}
                    >
                      {user.role === "admin" && <Shield className="w-2.5 h-2.5" />}
                      {user.role}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/40">
                <div className="text-left sm:text-right">
                  <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-1">
                    Баланс
                  </p>
                  {editingId === user._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        aria-label="Баланс"
                        type="number"
                        value={tempBalance}
                        onChange={(e) => setTempBalance(e.target.value)}
                        className="w-24 bg-zinc-950/80 border border-violet-500/40 rounded-xl px-3 py-1.5 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                        autoFocus
                      />
                      <button
                        aria-label="Зберегти"
                        onClick={() => handleSave(user._id as string)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white active:scale-90 transition-all"
                      >
                        {isUpdating ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        aria-label="Скасувати"
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white active:scale-90 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-white font-black text-lg tracking-tight">
                      {(user.balance || 0).toLocaleString()} ₴
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="Редагувати"
                    className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/40 text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-90 transition-all cursor-pointer"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    aria-label="Змінити баланс"
                    onClick={() => handleStartEdit(user)}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white active:scale-90 transition-all cursor-pointer"
                  >
                    <Wallet size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/5 border border-dashed border-zinc-800/40 rounded-3xl">
            <p className="text-zinc-500 text-sm italic">Користувачів не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
