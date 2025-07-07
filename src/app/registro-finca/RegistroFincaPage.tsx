"use client";

import {
  getAllFincas,
  deleteFinca,
} from "@/actions/registro-finca/finca-actions";
import { useRegistroFincaModalStore } from "../../store/modal/registroFincaModal.store";
import RegistroFincaModal from "../../components/registro-finca/RegistroFincaModal";
import { useState, useTransition, useEffect } from "react";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { useFincaEditStore } from "../../store/modal/fincaEdit.store";
import FincaCard from "../../components/registro-finca/FincaCard";

export default function RegistroFincaPage({ fincas }: { fincas: any[] }) {
  const open = useRegistroFincaModalStore((state) => state.open);
  const [isPending, startTransition] = useTransition();
  const [fincasList, setFincasList] = useState(fincas);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Eliminar finca?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteFinca(id);
          if (res.ok) {
            setFincasList((prev) => prev.filter((f) => f.id !== id));
            Swal.fire("Eliminada", "La finca fue eliminada.", "success");
          } else {
            Swal.fire("Error", res.message || "No se pudo eliminar.", "error");
          }
        });
      }
    });
  };

  // Recibe notificación de registro/edición y actualiza la lista
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail && e.detail.finca) {
        setFincasList((prev) => {
          // Si es edición, reemplaza; si es nuevo, agrega
          const idx = prev.findIndex((f) => f.id === e.detail.finca.id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = e.detail.finca;
            return updated;
          }
          return [e.detail.finca, ...prev];
        });
      }
    };
    window.addEventListener("finca-guardada", handler as EventListener);
    return () =>
      window.removeEventListener("finca-guardada", handler as EventListener);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full flex justify-between items-center mt-20">
        <h1 className="text-3xl font-bold">Registro de Finca</h1>
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition flex items-center justify-center"
          onClick={open}
          title="Registrar nueva finca"
        >
          <FaPlus size={20} />
        </button>
      </div>
      {/* El botón de agregar finca siempre está visible arriba */}
      {fincasList.length !== 0 && (
        <h2 className="text-2xl font-bold mb-4">Lista de Fincas</h2>
      )}
      <div className="w-full max-w-2xl">
        {fincasList.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay fincas registradas.
          </div>
        ) : (
          <ul className="space-y-4">
            {fincasList.map((finca) => (
              <li key={finca.id}>
                <FincaCard
                  finca={finca}
                  onEdit={() => {
                    Swal.fire({
                      title: "¿Editar finca?",
                      text: "¿Deseas editar esta finca?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Sí, editar",
                      cancelButtonText: "Cancelar",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        useFincaEditStore.getState().setFincaToEdit(finca);
                        open();
                      }
                    });
                  }}
                  onDelete={() => handleDelete(finca.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <RegistroFincaModal />
    </main>
  );
}

export async function getServerSideProps() {
  const fincas = await getAllFincas();
  return { props: { fincas } };
}
