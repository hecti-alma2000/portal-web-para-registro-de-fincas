// src/app/admin/requests/page.tsx
import { getPendingFincas } from '@/actions/registro-finca/get-pending-fincas';
import { auth } from '@/auth.config';
import { RequestButtons } from '@/components/RequestButtons';
import Link from 'next/link';

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return <div>No autorizado</div>;

  const pending = await getPendingFincas();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center gap-2">
        Solicitudes Pendientes
        {pending.length > 0 && (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {pending.length}
          </span>
        )}
      </h1>

      {pending.length === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No hay solicitudes pendientes por revisar.</p>
        </div>
      )}

      <ul className="space-y-4">
        {pending.map((f: any) => (
          <li
            key={f.id}
            className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{f.nombre}</h2>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-zinc-500">📍 {f.localizacion}</p>
                  <p className="text-sm text-zinc-500">👤 {f.propietario}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    ID: {f.id} • Creado: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                <RequestButtons id={f.id} nombre={f.nombre} />
                <Link
                  href={`/fincas/${f.id}`}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 text-center transition"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
