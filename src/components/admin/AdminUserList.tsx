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
      <div className="bg-zinc-900/10 p-4 rounded-3xl border border-white/5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Пошук користувачів..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-900/10 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl bg-zinc-900/40 flex items-center justify-center shrink-0 border border-white/5">
                <UserIcon className="w-5 h-5 text-zinc-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm truncate">
                    {user.name}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 font-bold uppercase tracking-wider shrink-0">
                    {user.role}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <div className="text-left sm:text-right">
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">
                  Баланс
                </p>
                {editingId === user._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      aria-label="Баланс"
                      type="number"
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      className="w-24 bg-black/60 border border-violet-500/30 rounded-lg px-2 py-1 text-white text-sm font-bold outline-none"
                      autoFocus
                    />
                    <button
                      aria-label="Зберегти"
                      onClick={() => handleSave(user._id as string)}
                      className="text-emerald-500 hover:text-emerald-400"
                    >
                      {isUpdating ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      aria-label="Скасувати"
                      className="text-red-500 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-white font-black text-lg">
                    {(user.balance || 0).toLocaleString()} ₴
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Редагувати"
                  className="p-2.5 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  aria-label="Змінити баланс"
                  onClick={() => handleStartEdit(user)}
                  className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <Wallet size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
