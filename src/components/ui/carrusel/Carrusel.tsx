// components/ui/carrusel/Carrusel.tsx
'use client';
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// 1. Modifica la estructura de datos:
// Ahora `images` es un array de objetos, donde cada objeto
// tiene la propiedad `src` (la ruta de la imagen) y `description`.
const images = [
  { src: "/carrusel/1.webp", description: " Finca El Troncón. Atractivos y potencialidades" },
  { src: "/carrusel/2.webp", description: "Finca El Troncón. Principales atractivos" },
  { src: "/carrusel/3.webp", description: "Finca El Troncón. Principal masa ganadera. Ganadero Nolberto Santiesteban" },
  { src: "/carrusel/4.webp", description: "Finca El Troncón. Minindustria en finca colindante La Gloria" },
  { src: "/carrusel/5.webp", description: "Carlos Pozo Ramírez, ganadero que transformó su finca en un polígono de experimentación para obtener Bovinos mejor adaptado al cambio climático." },
  { src: "/carrusel/6.webp", description: "Coto de reserva de caza Las Maravillas Extensión 52 Hectáreas" },
  { src: "/carrusel/7.webp", description: "Sendero de la finca, mostrando la organización de las áreas para la producción y el pastoreo." },
  { src: "/carrusel/8.webp", description: "Infraestructura de la finca: molino de viento para agua y corrales de manejo." }
];

const Carrusel = ({ swipeable = true }) => {
  return (
    <div className="relative bg-green-500 text-white h-96 overflow-hidden">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={3000}
        swipeable={swipeable}
        selectedItem={0}
      >
        {/* 2. Recorre el nuevo array de objetos y accede a la descripción */}
        {images.map((image, index) => (
          <div key={index} className="relative h-96 overflow-hidden">
            <Image
              src={image.src} // Usa `image.src` para acceder a la ruta
              alt={`Slide ${index}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              style={{ objectFit: "cover" }}
              priority={index === 0}
            />
            {/* 3. Agrega la descripción al final de cada slide */}
            <p className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-center">
              {image.description}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Carrusel;