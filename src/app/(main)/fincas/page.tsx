import { getPublicFincas } from '@/actions/registro-finca/finca-actions';
import { FincaGrid } from '@/components/finca/FincaGrid';
import { Title } from '@/components/ui/Title';
import { FincasFilterBar } from '@/components/finca/FincasFilterBar';

export default async function FincasPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  // Solo permitir los valores válidos para tipoEntidad
  const tipoEntidadParam = searchParams?.tipoEntidad;
  const tipoEntidad: 'ESTATAL' | 'PRIVADA' | undefined =
    tipoEntidadParam === 'ESTATAL' || tipoEntidadParam === 'PRIVADA' ? tipoEntidadParam : undefined;
  const usoActual = searchParams?.usoActual || undefined;
  const estadoConservacion = searchParams?.estadoConservacion || undefined;
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
