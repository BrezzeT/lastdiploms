import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/modules/layout/shared/types";

interface AuthState {
  user: Pick<
    User,
    "_id" | "name" | "email" | "role" | "balance" | "avatar"
  > | null;
  setUser: (
    user: Pick<User, "_id" | "name" | "email" | "role" | "balance" | "avatar">,
  ) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-storage" },
  ),
);
