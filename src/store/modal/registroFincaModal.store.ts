"use client";
import { create } from "zustand";

interface RegistroFincaModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useRegistroFincaModalStore = create<RegistroFincaModalStore>()(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
