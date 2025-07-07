"use client";
import { useRegistroFincaModalStore } from "@/store/modal/registroFincaModal.store";
import { useFincaEditStore } from "@/store/modal/fincaEdit.store";
import RegistroFincaForm from "./RegistroFincaForm";

export default function RegistroFincaModal() {
  const isOpen = useRegistroFincaModalStore((state) => state.isOpen);
  const close = useRegistroFincaModalStore((state) => state.close);
  const fincaToEdit = useFincaEditStore((state) => state.fincaToEdit);
  const setFincaToEdit = useFincaEditStore((state) => state.setFincaToEdit);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
      setFincaToEdit(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl h-[90vh] flex flex-col relative"
        style={{ maxHeight: "90vh" }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => {
            close();
            setFincaToEdit(null);
          }}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {fincaToEdit ? "Editar Finca" : "Registro de Finca"}
        </h2>
        <div className="overflow-y-auto flex-1 pr-2">
          <RegistroFincaForm
            onSuccess={() => {
              close();
              setFincaToEdit(null);
            }}
            fincaToEdit={fincaToEdit}
          />
        </div>
      </div>
    </div>
  );
}
