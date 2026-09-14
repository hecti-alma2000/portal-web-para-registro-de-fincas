'use client';
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { usePositionsStore } from '@/store/map/positions.store';
import { FincaMarkers } from '../finca-markers/FincaMarkers';
import { divIcon } from 'leaflet';
import { MapFlyTo } from '@/utiles/MapFlyTo';
import MapInitializer from './MapInitializer';
import { FitBounds } from './FitBounds';
import { MapTileWatch } from './MapTileWatch';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Search,
  SlidersHorizontal,
  MapPinned,
  Route,
  Building2,
  Award,
  RotateCcw,
  FilterX,
  WifiOff,
  X,
} from 'lucide-react';
import type { MapFinca } from '@/interfaces/finca-map.interface';

interface LocationMapProps {
  fincas: MapFinca[];
}

const FALLBACK_BOUNDS: L.LatLngBoundsExpression = [
  [20.78, -76.72],
  [20.97, -76.48],
];

const selectClasses =
  'w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors';

export const LocationMap = ({ fincas }: LocationMapProps) => {
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

  const blueRoute1 = usePositionsStore((state) => state.blueRoute1);
  const blueRoute2 = usePositionsStore((state) => state.blueRoute2);
  const redRoute1 = usePositionsStore((state) => state.redRoute1);
  const redRoute2 = usePositionsStore((state) => state.redRoute2);
  const redRoute3 = usePositionsStore((state) => state.redRoute3);

  // --- Estado de Filtros ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterUso, setFilterUso] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [onlyCertificadas, setOnlyCertificadas] = useState(false);
  const [showFincas, setShowFincas] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [noTiles, setNoTiles] = useState(false);

  // --- Opciones derivadas de las fincas reales ---
  const usos = useMemo(
    () => Array.from(new Set(fincas.map((f) => f.usoActual).filter(Boolean) as string[])).sort(),
    [fincas]
  );
  const estados = useMemo(
    () =>
      Array.from(
        new Set(fincas.map((f) => f.estadoConservacion).filter(Boolean) as string[])
      ).sort(),
    [fincas]
  );

  // --- Fincas filtradas ---
  const filteredFincas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return fincas.filter((f) => {
      if (filterTipo && f.tipoPropiedad !== filterTipo) return false;
      if (filterUso && f.usoActual !== filterUso) return false;
      if (filterEstado && f.estadoConservacion !== filterEstado) return false;
      if (onlyCertificadas && !f.certificada) return false;
      if (term) {
        const hayable = `${f.nombre} ${f.localizacion} ${f.propietario}`.toLowerCase();
        if (!hayable.includes(term)) return false;
      }
      return true;
    });
  }, [fincas, searchTerm, filterTipo, filterUso, filterEstado, onlyCertificadas]);

  // --- Bounds del mapa (se ajusta a los resultados del filtro) ---
  const bounds = useMemo(() => {
    if (filteredFincas.length > 0) {
      const b = L.latLngBounds(
        filteredFincas.map((f) => L.latLng(f.latitude, f.longitude))
      );
      if (b.isValid()) return b;
    }
    return L.latLngBounds(FALLBACK_BOUNDS);
  }, [filteredFincas]);

  const countActiveFilters =
    (filterTipo ? 1 : 0) +
    (filterUso ? 1 : 0) +
    (filterEstado ? 1 : 0) +
    (onlyCertificadas ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const hasFiltros = countActiveFilters > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTipo('');
    setFilterUso('');
    setFilterEstado('');
    setOnlyCertificadas(false);
  };

  // Marcadores de etiquetas de rutas (Memorizados para evitar saltos)
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
      <h1 className="text-center text-green-500 text-3xl mb-2 font-bold">
        Rutas Agroturísticas de Calixto García
      </h1>
      <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-6">
        Localiza las fincas certificadas y recorre las rutas agroalimentaria y agroganadera.
      </p>

      {/* ---------- Panel de Filtros Profesional ---------- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 md:p-5 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
            <SlidersHorizontal className="w-5 h-5 text-green-600" />
            Filtros de exploración
          </h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
              <MapPinned className="w-3.5 h-3.5" />
              {filteredFincas.length} de {fincas.length} fincas
            </span>
            {hasFiltros && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar finca, lugar, propietario..."
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-8 py-2 text-sm text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tipo de propiedad */}
          <div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className={selectClasses}
            >
              <option value="">Toda propiedad</option>
              <option value="ESTATAL">Estatal</option>
              <option value="PRIVADA">Privada</option>
            </select>
          </div>

          {/* Uso actual */}
          <div>
            <select
              value={filterUso}
              onChange={(e) => setFilterUso(e.target.value)}
              className={selectClasses}
            >
              <option value="">Todos los usos</option>
              {usos.map((uso) => (
                <option key={uso} value={uso}>
                  {uso}
                </option>
              ))}
            </select>
          </div>

          {/* Estado de conservación */}
          <div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className={selectClasses}
            >
              <option value="">Cualquier conservación</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles secundarios */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Certificadas + Capas */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setOnlyCertificadas((v) => !v)}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                onlyCertificadas
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  onlyCertificadas
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {onlyCertificadas && <Award className="w-3 h-3" />}
              </span>
              Solo certificadas
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                Capas:
              </span>
              <button
                type="button"
                onClick={() => setShowFincas((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  showFincas
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}
              >
                <MapPinned className="w-3.5 h-3.5" /> Fincas
              </button>
              <button
                type="button"
                onClick={() => setShowRoutes((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  showRoutes
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}
              >
                <Route className="w-3.5 h-3.5" /> Rutas
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>
      </div>

      {/* ---------- Mapa ---------- */}
      <div
        className={`relative rounded-xl overflow-hidden shadow-2xl border dark:border-slate-700 ${
          noTiles ? 'map-no-tiles' : ''
        }`}
      >
        <MapContainer
          bounds={bounds}
          center={[20.886992464628573, -76.5981011376514]}
          zoom={11}
          minZoom={3}
          maxZoom={18}
          className="h-150 w-full relative z-0"
        >
          <MapInitializer />
          <FitBounds bounds={bounds} />
          <MapTileWatch onStatusChange={setNoTiles} />

<TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

          <MapFlyTo targetZoom={15} />

          {showRoutes && (
            <>
              <Marker position={[20.87, -76.568]} icon={labels.agroalimentaria} />
              <Marker position={[20.8777, -76.68]} icon={labels.agroganadera} />

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
            </>
          )}

          {showFincas && <FincaMarkers fincas={filteredFincas} />}
        </MapContainer>

        {/* Aviso de mapa sin conexión */}
        {noTiles && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 dark:bg-black/70 text-white text-xs font-semibold shadow-lg backdrop-blur-sm">
            <WifiOff className="w-3.5 h-3.5" />
            Sin conexión: se muestra el mapa base simplificado
          </div>
        )}

        {/* Capa sin resultados */}
        {showFincas && filteredFincas.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <div className="text-center px-6 py-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
              <Building2 className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-base font-bold text-gray-800 dark:text-white">
                No hay fincas que coincidan
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Ajusta o limpia los filtros para ver más resultados.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                <FilterX className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      {showRoutes && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            <span className="w-6 h-1.5 rounded-full bg-[#1A237E] dark:bg-[#5C6BC0]" />
            Ruta Agroganadera
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-6 h-1.5 rounded-full bg-[#8BC34A]" />
            Ruta Agroalimentaria
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-600 border-2 border-white dark:border-slate-900 shadow" />
            Finca certificada / posicionada
          </span>
        </div>
      )}
    </div>
  );
};