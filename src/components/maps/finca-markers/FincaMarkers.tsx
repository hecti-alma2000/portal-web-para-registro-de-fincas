'use client';

import { Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { MapPin, MapPinned, Landmark, Leaf, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { importantPoints } from '../marker-trails/markerTrails.data';
import type { MapFinca } from '@/interfaces/finca-map.interface';

interface FincaMarkersProps {
  fincas: MapFinca[];
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getTrailPoint = (nombre: string) => {
  const n = normalize(nombre);
  return importantPoints.find(
    (p) => n.includes(normalize(p.name)) || normalize(p.name).includes(n)
  );
};

const getPinIcon = (nombre: string) => {
  const initial = nombre.trim().charAt(0).toUpperCase() || 'F';
  const html = `
    <div class="flex flex-col items-center">
      <div class="finca-pin w-10 h-10 rounded-full bg-green-600 border-[2.5px] border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white font-extrabold text-lg">${initial}</div>
      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[9px] border-l-transparent border-r-transparent border-t-green-600 -mt-[3px]"></div>
    </div>`;
  return divIcon({
    html,
    className: 'custom-finca-marker',
    iconSize: [40, 46],
    iconAnchor: [20, 46],
    popupAnchor: [0, -44],
  });
};

export const FincaMarkers = ({ fincas }: FincaMarkersProps) => {
  const map = useMap();

  return (
    <>
      {fincas.map((finca) => {
        const trailPoint = getTrailPoint(finca.nombre);
        return (
          <Marker
            key={finca.id}
            position={[finca.latitude, finca.longitude]}
            icon={getPinIcon(finca.nombre)}
            eventHandlers={{
              click: () => map.flyTo([finca.latitude, finca.longitude], 15, { duration: 0.8 }),
            }}
          >
            <Popup className="finca-popup">
              <div className="w-60">
                <div className="relative">
                  {finca.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={finca.fotoUrl}
                      alt={finca.nombre}
                      className="w-full h-32 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
                      <MapPinned size={36} />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                    {finca.tipoPropiedad === 'ESTATAL' ? 'Estatal' : 'Privada'}
                  </span>
                  {finca.certificada && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                      <Award size={10} /> Certificada
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-2">
                  {finca.nombre}
                </h4>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-1 mt-1">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  {finca.localizacion}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {finca.usoActual && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      <Leaf size={10} /> {finca.usoActual}
                    </span>
                  )}
                  {finca.estadoConservacion && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">
                      <Landmark size={10} /> {finca.estadoConservacion}
                    </span>
                  )}
                </div>

                {trailPoint && trailPoint.simbology.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-700">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Simbología
                    </p>
                    <ul className="text-[11px] text-zinc-600 dark:text-zinc-300 list-disc list-inside space-y-0.5">
                      {trailPoint.simbology.map((item, i) => (
                        <li key={i}>{item.replace(/^[-*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/fincas/${finca.id}`}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 rounded-lg transition-colors"
                >
                  Ver detalle <ArrowRight size={14} />
                </Link>
              </div>
            </Popup>
            <Tooltip permanent direction="top" offset={[0, -36]} className="custom-tooltip-label">
              {finca.nombre}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};