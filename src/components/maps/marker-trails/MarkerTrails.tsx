"use client";

import { Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { icon } from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import { usePositionsStore } from "@/store/map/positions.store";
import { MarkerTrailsProps } from "./markerTrails.types";

// Generador de íconos personalizados
const getCustomIcon = (iconType: string) => {
  const baseIconPath = "/icons";

  switch (iconType) {
    case "1":
      return icon({
        iconUrl: `${baseIconPath}/1.svg`,
        iconSize: [35, 35],
      });
    case "2":
      return icon({
        iconUrl: `${baseIconPath}/2.svg`,
        iconSize: [30, 30],
      });
    case "3":
      return icon({
        iconUrl: `${baseIconPath}/3.png`,
        iconSize: [30, 30],
      });
    case "4":
      return icon({
        iconUrl: `${baseIconPath}/4.png`,
        iconSize: [30, 30],
      });
    case "5":
      return icon({
        iconUrl: `${baseIconPath}/5.png`,
        iconSize: [30, 30],
      });
    case "6":
      return icon({
        iconUrl: `${baseIconPath}/6.png`,
        iconSize: [30, 30],
      });
    case "7":
      return icon({
        iconUrl: `${baseIconPath}/7.png`,
        iconSize: [30, 30],
      });
    default:
      return icon({
        iconUrl: ``,
        iconSize: [30, 30],
      });
  }
};

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
            icon={getCustomIcon(point.icon)}
            eventHandlers={{
              click: () => {
                selectMarker(point.position, fnMap);
              },
            }}
          >
            {/* Ajustes en el Popup */}
            {/* Añadimos una clase personalizada al Popup */}
            <Popup className="custom-image-popup">
              <div className="flex items-center mb-2">
                <span className="mr-4 text-red-600">
                  <FaMapMarkerAlt />
                </span>
                <h5 className="text-lg font-bold text-gray-800">
                  {point.name}
                </h5>
              </div>
              {point.image && (
                // Contenedor de la imagen: Mantenemos clases de tamaño y centrado
                <div className=" relative w-75 h-55 mx-auto">
                  <Image
                    src={point.image}
                    alt={point.name || "Point"}
                    fill={true}
                    className="rounded-md shadow-lg object-cover"
                    sizes="600px"
                  />
                </div>
              )}
              <h1 className="text-2xl mt-3">Simbología:</h1>
              <hr />
              <h2 className="font-bold">Límite del Area de la Finca</h2>
              {point.simbology.map((item, index) => (
                <ul key={index}>
                  <li>{item}</li>
                </ul>
              ))}
            </Popup>
            <Tooltip
              permanent // Hace que el tooltip este siempre visible
              direction="top" // Posiciona el tooltip encima del marcador
              offset={[0, -15]} // Ajusta la posicion fina (0 horizontal, -15 vertical hacia arriba)
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
