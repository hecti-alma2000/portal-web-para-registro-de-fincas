// src/components/finca/FincaDetailComponent.tsx
'use client';

import { Finca, TipoPropiedad } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  finca: Finca;
}

/**
 * Componente principal para mostrar todos los detalles de una finca específica.
 */
export const FincaDetails = ({ finca }: Props) => {
  // Función para obtener el color y texto del badge de conservación
  const getConservationBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'muy buena':
      case 'buena':
        return { color: 'bg-green-100 text-green-800', text: estado };
      case 'aceptable':
        return { color: 'bg-yellow-100 text-yellow-800', text: estado };
      case 'malo':
        return { color: 'bg-red-100 text-red-800', text: estado };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Desconocido' };
    }
  };

  const conservationBadge = getConservationBadge(finca.estadoConservacion || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/fincas" className="hover:underline hover:text-blue-500">
        ← Volver
      </Link>
      {/* Encabezado y Foto */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Columna de la Imagen */}
        <div className="lg:col-span-2 relative h-[400px] md:h-[600px] overflow-hidden rounded-xl shadow-2xl">
          {finca.fotoUrl ? (
            <Image
              src={finca.fotoUrl}
              alt={finca.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-2xl font-semibold">
              <span className="p-4">📷 Imagen de la Finca no disponible</span>
            </div>
          )}

          {/* Nombre y Propiedad sobre la imagen (opcional, para impacto visual) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
            <span className="text-sm font-semibold text-white/80 uppercase">
              {finca.localizacion}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {finca.nombre}
            </h1>
          </div>
        </div>

        {/* Columna de Detalles Clave y Administrativos */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-4">Información Clave</h2>

          {/* Estado de Conservación */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-sm font-medium text-gray-500">Estado de Conservación</p>
            <span
              className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-base font-semibold ${conservationBadge.color}`}
            >
              {conservationBadge.text}
            </span>
          </div>

          {/* Detalles Administrativos */}
          <div className="space-y-4">
            <DetailItem
              label="Tipo de Propiedad"
              value={finca.tipoPropiedad === TipoPropiedad.PRIVADA ? 'Privada' : 'Estatal'}
              icon="🏠"
              color={
                finca.tipoPropiedad === TipoPropiedad.PRIVADA ? 'text-green-600' : 'text-blue-600'
              }
            />
            <DetailItem label="Propietario / Usufructuario" value={finca.propietario} icon="🧑‍🌾" />
            <DetailItem
              label="Entidad de Pertenencia"
              value={finca.entidadPertenece || 'N/A'}
              icon="🏢"
            />
            {finca.problematicaDetectada && (
              <DetailItem
                label="Problemática Detectada"
                value={finca.problematicaDetectada}
                icon="⚠️"
                color="text-red-600"
              />
            )}
          </div>
        </div>
      </div>
      ---
      {/* Sección de Descripción y Uso */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Descripción Detallada */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Descripción y Caracterización</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{finca.descripcion}</p>

          {finca.tradicionesHistoria && (
            <>
              <h3 className="text-xl font-bold text-gray-800 pt-4">Tradiciones e Historia</h3>
              <p className="text-gray-600 leading-relaxed italic">{finca.tradicionesHistoria}</p>
            </>
          )}
        </div>

        {/* Uso Actual y Más Detalles */}
        <div className="lg:col-span-1 p-6 bg-blue-50 rounded-xl shadow-lg h-fit">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            📋 Uso y Actividad Principal
          </h3>
          <DetailItem
            label="Uso Actual Principal"
            value={finca.usoActual || 'No especificado'}
            icon="🚜"
          />
          <DetailItem label="Localización Específica" value={finca.localizacion} icon="🗺️" />
        </div>
      </div>
      {/* Aquí irían componentes para Actividades, Elementos de Interés, Infraestructura, etc. */}
      {/* Por ahora, dejamos este espacio como un placeholder. */}
      <div className="mt-16 text-center text-gray-500 border-t pt-8">
        <p>Más detalles (Actividades, Infraestructura, Diagnóstico) próximamente.</p>
      </div>
    </div>
  );
};

// Componente auxiliar para un detalle simple
const DetailItem = ({
  label,
  value,
  icon,
  color = 'text-gray-600',
}: {
  label: string;
  value: string;
  icon: string;
  color?: string;
}) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className={`text-base font-semibold ${color} flex items-center`}>
      <span className="mr-2">{icon}</span> {value}
    </span>
  </div>
);
