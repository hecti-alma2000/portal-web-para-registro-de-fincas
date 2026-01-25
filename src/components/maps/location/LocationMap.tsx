'use client';
import { useEffect, useState, useMemo } from 'react'; // Añadido useMemo
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { usePositionsStore } from '@/store/map/positions.store';
import { SearchBar } from '@/components/search-bar/SearchBar';
import { divIcon } from 'leaflet';
import { MapFlyTo } from '@/utiles/MapFlyTo';
import MapInitializer from './MapInitializer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MarkerTrails } from '../marker-trails';

// --- Funciones de Utilidad ---
const calculateRouteDistance = (positions: [number, number][]): number => {
  let totalDistance = 0;
  if (positions.length < 2) return 0;
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
  if (hours > 0) return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'min' : ''}`;
  return totalMinutes === 0 ? 'Menos de 1 min' : `${totalMinutes}min`;
};

export const LocationMap = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Lógica de detección de tema mejorada
  useEffect(() => {
    const getDarkStatus = () => {
      if (typeof document === 'undefined') return false;

      // Prioridad 1: Clase en el HTML (estándar de Tailwind/Next-themes)
      const hasHtmlClass = document.documentElement.classList.contains('dark');
      // Prioridad 2: LocalStorage
      const ls = window.localStorage.getItem('theme');
      if (ls === 'dark') return true;
      if (ls === 'light') return false;

      // Prioridad 3: Preferencia del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // Ajuste inicial
    setIsDarkMode(getDarkStatus());

    // Observador para cambios de clase en el HTML (cuando el usuario alterna el botón de tema)
    const observer = new MutationObserver(() => {
      setIsDarkMode(getDarkStatus());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // --- Store y Estados de Rutas ---
  const blueRoute1 = usePositionsStore((state) => state.blueRoute1);
  const blueRoute2 = usePositionsStore((state) => state.blueRoute2);
  const redRoute1 = usePositionsStore((state) => state.redRoute1);
  const redRoute2 = usePositionsStore((state) => state.redRoute2);
  const redRoute3 = usePositionsStore((state) => state.redRoute3);
  const setImportantPoints = usePositionsStore((state) => state.setImportantPoints);

  const [searchTerm, setSearchTerm] = useState('');
  const [agroalimentariaStats, setAgroalimentariaStats] = useState({
    distanceKm: 0,
    timeMinutes: 0,
  });
  const [agroganaderaStats, setAgroganaderaStats] = useState({ distanceKm: 0, timeMinutes: 0 });

  useEffect(() => {
    setImportantPoints(searchTerm);
  }, [searchTerm, setImportantPoints]);

  useEffect(() => {
    const distRed =
      calculateRouteDistance(redRoute1.map((p) => [p.lat, p.lng] as [number, number])) +
      calculateRouteDistance(redRoute2.map((p) => [p.lat, p.lng] as [number, number])) +
      calculateRouteDistance(redRoute3.map((p) => [p.lat, p.lng] as [number, number]));

    const distBlue = calculateRouteDistance(
      [...blueRoute1, ...blueRoute2].map((p) => [p.lat, p.lng] as [number, number])
    );

    const speed = 25;
    setAgroalimentariaStats({ distanceKm: distRed, timeMinutes: (distRed / speed) * 60 });
    setAgroganaderaStats({ distanceKm: distBlue, timeMinutes: (distBlue / speed) * 60 });
  }, [blueRoute1, blueRoute2, redRoute1, redRoute2, redRoute3]);

  // --- Configuración Visual del Mapa ---
  const initialCenter: [number, number] = [20.886992464628573, -76.5981011376514];
  const bounds: L.LatLngBoundsExpression = [
    [20.78, -76.72],
    [20.97, -76.48],
  ];

  // Marcadores de etiquetas (Memorizados para evitar saltos)
  const labels = useMemo(
    () => ({
      agroalimentaria: divIcon({
        html: `<div class="font-bold text-base md:text-lg ${
          isDarkMode ? 'text-white' : 'text-black'
        }">RUTA AGROALIMENTARIA</div>`,
        className: 'bg-transparent border-none pointer-events-none',
        iconSize: [250, 25],
      }),
      agroganadera: divIcon({
        html: `<div class="font-bold text-base md:text-lg ${
          isDarkMode ? 'text-white' : 'text-black'
        }">RUTA AGROGANADERA</div>`,
        className: 'bg-transparent border-none pointer-events-none',
        iconSize: [250, 25],
      }),
    }),
    [isDarkMode]
  );

  return (
    <div className="px-1 md:px-10 md:py-10 transition-colors duration-500">
      <h1 className="text-center text-green-500 text-3xl mb-5 font-bold">
        Rutas Agroturísticas de Calixto García
      </h1>

      <div className="w-full md:w-1/2 mb-4">
        <SearchBar
          value={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar puntos..."
        />
      </div>

      <MapContainer
        center={initialCenter}
        zoom={13}
        maxBounds={bounds}
        minZoom={13}
        className="h-150 rounded-xl shadow-2xl relative z-0 border dark:border-slate-700"
      >
        <MapInitializer />

        {/* 🔑 LA SOLUCIÓN: El atributo 'key' fuerza el re-renderizado del TileLayer al cambiar de modo */}
        <TileLayer
          key={isDarkMode ? 'dark-tile' : 'light-tile'}
          url={
            isDarkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        <MapFlyTo targetZoom={15} />
        <MarkerTrails selectMarker={(pos, map) => map.flyTo(L.latLng(pos.lat, pos.lng), 15)} />

        {/* Nombres de Rutas */}
        <Marker position={[20.87, -76.568]} icon={labels.agroalimentaria} />
        <Marker position={[20.8777, -76.68]} icon={labels.agroganadera} />

        {/* Polylines */}
        <Polyline
          positions={blueRoute1}
          color={isDarkMode ? '#5C6BC0' : '#1A237E'}
          weight={6}
          opacity={0.8}
        />
        <Polyline
          positions={blueRoute2}
          color={isDarkMode ? '#5C6BC0' : '#1A237E'}
          weight={6}
          opacity={0.8}
        />
        <Polyline positions={redRoute1} color="#8BC34A" weight={6} opacity={0.8} />
        <Polyline positions={redRoute2} color="#8BC34A" weight={6} opacity={0.8} />
        <Polyline positions={redRoute3} color="#8BC34A" weight={6} opacity={0.8} />
      </MapContainer>
    </div>
  );
};
