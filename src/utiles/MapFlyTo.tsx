// src/utiles/MapFlyTo.tsx
'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { usePositionsStore } from '@/store/map/positions.store';
import L from 'leaflet';

interface MapFlyToProps {
  targetZoom: number; // Zoom al que volar
  duration?: number; // Duración opcional de la animación
}

export function MapFlyTo({ targetZoom, duration = 1.5 }: MapFlyToProps) {
  const map = useMap();
  const currentZone = usePositionsStore((state) => state.currentZone);

  useEffect(() => {
    // Use map.whenReady() to ensure the map is fully initialized
    map.whenReady(() => {
      if (currentZone?.coordinate) {
        const targetLatLng = L.latLng(currentZone.coordinate.lat, currentZone.coordinate.lng);

        const tolerance = 0.00001; // Now map.getCenter() should be safe to call

        if (!map.getCenter().equals(targetLatLng, tolerance)) {
          map.flyTo(targetLatLng, targetZoom, {
            animate: true,
            duration: duration,
          });
        }
      }
    }); // Cleanup function if needed (though not strictly necessary for whenReady) // return () => { /* cleanup if you added listeners etc. */ };
  }, [currentZone, map, targetZoom, duration]); // Keep dependencies

  return null;
}
