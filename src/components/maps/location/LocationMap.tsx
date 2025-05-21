"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import { usePositionsStore } from "@/store/map/positions.store";
import type { Positions } from "@/store/map/positions.store";
import { SearchBar } from "@/components/search-bar/SearchBar";
import { divIcon } from "leaflet";
import { MapFlyTo } from "@/utiles/MapFlyTo";
import MapInitializer from "./MapInitializer";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MarkerTrails } from "../marker-trails";

// --- Funciones de Utilidad Fuera del Componente ---

const calculateRouteDistance = (positions: [number, number][]): number => {
  let totalDistance = 0;
  if (positions.length < 2) {
    return 0;
  }
  for (let i = 0; i < positions.length - 1; i++) {
    const p1 = L.latLng(positions[i][0], positions[i][1]);
    const p2 = L.latLng(positions[i + 1][0], positions[i + 1][1]);
    totalDistance += p1.distanceTo(p2);
  }
  return totalDistance / 1000;
};

const formatMinutesToHoursAndMinutes = (minutes: number): string => {
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    if (totalMinutes === 0) return "Menos de 1 min";
    return `${totalMinutes}min`;
  }
};

// --- Componente Principal ---

export const LocationMap = () => {
  const blueRoute1 = usePositionsStore((state) => state.blueRoute1);
  const blueRoute2 = usePositionsStore((state) => state.blueRoute2);
  const redRoute1 = usePositionsStore((state) => state.redRoute1);
  const redRoute2 = usePositionsStore((state) => state.redRoute2);
  const redRoute3 = usePositionsStore((state) => state.redRoute3);

  const setImportantPoints = usePositionsStore(
    (state: Positions) => state.setImportantPoints
  );
  const setCurrentZone = usePositionsStore((state) => state.setCurrentZone);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setImportantPoints(searchTerm);
  }, [searchTerm, setImportantPoints, setCurrentZone]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [agroalimentariaStats, setAgroalimentariaStats] = useState({
    distanceKm: 0,
    timeMinutes: 0,
  });
  const [agroganaderaStats, setAgroganaderaStats] = useState({
    distanceKm: 0,
    timeMinutes: 0,
  });

  useEffect(() => {
    const distRedRoute1 = calculateRouteDistance(
      redRoute1.map((p) => [p.lat, p.lng] as [number, number])
    );
    const distRedRoute2 = calculateRouteDistance(
      redRoute2.map((p) => [p.lat, p.lng] as [number, number])
    );
    const distRedRoute3 = calculateRouteDistance(
      redRoute3.map((p) => [p.lat, p.lng] as [number, number])
    );

    const agroalimentariaDist = distRedRoute1 + distRedRoute2 + distRedRoute3;

    const avgSpeedKmH = 25;
    const agroalimentariaTime = (agroalimentariaDist / avgSpeedKmH) * 60;
    setAgroalimentariaStats({
      distanceKm: agroalimentariaDist,
      timeMinutes: agroalimentariaTime,
    });

    const totalAgroganaderaPositions = [
      ...blueRoute1.map((p) => [p.lat, p.lng] as [number, number]),
      ...blueRoute2.map((p) => [p.lat, p.lng] as [number, number]),
    ];
    const agroganaderaDist = calculateRouteDistance(totalAgroganaderaPositions);
    const agroganaderaTime = (agroganaderaDist / avgSpeedKmH) * 60;
    setAgroganaderaStats({
      distanceKm: agroganaderaDist,
      timeMinutes: agroganaderaTime,
    });
  }, [blueRoute1, blueRoute2, redRoute1, redRoute2, redRoute3]);

  const selectMarker = (
    position: { lat: number; lng: number },
    mapInstance: L.Map
  ) => {
    if (mapInstance) {
      mapInstance.flyTo(L.latLng(position.lat, position.lng), 15);
    }
  };

  const initialCenter: [number, number] = [
    20.886992464628573, -76.5981011376514,
  ];

  const bounds: L.LatLngBoundsExpression = [
    [20.78, -76.72],
    [20.97, -76.48],
  ];

  // ** --- DECLARACIÓN DE COORDENADAS PARA LAS ETIQUETAS EN EL MAPA --- **
  // Haremos ajustes más grandes en las coordenadas para separarlas.

  // Ruta Agroalimentaria: Moveremos el nombre un poco al NORTE y sus stats un poco más al SUR
  const agroalimentariaNameCoords: [number, number] = [20.87, -76.568]; // Ajustado al Norte
  const agroalimentariaStatsCoords: [number, number] = [20.858, -76.575]; // Ajustado más al Sur

  // Ruta Agroganadera: Moveremos el nombre un poco al OESTE y sus stats un poco más al OESTE también, pero al Sur.
  const agroganaderaNameCoords: [number, number] = [20.8777, -76.68]; // Ajustado más al Oeste
  const agroganaderaStatsCoords: [number, number] = [20.87, -76.685]; // Ajustado más al Sur y al Oeste

  // ** --- FIN DECLARACIÓN DE COORDENADAS --- **

  // Crear DivIcon para Ruta Agroalimentaria (NOMBRE)
  const agroalimentariaLabel = divIcon({
    html: '<div class="leaflet-label" style="font-weight: bold; color: black; text-shadow: 1px 1px 2px white; font-size: 18px;">RUTA AGROALIMENTARIA</div>',
    className: "text-label",
    iconSize: [250, 25],
    iconAnchor: [125, 0], // Anclaje superior central del icono
  });

  // Crear DivIcon para Ruta Agroganadera (NOMBRE)
  const agroganaderaLabel = divIcon({
    html: '<div class="leaflet-label" style="font-weight: bold; color: black; text-shadow: 1px 1px 2px white; font-size: 18px;">RUTA AGROGANADERA</div>',
    className: "text-label",
    iconSize: [250, 25],
    iconAnchor: [125, 0], // Anclaje superior central del icono
  });

  // Crear DivIcon para Estadísticas de Ruta Agroalimentaria (Distancia/Tiempo)
  const agroalimentariaStatsLabel = divIcon({
    html: `
    <div style="font-weight: bold; color: black; text-shadow: 1px 1px 2px white; font-size: 14px;">
      Distancia: ${agroalimentariaStats.distanceKm.toFixed(2)} km<br/>
      Tiempo (auto est.): ${formatMinutesToHoursAndMinutes(
        agroalimentariaStats.timeMinutes
      )}
    </div>
  `,
    className: "leaflet-div-icon-stats",
    iconSize: [250, 40],
    iconAnchor: [125, 20], // Anclaje un poco más abajo para centrar verticalmente
  });

  // Crear DivIcon para Estadísticas de Ruta Agroganadera (Distancia/Tiempo)
  const agroganaderaStatsLabel = divIcon({
    html: `
    <div style="font-weight: bold; color: black; text-shadow: 1px 1px 2px white; font-size: 14px;">
      Distancia: ${agroganaderaStats.distanceKm.toFixed(2)} km<br/>
      Tiempo (auto est.): ${formatMinutesToHoursAndMinutes(
        agroganaderaStats.timeMinutes
      )}
    </div>
  `,
    className: "leaflet-div-icon-stats",
    iconSize: [250, 40],
    iconAnchor: [125, 20], // Anclaje un poco más abajo para centrar verticalmente
  });

  return (
    <div className="px-1 md:px-10 md:py-10">
      <h1 className="text-center text-black text-3xl mb-5 animate__animated animate__fadeIn">
        Rutas Agroturísticas Municipio Calixto García
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mb-2">
        <div className="w-full md:w-1/2">
          <SearchBar
            value={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Filtrar puntos de interés..."
          />
        </div>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        minZoom={13}
        maxZoom={16} // Aumentado el maxZoom para permitir mayor detalle si se desea
        className="h-[800px] rounded-lg shadow-md"
      >
        <MapInitializer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapFlyTo targetZoom={15} />
        <MarkerTrails selectMarker={selectMarker} />

        {/* Marcadores para los NOMBRES de Ruta */}
        <Marker
          position={agroalimentariaNameCoords}
          icon={agroalimentariaLabel}
        />
        <Marker position={agroganaderaNameCoords} icon={agroganaderaLabel} />

        {/* Marcadores para las ESTADÍSTICAS de Ruta (Distancia/Tiempo) */}
        {agroalimentariaStats.distanceKm > 0 && (
          <Marker
            position={agroalimentariaStatsCoords}
            icon={agroalimentariaStatsLabel}
          />
        )}
        {agroganaderaStats.distanceKm > 0 && (
          <Marker
            position={agroganaderaStatsCoords}
            icon={agroganaderaStatsLabel}
          />
        )}

        {/* Polylines para dibujar las Rutas */}
        <Polyline
          positions={blueRoute1}
          color="#1A237E"
          weight={8}
          opacity={0.7}
        />
        <Polyline
          positions={blueRoute2}
          color="#1A237E"
          weight={8}
          opacity={0.7}
        />
        <Polyline
          positions={redRoute1}
          color="#8BC34A"
          weight={8}
          opacity={0.7}
        />
        <Polyline
          positions={redRoute2}
          color="#8BC34A"
          weight={8}
          opacity={0.7}
        />
        <Polyline
          positions={redRoute3}
          color="#8BC34A"
          weight={8}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  );
};
