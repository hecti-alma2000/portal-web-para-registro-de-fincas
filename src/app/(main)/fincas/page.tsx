import { getPublicFincas } from '@/actions/registro-finca/finca-actions';
import { FincaGrid } from '@/components/finca/FincaGrid';
import { Title } from '@/components/ui/Title';

export default async function FincasPage() {
  const fincas = await getPublicFincas();
  return (
    <div>
      <Title
        title="Turismo Alternativo"
        subtitle="Lista de fincas disponibles para turismo alternativo"
        className="mb-2"
      />
      <FincaGrid fincas={fincas} />
    </div>
  );
}
