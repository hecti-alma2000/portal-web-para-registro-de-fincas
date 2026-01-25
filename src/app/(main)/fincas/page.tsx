import { getPublicFincas } from '@/actions/registro-finca/finca-actions';
import { FincaGrid } from '@/components/finca/FincaGrid';
import { Title } from '@/components/ui/Title';
import { FincasFilterBar } from '@/components/finca/FincasFilterBar';

type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FincasPage({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;

  // 1. Extraer Tipo de Entidad
  const rawTipoEntidad = resolvedSearchParams.tipoEntidad;
  const tipoEntidadStr = Array.isArray(rawTipoEntidad) ? rawTipoEntidad[0] : rawTipoEntidad;
  const tipoEntidad: 'ESTATAL' | 'PRIVADA' | undefined =
    tipoEntidadStr === 'ESTATAL' || tipoEntidadStr === 'PRIVADA'
      ? (tipoEntidadStr as 'ESTATAL' | 'PRIVADA')
      : undefined;

  // 2. Extraer Uso Actual
  const rawUsoActual = resolvedSearchParams.usoActual;
  const usoActual = Array.isArray(rawUsoActual) ? rawUsoActual[0] : rawUsoActual;

  // 3. Extraer Estado de Conservación
  const rawEstado = resolvedSearchParams.estadoConservacion;
  const estadoConservacion = Array.isArray(rawEstado) ? rawEstado[0] : rawEstado;

  // 4. Extraer Dirección/Localización (Limpiando el valor)
  const rawDireccion = resolvedSearchParams.direccion;
  const direccion = Array.isArray(rawDireccion) ? rawDireccion[0] : rawDireccion;

  // Construir objeto de filtros
  const filters = {
    tipoEntidad,
    usoActual,
    estadoConservacion,
    direccion: direccion || undefined,
  };

  const fincas = await getPublicFincas(filters);

  return (
    <div className="container mx-auto px-4 pb-10">
      <Title
        title="Turismo Alternativo"
        subtitle="Lista de fincas disponibles para turismo alternativo"
        className="mb-6"
      />

      <FincasFilterBar />

      {fincas.length > 0 ? (
        <FincaGrid fincas={fincas} />
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-gray-500 dark:text-slate-400">
            No se encontraron fincas con esos criterios.
          </p>
        </div>
      )}
    </div>
  );
}
