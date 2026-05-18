import { create } from "zustand";

interface AdminState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setCollapsed: (value: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setCollapsed: (value) => set({ isOpen: value }),
}));
