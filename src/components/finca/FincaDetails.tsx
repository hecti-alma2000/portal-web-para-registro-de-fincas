'use client';
import { TipoPropiedad, RequestStatus } from '@prisma/client'; // Incluimos RequestStatus
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 🔑 IMPORTANTE: Usamos el tipo que retorna la Server Action, que incluye las relaciones.
// Asumo que tienes este tipo definido en tu Server Action, como sugerí:
// src/actions/registro-finca/get-finca-by-id.ts
type FincaWithRelations = {
  id: number;
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion: string | null;
  fotoUrl: string | null;
  tipoPropiedad: TipoPropiedad;
  status: RequestStatus; // 🔑 Nuevo campo clave
  entidadPertenece: string | null;
  usoActual: string | null;
  estadoConservacion: string | null;
  problematicaDetectada: string | null;
  tradicionesHistoria: string | null;

  // 🔑 Listas de relaciones mapeadas a string[]
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];

  // Información del creador (user)
  user: { id: string; name: string | null; email: string } | null;
} | null;

interface Props {
  finca: FincaWithRelations;
}

// -----------------------------------------------------------------
// --- Componentes Auxiliares ---
// -----------------------------------------------------------------

// Componente auxiliar para un detalle simple (mejorado)
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
  <div className="flex justify-between items-start border-b pb-2">
    <span className="text-sm font-medium ">{label}</span>
    <span className={`text-base font-semibold text-right ${color} flex items-center`}>
      <span className="mr-2">{icon}</span> {value}
    </span>
  </div>
);

// Helper para el badge de estado de Aprobación
const StatusBadge = ({ status }: { status: RequestStatus }) => {
  let colorClass = 'bg-gray-200 text-gray-800';
  let text = 'Desconocido';

  switch (status) {
    case RequestStatus.APPROVED:
      colorClass = 'bg-green-100 text-green-800';
      text = 'Aprobada';
      break;
    case RequestStatus.PENDING:
      colorClass = 'bg-yellow-100 text-yellow-800';
      text = 'Pendiente de Revisión';
      break;
    case RequestStatus.REJECTED:
      colorClass = 'bg-red-100 text-red-800';
      text = 'Rechazada';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
    >
      {text}
    </span>
  );
};

// Helper para renderizar listas de tags
const renderTagList = (title: string, items: string[] | undefined) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold t mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className=" text-white text-sm font-medium px-3 py-1 rounded-full shadow-md"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
// -----------------------------------------------------------------

/**
 * Componente principal para mostrar todos los detalles de una finca específica.
 */
export const FincaDetails = ({ finca }: Props) => {
  // Si la finca es null (e.g., por error de carga), manejamos la excepción
  if (!finca)
    return (
      <div className="max-w-4xl mx-auto p-10 text-center text-red-500">
        Error: No se encontraron los detalles de la finca.
      </div>
    );

  // Función para obtener el color y texto del badge de conservación
  const getConservationBadge = (estado: string | null) => {
    switch (estado?.toLowerCase()) {
      case 'muy bueno':
      case 'bueno':
        return { color: 'bg-green-100 text-green-800', text: estado };
      case 'aceptable':
        return { color: 'bg-yellow-100 text-yellow-800', text: estado };
      case 'malo':
        return { color: 'bg-red-100 text-red-800', text: estado };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'N/A' };
    }
  };

  const conservationBadge = getConservationBadge(finca.estadoConservacion);
  const router = useRouter();
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black dark:text-white">
      {/* Volver y Encabezado */}
      <span
        onClick={handleBack}
        className="cursor-pointer hover:underline hover:text-blue-500 inline-block  transition"
        role="button"
      >
        ← Volver
      </span>

      <div className="mt-6 flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold  leading-tight">{finca.nombre}</h1>
        {/* 🔑 Badge de Estado de Aprobación */}
        <StatusBadge status={finca.status} />
      </div>

      {/* Alerta de Pendiente */}
      {finca.status === RequestStatus.PENDING && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 mt-4" role="alert">
          <p className="font-bold text-yellow-800">Atención:</p>
          <p className="text-sm text-yellow-700">
            Esta ficha está <b>pendiente de revisión</b> por el administrador.
          </p>
        </div>
      )}

      {/* --- Grid Principal: Imagen y Datos Clave --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Columna de la Imagen */}
        <div className="lg:col-span-2 relative h-100 md:h- overflow-hidden rounded-xl shadow-2xl">
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

          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
            <span className="text-sm font-semibold text-white/80 uppercase">
              {finca.localizacion}
            </span>
          </div>
        </div>

        {/* Columna de Detalles Clave y Administrativos */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Información Clave</h2>

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
            <DetailItem label="Uso Actual Principal" value={finca.usoActual || 'N/A'} icon="🚜" />
            <DetailItem
              label="Entidad de Pertenencia"
              value={finca.entidadPertenece || 'N/A'}
              icon="🏢"
            />
            <DetailItem
              label="Registrado por"
              value={finca.user?.name || 'Usuario desconocido'}
              icon="👤"
            />
          </div>
        </div>
      </div>

      {/* --- Sección de Descripción y Características --- */}
      <div className="mt-12 space-y-10">
        {/* Descripción Detallada */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold  mb-4">Descripción y Detalle</h2>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {finca.descripcion || 'No se proporcionó una descripción detallada.'}
          </p>
        </div>

        {/* Tradiciones y Problemática (si existen) */}
        {(finca.tradicionesHistoria || finca.problematicaDetectada) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            {finca.tradicionesHistoria && (
              <div>
                <h3 className="text-xl font-bold  dark:text-white pt-4">Tradiciones e Historia</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic mt-2">
                  {finca.tradicionesHistoria}
                </p>
              </div>
            )}
            {finca.problematicaDetectada && (
              <div>
                <h3 className="text-xl font-bold text-red-700 pt-4 flex items-center">
                  <span className="mr-2">⚠️</span> Problemática Detectada
                </h3>
                <p className="text-red-800 leading-relaxed bg-red-50 dark:bg-red-900/40 p-3 rounded mt-2">
                  {finca.problematicaDetectada}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 🔑 Listas Dinámicas (Tags) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
          {renderTagList('Elementos de Interés', finca.elementosInteres)}
          {renderTagList('Actividades Agroturísticas', finca.actividadesAgroturisticas)}
          {renderTagList('Principios de Sustentabilidad', finca.principiosSustentabilidad)}
          {renderTagList('Acciones Ambientales', finca.accionesAmbientales)}
        </div>
      </div>

      <div className="mt-16 text-center text-gray-500 border-t pt-8">
        <p>Fin de los detalles de la ficha.</p>
      </div>
    </div>
  );
};
