import { create } from "zustand";

interface FincaEditStore {
  fincaToEdit: any | null;
  setFincaToEdit: (finca: any | null) => void;
}

export const useFincaEditStore = create<FincaEditStore>()((set) => ({
  fincaToEdit: null,
  setFincaToEdit: (finca) => set({ fincaToEdit: finca }),
}));
