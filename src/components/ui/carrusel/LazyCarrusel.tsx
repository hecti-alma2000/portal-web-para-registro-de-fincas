'use client';
import dynamic from 'next/dynamic';

const Carrusel = dynamic(() => import('./Carrusel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-200 animate-pulse flex items-center justify-center">
      <p>Cargando Carrusel...</p>
    </div>
  ),
});

export default Carrusel;
