// app/page.tsx
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { Divider } from '@/components/ui/Divider';
import { AgroturismoDescription } from '@/components/AgroturismoDescription';
import { CertificacionContent } from '@/components/CertificacionContent';
import { FincasValidationShortcut } from '@/components/FincasValidationShortcut';
import { FastActionButtons } from '@/components/FastActionButtons';
import HeroBanner from '@/components/HeroBanner';

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Busca, registra y certifica fincas agroturísticas. Descubre el potencial agroturístico de tu finca con el sistema FPAT.',
};

const LazyCarrusel = dynamic(() => import('../../components/ui/carrusel/Carrusel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-200 animate-pulse flex items-center justify-center">
      <p>Cargando Carrusel...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      <HeroBanner />
      <div className="w-full max-w-7xl px-4 mx-auto md:px-8 lg:px-12">
        <FastActionButtons />

        {/* ==================== SECCIÓN 1: DESCUBRE AGROTURISMO Y CARRUSEL ==================== */}
        <Divider dividerTitle="Descubre el Agroturismo" />
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <AgroturismoDescription />
          <LazyCarrusel />
        </div>

        {/* ==================== SECCIÓN 2: FPAT Y CERTIFICACIÓN (Diseño de Mitad/Mitad) ==================== */}
        <Divider dividerTitle="FPAT" />
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          {/* COLUMNA 1: Contenido del Sistema de Certificación (Ocupa la mitad) */}
          <CertificacionContent />
          {/* COLUMNA 2: Logo y Enlace (Ocupa la otra mitad) */}
          <FincasValidationShortcut />
        </div>
      </div>
    </main>
  );
}
