'use client';

import { toast } from 'sonner';
import { approveFincaRequest } from '@/actions/registro-finca/approve-request'; // Ajusta ruta
import { deleteFincaRequest } from '@/actions/registro-finca/reject-request'; // Ajusta ruta
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const RequestButtons = ({ id, nombre }: { id: number; nombre: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onApprove = async () => {
    setLoading(true);
    try {
      await approveFincaRequest(id);
      toast.success(`La finca "${nombre}" ha sido aprobada correctamente.`);
      router.refresh(); // Refresca la lista visualmente
    } catch (error) {
      toast.error('Ocurrió un error al aprobar la finca.');
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    if (
      !confirm(
        '¿Estás seguro de rechazar esta solicitud? Esta acción enviará un correo y eliminará la petición.'
      )
    )
      return;

    setLoading(true);
    try {
      await deleteFincaRequest(id);
      toast.info(`La solicitud de "${nombre}" ha sido denegada.`);
      router.refresh();
    } catch (error) {
      toast.error('Error al denegar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={onApprove}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
      >
        {loading ? 'Procesando...' : 'Aprobar'}
      </button>

      <button
        onClick={onReject}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
      >
        Denegar
      </button>
    </div>
  );
};
