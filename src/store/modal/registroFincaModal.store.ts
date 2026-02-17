'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegistroFincaModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

// Usamos la misma constante de tu formulario
const DRAFT_KEY = 'registro_finca_draft';

export const useRegistroFincaModalStore = create<RegistroFincaModalStore>()(
  persist(
    (set) => ({
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => {
        // 1. Cerramos el modal
        set({ isOpen: false });

        // 2. Limpiamos el borrador para que el formulario aparezca vacío la próxima vez
        // Verificamos que 'window' exista para evitar errores de SSR (Server-Side Rendering) en Next.js
        if (typeof window !== 'undefined') {
          localStorage.removeItem(DRAFT_KEY);
        }
      },
    }),
    {
      name: 'modal-registro-finca', // Te recomiendo darle un nombre más específico para evitar colisiones con otros modales
    }
  )
);
