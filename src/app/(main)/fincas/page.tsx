import { getPublicFincas } from '@/actions/registro-finca/finca-actions';
import { FincaGrid } from '@/components/finca/FincaGrid';
import { Title } from '@/components/ui/Title';
import { FincasFilterBar } from '@/components/finca/FincasFilterBar';

type SearchParamsProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FincasPage({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  // 1. Para tipoEntidad: Extraemos el valor, si es array tomamos el primero
  const rawTipoEntidad = resolvedSearchParams.tipoEntidad;
  const tipoEntidadStr = Array.isArray(rawTipoEntidad) ? rawTipoEntidad[0] : rawTipoEntidad;
  // Validamos que sea exactamente uno de los valores del ENUM
  const tipoEntidad: 'ESTATAL' | 'PRIVADA' | undefined =
    tipoEntidadStr === 'ESTATAL' || tipoEntidadStr === 'PRIVADA' ? tipoEntidadStr : undefined;
  // 2. Para usoActual: Si es array tomamos el primero, si no, lo dejamos pasar
  const rawUsoActual = resolvedSearchParams.usoActual;
  const usoActual = Array.isArray(rawUsoActual) ? rawUsoActual[0] : rawUsoActual;
  // 3. Para estadoConservacion: Lo mismo
  const rawEstado = resolvedSearchParams.estadoConservacion;
  const estadoConservacion = Array.isArray(rawEstado) ? rawEstado[0] : rawEstado;
  // Ahora filters tiene tipos compatibles: { tipoEntidad?: ...; usoActual?: string; ... }
  const filters = { tipoEntidad, usoActual, estadoConservacion };
  const fincas = await getPublicFincas(filters);
  return (
    <div>
      <Title
        title="Turismo Alternativo"
        subtitle="Lista de fincas disponibles para turismo alternativo"
        className="mb-2"
      />
      <FincasFilterBar />
      <FincaGrid fincas={fincas} />
    </div>
  );
}
