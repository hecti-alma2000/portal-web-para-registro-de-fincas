// components/ui/carrusel/Carrusel.tsx
'use client';
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const images = [
  "/maps/finca_el_troncon.webp",
  "/maps/finca_la_alegria.webp",
  "/maps/finca_la_bendecida.webp",
  "/maps/finca_la_gloria.webp",
  "/maps/finca_la_margarita.webp",
  "/maps/finca_la_prospera.webp",
  "/maps/finca_las_maravillas.webp"
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
              style={{ objectFit: "cover" }}
              // Asegúrate de que los 'sizes' reflejen el ancho real del carrusel
              // en tu diseño para una carga óptima. Por ejemplo:
              // Para un carrusel que es la mitad de la pantalla en md:
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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