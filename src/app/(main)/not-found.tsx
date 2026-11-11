// 404 dentro del área principal (p. ej. notFound() en /fincas/[id]).
// El layout de (main) ya aporta navegación y pie.
import { NotFoundScene } from '@/components/not-found/NotFoundScene';

export default function MainNotFound() {
  return <NotFoundScene />;
}
