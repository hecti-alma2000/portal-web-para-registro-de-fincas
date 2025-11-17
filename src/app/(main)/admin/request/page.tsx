import { getPendingFincas } from '@/actions/registro-finca/get-pending-fincas';
import { approveFincaRequest } from '@/actions/registro-finca/approve-request';
import { deleteFincaRequest } from '@/actions/registro-finca/reject-request';
import { auth } from '@/auth.config';
import Link from 'next/link';

// Server action handlers for form actions
async function handleApprove(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  if (!id) return;
  await approveFincaRequest(id);
}

async function handleReject(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  if (!id) return;
  await deleteFincaRequest(id);
}

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return <div>No autorizado</div>;

  const pending = await getPendingFincas();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-500 mb-6">
        Solicitudes de registro y actualización de fincas
      </h1>
      {pending.length === 0 && (
        <p className="text-green-500 mb-16 text-center">No hay solicitudes pendientes.</p>
      )}
      <ul className="space-y-4">
        {pending.map((f: any) => (
          <li key={f.id} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">{f.nombre}</h2>
            <p className="text-sm text-muted-foreground">Ubicación: {f.localizacion}</p>
            <p className="text-sm text-muted-foreground">Propietario: {f.propietario}</p>

            <div className="mt-3 flex gap-2">
              <form action={handleApprove} method="post">
                <input type="hidden" name="id" value={String(f.id)} />
                <button type="submit" className="btn-primary">
                  Aprobar
                </button>
              </form>

              <form action={handleReject} method="post">
                <input type="hidden" name="id" value={String(f.id)} />
                <button type="submit" className="btn-disable">
                  Denegar
                </button>
              </form>

              <Link href={`/fincas/${f.id}`} className="btn-secondary">
                Ver detalles
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
