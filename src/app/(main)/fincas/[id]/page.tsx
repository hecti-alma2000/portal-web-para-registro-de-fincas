// src/app/(main)/fincas/[id]/page.tsx

import { getFincaById } from '@/actions/registro-finca/get-finca-by-id';
import { FincaDetails } from '@/components/finca/FincaDetails';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Detalles de Finca ${resolvedParams.id}`,
  };
}

export default async function FincaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Esperamos a que se resuelva la promesa de params
  const resolvedParams = await params;
  const idString = resolvedParams.id;

  // 2. Conversión a número (sincrónico, NO lleva 'await')
  const id = Number(idString);

  if (Number.isNaN(id)) {
    notFound();
  }

  // 3. Llamada a la acción de servidor (asíncrono, SÍ lleva 'await')
  const finca = await getFincaById(id);

  if (!finca) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <FincaDetails finca={finca} />
    </div>
  );
}
