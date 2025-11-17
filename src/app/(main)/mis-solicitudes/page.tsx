import React from 'react';
import { getFincasByUser } from '@/actions/registro-finca/get-fincas-by-user';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default async function MisSolicitudesPage() {
  const fincas = await getFincasByUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mis solicitudes</h1>

      {fincas.length === 0 ? (
        <p className="text-muted-foreground">No tienes solicitudes registradas.</p>
      ) : (
        <ul className="grid gap-4">
          {fincas.map((finca: any) => (
            <li key={finca.id} className="flex items-center gap-4 p-4 border rounded-md">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {finca.fotoUrl ? (
                  // fotoUrl suele ser relativa a /uploads/..., la mostramos con next/image
                  <Image
                    src={finca.fotoUrl}
                    alt={finca.nombre}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No foto
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{finca.nombre}</h3>
                  <Badge variant={getBadgeVariant(finca.status)}>{finca.status}</Badge>
                </div>
                {finca.localizacion && (
                  <p className="text-sm text-gray-600 mt-1">{finca.localizacion}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Creado: {new Date(finca.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getBadgeVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'warning';
  }
}
