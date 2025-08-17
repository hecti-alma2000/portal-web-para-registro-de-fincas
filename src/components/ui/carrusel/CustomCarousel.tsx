// src/components/ui/carrusel/CustomCarousel.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic"; // Importamos dynamic
import { usePositionsStore } from "@/store/map/positions.store";
import { Zone } from "@/interfaces";

// Creamos componentes dinámicos para los iconos
const LazyChevronLeft = dynamic(
  () => import("lucide-react").then((mod) => mod.ChevronLeft),
  {
    loading: () => <div className="w-6 h-6" />,
    ssr: false,
  }
);
const LazyChevronRight = dynamic(
  () => import("lucide-react").then((mod) => mod.ChevronRight),
  {
    loading: () => <div className="w-6 h-6" />,
    ssr: false,
  }
);

interface Props {
  zones: Zone[];
}

const CustomCarousel = ({ zones }: Props) => {
  // Eliminamos la importación estática de los iconos de aquí
  // import { ChevronLeft, ChevronRight } from "lucide-react";

  const emblaOptions = {
    loop: false,
    align: "start" as const,
    containScroll: "trimSnaps" as const,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLink, setActiveLink] = useState<{
    zoneId: string;
    type: "more" | "map";
  } | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi && activeIndex < zones.length - 1) {
      emblaApi.scrollNext();
    }
  }, [emblaApi, activeIndex]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!emblaApi || !zones || zones.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const stepWidth = containerWidth / zones.length;
    const step = Math.floor(clickX / stepWidth);
    emblaApi.scrollTo(step);
  };

  const setZone = usePositionsStore((state) => state.setZone);
  if (!zones || zones.length === 0) {
    return <div>No hay zonas para mostrar.</div>;
  }

  const slides = useMemo(() => {
    if (!zones || zones.length === 0) return [];

    return zones.map((zone, idx) => (
      <div
        key={zone.id}
        className={`relative flex-shrink-0 w-[90%] h-96 rounded overflow-hidden ${
          idx === activeIndex ? "active-slide" : ""
        }`}
        style={idx === activeIndex ? { willChange: "transform, opacity" } : {}}
      >
        <Image
          src={zone.image[0]}
          alt={zone.title}
          fill
          sizes="auto"
          style={{ objectFit: "cover" }}
          loading={idx === 0 ? "eager" : "lazy"}
          priority={idx === 0}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 bg-opacity-50 p-2 text-center text-lg">
          <div className="text-black text-2xl">{zone.title}</div>
          <hr />
          <div className="mt-2 flex justify-center gap-8">
            <Link
              href={`/zone/${zone.id}`}
              onClick={() => setActiveLink({ zoneId: zone.id, type: "more" })}
            >
              <span
                className={`text-black ${
                  activeLink?.zoneId === zone.id && activeLink?.type === "more"
                    ? "underline text-green-600 font-bold"
                    : "hover:underline hover:text-green-600"
                }`}
              >
                Leer más
              </span>
            </Link>

            <Link
              href="/maps"
              onClick={() => {
                setActiveLink({ zoneId: zone.id, type: "map" });
                setZone(zone.id);
              }}
            >
              <span
                className={`text-black ${
                  activeLink?.zoneId === zone.id && activeLink?.type === "map"
                    ? "underline text-green-600 font-bold"
                    : "hover:underline hover:text-green-600"
                }`}
              >
                Ver mapa
              </span>
            </Link>
          </div>
        </div>
      </div>
    ));
  }, [zones, activeIndex, activeLink, setZone]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{slides}</div>
      </div>

      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 p-2 rounded-full z-10"
        aria-label="Anterior"
      >
        <LazyChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={scrollNext}
        disabled={activeIndex === zones.length - 1}
        className={`hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 ${
          activeIndex === zones.length - 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-600"
        } p-2 rounded-full z-10`}
        aria-label="Siguiente"
      >
        <LazyChevronRight size={24} className="text-white" />
      </button>

      <div className="mt-10">
        <div
          className="relative w-full bg-gray-300 h-2 cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div
            className="absolute bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${100 / zones.length}%`,
              left: `${(activeIndex * 100) / zones.length}%`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes lastSlideTransition {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-5%);
          }
        }
        .active-slide {
          animation: lastSlideTransition 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomCarousel;
