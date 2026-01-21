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

  // const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     close();
  //     setFincaToEdit(null);
  //   }
  // };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      // onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-slate-800 text-black dark:text-white rounded-lg shadow-lg p-8 w-full max-w-4xl h-[90vh] flex flex-col relative prose dark:prose-invert"
        style={{ maxHeight: '90vh' }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
          onClick={() => {
            close();
            setFincaToEdit(null);
          }}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {fincaToEdit ? 'Editar Finca' : 'Registro de Finca'}
        </h2>
        {fincaToEdit && (
          <div className="mb-4 p-4 bg-gray-50 rounded flex items-center gap-4">
            {fincaToEdit.fotoUrl ? (
              <img
                src={fincaToEdit.fotoUrl}
                alt={fincaToEdit.nombre}
                className="w-40 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-40 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 7V5a4 4 0 018 0v2"
                  />
                </svg>
              </div>
            )}
            <div>
              <div className="font-bold text-lg">{fincaToEdit.nombre}</div>
              <div className="text-sm text-gray-600">
                {fincaToEdit.ubicacion || fincaToEdit.localizacion}
              </div>
            </div>
          </div>
        )}
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
