'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

interface MapTileWatchProps {
  onStatusChange: (offline: boolean) => void;
}

const isOnline = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);

const DEBOUNCE_MS = 1200;

// Observa el estado de los tiles del mapa. Si fallan en cadena (sin conexión o
// el proveedor no está disponible), avisa para mostrar el mapa base simplificado.
export const MapTileWatch = ({ onStatusChange }: MapTileWatchProps) => {
  const map = useMap();
  const hadErrorRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const considerOffline = () => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (hadErrorRef.current || !isOnline()) {
          onStatusChange(true);
        }
      }, DEBOUNCE_MS);
    };

    const handleTileLoad = () => {
      hadErrorRef.current = false;
      clearTimer();
      onStatusChange(!isOnline());
    };

    const handleTileError = () => {
      hadErrorRef.current = true;
      considerOffline();
    };

    const handleOffline = () => onStatusChange(true);
    const handleOnline = () => {
      hadErrorRef.current = false;
      clearTimer();
      onStatusChange(false);
    };

    map.on('tileload', handleTileLoad);
    map.on('tileerror', handleTileError);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (!isOnline()) onStatusChange(true);

    return () => {
      map.off('tileload', handleTileLoad);
      map.off('tileerror', handleTileError);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimer();
    };
  }, [map, onStatusChange]);

  return null;
};