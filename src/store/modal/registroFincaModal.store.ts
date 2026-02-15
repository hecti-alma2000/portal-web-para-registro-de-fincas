'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface RegistroFincaModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useRegistroFincaModalStore = create<RegistroFincaModalStore>()(
  persist(
    (set) => ({
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'modal', // el nombre con el que se va a grabar en el local storage
    }
  )
);
