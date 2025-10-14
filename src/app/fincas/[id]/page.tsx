// app/fincas/[id]/page.tsx (o la ruta donde esté tu página de detalles)

import { getFincaById } from '@/actions/registro-finca/get-finca-by-id';
import { FincaDetails } from '@/components/finca/FincaDetails';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }; // Los parámetros de ruta son siempre strings
}

export default async function FincaDetailsPage({ params }: Props) {
  // Convertimos el ID de string a número
  const id = Number(params.id);

  // Verificamos si la conversión falló o si el ID es inválido
  if (isNaN(id)) {
    notFound();
  }

  // Llamada a la acción de servidor con el ID numérico
  const finca = await getFincaById(id);

  if (!finca) {
    notFound();
  }

  return (
    <div>
      {/* Usamos el componente FincaDetailComponent */}
      <FincaDetails finca={finca} />
    </div>
  );
}
