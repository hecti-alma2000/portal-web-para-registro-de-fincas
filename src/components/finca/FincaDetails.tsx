'use client';
import { TipoPropiedad, RequestStatus } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type FincaWithRelations = {
  id: number;
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion: string | null;
  fotoUrl: string | null;
  tipoPropiedad: TipoPropiedad;
  status: RequestStatus;
  entidadPertenece: string | null;
  usoActual: string | null;
  estadoConservacion: string | null;
  problematicaDetectada: string | null;
  tradicionesHistoria: string | null;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
  user: { id: string; name: string | null; email: string } | null;
} | null;

interface Props {
  finca: FincaWithRelations;
}

// -----------------------------------------------------------------
// --- Componentes Auxiliares con Soporte Dark Mode ---
// -----------------------------------------------------------------

const DetailItem = ({
  label,
  value,
  icon,
  color = 'text-gray-700 dark:text-slate-300',
}: {
  label: string;
  value: string;
  icon: string;
  color?: string;
}) => (
  <div className="flex justify-between items-start border-b border-gray-100 dark:border-slate-700 pb-3">
    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</span>
    <span className={`text-base font-semibold text-right ${color} flex items-center`}>
      <span className="mr-2 opacity-80">{icon}</span> {value}
    </span>
  </div>
);

const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const configs = {
    [RequestStatus.APPROVED]:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    [RequestStatus.PENDING]:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const labels = {
    [RequestStatus.APPROVED]: 'Aprobada',
    [RequestStatus.PENDING]: 'En Revisión',
    [RequestStatus.REJECTED]: 'Rechazada',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${configs[status]}`}
    >
      {labels[status]}
    </span>
  );
};

const renderTagList = (title: string, items: string[] | undefined) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4 flex items-center">
        <span className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></span>
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 transition-colors hover:bg-green-500 hover:text-white dark:hover:bg-green-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------

export const FincaDetails = ({ finca }: Props) => {
  const router = useRouter();

  if (!finca)
    return (
      <div className="max-w-4xl mx-auto p-10 text-center text-red-500 font-bold">
        ⚠️ Error: No se encontraron los detalles de la finca.
      </div>
    );

  const getConservationBadge = (estado: string | null) => {
    const val = estado?.toLowerCase() || '';
    if (val.includes('bueno'))
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (val.includes('aceptable'))
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (val.includes('malo')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* Botón Volver */}
      <button
        onClick={() => router.back()}
        className="group flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-6"
      >
        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
        Volver al listado
      </button>

      {/* Título y Estado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {finca.nombre}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center">
            <span className="mr-2">📍</span> {finca.localizacion}
          </p>
        </div>
        <StatusBadge status={finca.status} />
      </div>

      {/* Alerta de Pendiente */}
      {finca.status === RequestStatus.PENDING && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <span className="text-amber-500 mr-3">⏳</span>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Esta ficha está <b>pendiente de revisión</b>. Algunos datos pueden no ser públicos
              hasta su aprobación.
            </p>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Galería/Imagen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
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
              <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <span className="text-6xl mb-4">🖼️</span>
                <span className="font-medium">Sin imagen disponible</span>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de Información Clave */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="mr-2 text-green-500">📋</span> Datos Generales
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Estado Físico
                </p>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm inline-block ${getConservationBadge(
                    finca.estadoConservacion
                  )}`}
                >
                  {finca.estadoConservacion || 'No definido'}
                </span>
              </div>

              <div className="pt-4 space-y-4">
                <DetailItem
                  label="Propiedad"
                  value={finca.tipoPropiedad === TipoPropiedad.PRIVADA ? 'Privada' : 'Estatal'}
                  icon="🏡"
                  color={
                    finca.tipoPropiedad === TipoPropiedad.PRIVADA
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }
                />
                <DetailItem label="Propietario" value={finca.propietario} icon="👨‍🌾" />
                <DetailItem label="Uso Principal" value={finca.usoActual || 'N/A'} icon="🌽" />
                <DetailItem
                  label="Entidad"
                  value={finca.entidadPertenece || 'Independiente'}
                  icon="🏢"
                />
              </div>

              <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Registrado por: <b>{finca.user?.name || 'Sistema'}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Detallado */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna Izquierda: Textos */}
        <div className="lg:col-span-2 space-y-10">
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
              <span className="mr-3">📖</span> Historia y Descripción
            </h2>
            <div className="bg-white dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {finca.descripcion ||
                  'Esta finca es un baluarte del turismo alternativo. Pronto añadiremos más detalles sobre su producción.'}
              </p>

              {finca.tradicionesHistoria && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase mb-3 italic">
                    Tradiciones e Identidad
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                    "{finca.tradicionesHistoria}"
                  </p>
                </div>
              )}
            </div>
          </section>

          {finca.problematicaDetectada && (
            <section className="bg-red-50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center mb-4">
                <span className="mr-3">⚠️</span> Desafíos Identificados
              </h3>
              <p className="text-red-800 dark:text-red-300 leading-relaxed font-medium">
                {finca.problematicaDetectada}
              </p>
            </section>
          )}
        </div>

        {/* Columna Derecha: Tags */}
        <div className="lg:col-span-1 space-y-2">
          <div className="sticky top-8">
            <div className="bg-white dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              {renderTagList('Atractivos', finca.elementosInteres)}
              {renderTagList('Actividades', finca.actividadesAgroturisticas)}
              {renderTagList('Sustentabilidad', finca.principiosSustentabilidad)}
              {renderTagList('Medio Ambiente', finca.accionesAmbientales)}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Sistema de Gestión de Turismo Alternativo • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
