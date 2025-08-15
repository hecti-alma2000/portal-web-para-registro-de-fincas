"use client";

import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { icon } from "leaflet";
import { MapPin } from "lucide-react"; // Importamos el ícono de Lucide React
import Image from "next/image";
import { usePositionsStore } from "@/store/map/positions.store";
import { MarkerTrailsProps } from "./markerTrails.types";
import dynamic from "next/dynamic";

// Mapeo de iconos para una mejor gestión
const iconMap = {
  "1": "/icons/1.svg",
  "2": "/icons/2.svg",
  "3": "/icons/3.png",
  "4": "/icons/4.png",
  "5": "/icons/5.png",
  "6": "/icons/6.png",
  "7": "/icons/7.png",
};

// Generador de íconos personalizados
const getCustomIcon = (iconType: keyof typeof iconMap) => {
  const iconUrl = iconMap[iconType];
  return icon({
    iconUrl: iconUrl || "",
    iconSize: [30, 30],
  });
};

// El componente principal, cargado dinámicamente
export const MarkerTrails = (props: MarkerTrailsProps) => {
  const { selectMarker } = props;
  const fnMap = useMap();
  const importantPoints = usePositionsStore((state) => state.importantPoints);

  return (
    <>
      {importantPoints.map((point) =>
        point.position && point.icon ? (
          <Marker
            key={point.id}
            position={point.position}
            icon={getCustomIcon(point.icon as keyof typeof iconMap)}
            eventHandlers={{
              click: () => {
                selectMarker(point.position, fnMap);
              },
            }}
          >
            <Popup className="custom-image-popup">
              <div className="flex items-center mb-2">
                <span className="mr-4 text-red-600">
                  <MapPin size={20} /> {/* Usamos el ícono de Lucide React */}
                </span>
                <h5 className="text-lg font-bold text-gray-800">
                  {point.name}
                </h5>
              </div>
              {point.image && (
                <div className="relative w-75 h-55 mx-auto">
                  <Image
                    src={point.image}
                    alt={point.name || "Point"}
                    fill={true}
                    className="rounded-md shadow-lg object-cover"
                    sizes="600px"
                    loading="lazy"
                  />
                </div>
              )}
              <h1 className="text-2xl mt-3">Simbología:</h1>
              <hr />
              <h2 className="font-bold">Límite del Área de la Finca</h2>
              {point.simbology.map((item, index) => (
                <ul key={index}>
                  <li>{item}</li>
                </ul>
              ))}
            </Popup>
            <Tooltip
              permanent
              direction="top"
              offset={[0, -15]}
              className="custom-tooltip-label"
            >
              {point.name}
            </Tooltip>
          </Marker>
        ) : null
      )}
    </>
  );
};

// Carga perezosa del componente en una nueva exportación
export default dynamic(() => Promise.resolve(MarkerTrails), {
  ssr: false,
});