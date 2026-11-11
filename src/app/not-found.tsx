// 404 global: cualquier URL que no exista. Se renderiza solo con el layout raíz,
// así que añadimos la navegación y el pie del sitio.
import type { Metadata } from 'next';
import MainNav from '@/components/MainNav';
import { Footer } from '@/components/ui/footer/Footer';
import { NotFoundScene } from '@/components/not-found/NotFoundScene';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <MainNav />
      <NotFoundScene />
      <Footer />
    </main>
  );
}
