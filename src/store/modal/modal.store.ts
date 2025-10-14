import { create } from 'zustand';

interface Modal {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<Modal>()((set) => ({
  isModalOpen: false,
  openModal: () => {
    set({ isModalOpen: true });
  },
  closeModal: () => {
    set({ isModalOpen: false });
  },
}));
