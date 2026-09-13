// Página de exploración: contiene el mapa y el chatbot (antes en la página principal)
import TrailsPage from '@/components/TrailsPage';
import { getPublicMapFincas } from '@/actions/registro-finca/finca-actions';

export default async function Explorar() {
  const fincas = await getPublicMapFincas();
  return <TrailsPage fincas={fincas} />;
}
