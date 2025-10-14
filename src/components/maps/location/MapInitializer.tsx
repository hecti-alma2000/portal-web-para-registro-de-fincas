// src/components/maps/MapInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Este componente no renderiza nada, solo realiza una acción sobre el mapa
const MapInitializer = () => {
  const map = useMap(); // Obtiene la instancia del mapa

  useEffect(() => {
    // map.whenReady() espera a que el mapa haya terminado de cargar y configurar su vista inicial
    map.whenReady(() => {
      map.invalidateSize(); // Fuerza a Leaflet a recalcular el tamaño del contenedor
    });

    // No se necesita una función de limpieza específica para whenReady en este caso
  }, [map]); // La dependencia [map] asegura que este efecto se ejecute cuando la instancia del mapa esté disponible

  return null; // No renderiza ningún elemento visual
};

export default MapInitializer;
