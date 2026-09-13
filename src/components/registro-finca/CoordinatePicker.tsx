'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinned, LocateFixed, X } from 'lucide-react';

interface CoordinatePickerProps {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
}

const DEFAULT_CENTER: [number, number] = [20.886992464628573, -76.5981011376514];

const url =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const darkUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const getPinIcon = () =>
  divIcon({
    html: `<div class="flex flex-col items-center">
      <div class="w-9 h-9 rounded-full bg-green-600 border-[2.5px] border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>
      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[9px] border-l-transparent border-r-transparent border-t-green-600 -mt-[3px]"></div>
    </div>`,
    className: 'custom-finca-marker',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -40],
  });

const ClickHandler = ({ onPick }: { onPick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const Recenter = ({ lat, lng }: { lat: number | null; lng: number | null }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
};

export const CoordinatePicker = ({ latitude, longitude, onChange }: CoordinatePickerProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getDarkStatus = () => {
      if (typeof document === 'undefined') return false;
      const hasHtmlClass = document.documentElement.classList.contains('dark');
      const ls = window.localStorage.getItem('theme');
      if (ls === 'dark') return true;
      if (ls === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    setIsDarkMode(getDarkStatus());
    const observer = new MutationObserver(() => setIsDarkMode(getDarkStatus()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const parsedLat = latitude.trim() === '' ? null : Number(latitude);
  const parsedLng = longitude.trim() === '' ? null : Number(longitude);
  const hasPoint =
    parsedLat !== null &&
    parsedLng !== null &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng);

  const center: [number, number] = hasPoint ? [parsedLat!, parsedLng!] : DEFAULT_CENTER;

  const handlePick = (lat: number, lng: number) => {
    onChange(lat.toFixed(6), lng.toFixed(6));
  };

  const handleLocate = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePick(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          Haz clic sobre el mapa para marcar la ubicación exacta de la finca.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocate}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/60 transition-colors"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            Usar mi ubicación
          </button>
          {hasPoint && (
            <button
              type="button"
              onClick={() => onChange('', '')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Quitar punto
            </button>
          )}
        </div>
      </div>

      <div className="relative h-64 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
        <MapContainer
          center={center}
          zoom={hasPoint ? 14 : 11}
          className="w-full h-full z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            key={isDarkMode ? 'dark-tile' : 'light-tile'}
            url={isDarkMode ? darkUrl : url}
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />
          <ClickHandler onPick={handlePick} />
          <Recenter lat={parsedLat} lng={parsedLng} />
          {hasPoint && <Marker position={[parsedLat!, parsedLng!]} icon={getPinIcon()} />}
        </MapContainer>
      </div>
    </div>
  );
};