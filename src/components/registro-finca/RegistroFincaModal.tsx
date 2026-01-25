'use client';
import { useRegistroFincaModalStore } from '@/store/modal/registroFincaModal.store';
import { useFincaEditStore } from '@/store/modal/fincaEdit.store';
import RegistroFincaForm from './RegistroFincaForm';

export default function RegistroFincaModal() {
  const isOpen = useRegistroFincaModalStore((state) => state.isOpen);
  const close = useRegistroFincaModalStore((state) => state.close);
  const fincaToEdit = useFincaEditStore((state) => state.fincaToEdit);
  const setFincaToEdit = useFincaEditStore((state) => state.setFincaToEdit);

  if (!isOpen) return null;

  return (
    // AGREGADO: backdrop-blur-sm bg-black/50 (más oscuro para mejor enfoque)
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
      <div
        className="bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative border border-zinc-200 dark:border-slate-700"
        style={{ maxHeight: '90vh' }}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-all z-10"
          onClick={() => {
            close();
            setFincaToEdit(null);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
          </svg>
        </button>

        <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {fincaToEdit ? 'Editar Finca' : 'Registro de Finca'}
          </h2>

          {fincaToEdit && (
            <div className="mt-4 p-4 bg-zinc-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4 border border-zinc-100 dark:border-slate-600">
              {fincaToEdit.fotoUrl ? (
                <img
                  src={fincaToEdit.fotoUrl}
                  alt={fincaToEdit.nombre}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-zinc-200 dark:bg-slate-600"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-zinc-400 dark:text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div>
                <div className="font-bold text-lg text-zinc-900 dark:text-white">
                  {fincaToEdit.nombre}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {fincaToEdit.ubicacion || fincaToEdit.localizacion}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
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
