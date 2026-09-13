'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import type { MapFinca } from '@/interfaces/finca-map.interface';

const DynamicLocationMap = dynamic(
  () => import('@/components/maps/location/LocationMap').then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => <p>Cargando el mapa...</p>,
  }
);

export default function TrailsPage({ fincas }: { fincas: MapFinca[] }) {
  useEffect(() => {
    // El chat ahora se carga globalmente desde `ChatWidget` en el layout
  }, []);

  return (
    <div className="w-full ">
      <DynamicLocationMap fincas={fincas} />
    </div>
  );
}
