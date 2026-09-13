'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface FitBoundsProps {
  bounds: L.LatLngBounds;
}

export const FitBounds = ({ bounds }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds || !bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
  }, [bounds, map]);

  return null;
};