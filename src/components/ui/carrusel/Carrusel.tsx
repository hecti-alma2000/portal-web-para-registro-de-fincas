// components/ui/carrusel/Carrusel.tsx
'use client';
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const images = [
  "/carrusel/1.webp",
  "/carrusel/2.webp",
  "/carrusel/3.webp",
  "/carrusel/4.webp"
];

const Carrusel = ({ swipeable = true }) => {
  return (
    // Contenedor principal del carrusel. Le damos un tamaño fijo.
    <div className="relative w-full max-w-lg mx-auto h-96">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={3000}
        swipeable={swipeable}
        // Se asegura que el componente Carousel ocupe el 100% de su contenedor
        className="w-full h-full"
      >
        {images.map((src, index) => (
          // Cada slide ocupa el 100% del alto y ancho de su contenedor.
          <div key={index} className="relative w-full h-96">
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill
              // ¡La corrección clave! Usamos "contain" para ver la imagen completa
              style={{ objectFit: "contain" }} 
              // Sugerencia para simplificar y optimizar el atributo 'sizes'
              sizes="(max-width: 768px) 100vw, 640px"
              // Agrega 'priority' si esta imagen es importante para el rendimiento
              priority={index === 0}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Carrusel;