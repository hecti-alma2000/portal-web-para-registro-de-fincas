'use client';

import { deleteFinca } from '@/actions/registro-finca/finca-actions';
import { useRegistroFincaModalStore } from '../../../store/modal/registroFincaModal.store';
import { useState, useTransition, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useFincaEditStore } from '../../../store/modal/fincaEdit.store';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

interface Finca {
  id: number;
  nombre: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const FincaCard = dynamic(() => import('../../../components/registro-finca/FincaCard'), {
  loading: () => <p className="text-zinc-500 dark:text-zinc-400">Cargando fincas...</p>,
  ssr: false,
});

const RegistroFincaModal = dynamic(
  () => import('../../../components/registro-finca/RegistroFincaModal'),
  {
    loading: () => null,
    ssr: false,
  }
);

export default function RegistroFincaPage({ fincas }: { fincas: Finca[] }) {
  const open = useRegistroFincaModalStore((state) => state.open);
  const [isPending, startTransition] = useTransition();

  const initialFincas = fincas.filter((f) => f.status !== 'REJECTED');
  const [fincasList, setFincasList] = useState(initialFincas);

  useEffect(() => {
    const filtered = (fincas || []).filter((f) => f.status !== 'REJECTED');
    setFincasList(filtered);
  }, [fincas]);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Eliminar finca?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      // Estilos custom para Swal en modo oscuro se manejan aparte,
      // pero Tailwind no afecta dentro de Swal por defecto.
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteFinca(id);
          if (res.ok) {
            setFincasList((prev) => prev.filter((f) => f.id !== id));
            Swal.fire('Eliminada', 'La finca fue eliminada.', 'success');
          } else {
            Swal.fire('Error', res.message || 'No se pudo eliminar.', 'error');
          }
        });
      }
    });
  };

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail && e.detail.finca) {
        const incoming: Finca = e.detail.finca;

        if (incoming.status !== 'REJECTED') {
          setFincasList((prev) => {
            const idx = prev.findIndex((f) => f.id === incoming.id);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = incoming;
              return updated;
            }
            return [incoming, ...prev];
          });
        } else {
          setFincasList((prev) => prev.filter((f) => f.id !== incoming.id));
        }
      }
    };
    window.addEventListener('finca-guardada', handler as EventListener);
    return () => window.removeEventListener('finca-guardada', handler as EventListener);
  }, []);

  return (
    // AGREGADO: dark:bg-zinc-950 para el fondo general
    <main className="flex min-h-screen flex-col items-center p-8  transition-colors">
      <div className="w-full flex justify-between items-center mt-20 max-w-2xl">
        <h1 className="text-3xl text-green-600 dark:text-green-500 font-bold">
          Registro de Fincas
        </h1>
        <button
          className="bg-green-600 dark:bg-green-600 text-white p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-500 transition flex items-center justify-center shadow-lg shadow-green-600/20"
          onClick={open}
          title="Registrar nueva finca"
        >
          <Plus size={24} />
        </button>
      </div>

      {fincasList.length !== 0 && (
        <h2 className="text-2xl text-green-600 dark:text-green-500 mb-4 mt-8 w-full max-w-2xl">
          Lista de Fincas
        </h2>
      )}

      <div className="w-full max-w-2xl mt-4">
        {fincasList.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
            No hay fincas activas registradas.
          </div>
        ) : (
          <ul className="space-y-4">
            {fincasList.map((finca) => (
              <li key={finca.id}>
                <FincaCard
                  finca={finca}
                  onEdit={() => {
                    useFincaEditStore.getState().setFincaToEdit(finca);
                    open();
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
