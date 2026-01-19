// components/ui/carrusel/Carrusel.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// 1. Modifica la estructura de datos:
// Ahora `images` es un array de objetos, donde cada objeto
// tiene la propiedad `src` (la ruta de la imagen) y `description`.
const images = [
  { src: '/carrusel/1.webp', description: 'Finca El Troncón: Potencialidades' },
  { src: '/carrusel/2.webp', description: 'Finca El Troncón: Atractivos' },
  {
    src: '/carrusel/3.webp',
    description: 'El Troncón: Ganadero Nolberto Santiesteban',
  },
  {
    src: '/carrusel/4.webp',
    description: 'Minindustria en Finca La Gloria',
  },
  {
    src: '/carrusel/5.webp',
    description: 'Carlos Pozo: Polígono de experimentación',
  },
  {
    src: '/carrusel/6.webp',
    description: 'Coto Las Maravillas: 52 Hectáreas',
  },
  {
    src: '/carrusel/7.webp',
    description: 'Sendero: Áreas de producción y pastoreo',
  },
  {
    src: '/carrusel/8.webp',
    description: 'Infraestructura: Molino y corrales',
  },
  {
    src: '/carrusel/9.webp',
    description: 'Entrada al municipio Calixto García',
  },
  {
    src: '/carrusel/10.webp',
    description: 'Finca agroecológica en desarrollo',
  },
  {
    src: '/carrusel/11.webp',
    description: 'Finca Vista Hermosa',
  },
  {
    src: '/carrusel/12.webp',
    description: 'Finca Vigía',
  },
  {
    src: '/carrusel/13.webp',
    description: 'Área de Cuidado Equino',
  },
  {
    src: '/carrusel/14.webp',
    description: 'Manejo de Ganado Bovino',
  },
  {
    src: '/carrusel/15.webp',
    description: 'Recorrido en Finca Vista Hermosa',
  },
];

const Carrusel = ({ swipeable = true }) => {
  // Detectar móvil para ajustar controles (flechas)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // alturas responsivas: móvil más compacto, PC mantiene h-96
    <div className="relative bg-green-500 text-white overflow-hidden h-48 sm:h-56 md:h-72 lg:h-96">
      <Carousel
        showArrows={!isMobile}
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={3000}
        swipeable={swipeable}
        emulateTouch
        selectedItem={0}
      >
        {images.map((image, index) => (
          <div key={index} className="relative overflow-hidden h-48 sm:h-56 md:h-72 lg:h-96">
            <Image
              src={image.src}
              alt={`Slide ${index}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            {/* leyenda responsiva: gradiente, tamaños y padding adaptativos */}
            <div className="absolute inset-x-0 bottom-0 px-3 sm:px-6 pb-3 sm:pb-6">
              <p className="w-full  to-transparent text-green-800 font-bold text-left sm:text-center text-xs sm:text-sm md:text-base rounded-md py-2 sm:py-3 px-2">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Carrusel;
