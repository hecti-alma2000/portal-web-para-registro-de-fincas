"use client";

import dynamic from "next/dynamic";

// Cargar dinámicamente el componente LocationMap
const DynamicLocationMap = dynamic(
  () =>
    import("@/components/maps/location/LocationMap").then(
      (mod) => mod.LocationMap
    ),
  {
    ssr: false, // Deshabilitar SSR
    loading: () => <p>Cargando el mapa...</p>, // Loading state
  }
);

export default function TrailsPage() {
  return (
    <div className="animate__animated animate__fadeIn">
      <div className="h-[1000px]">
        <DynamicLocationMap />
      </div>
    </div>
  );
}
