'use client';

import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

interface FincaCardProps {
  finca: any;
  onEdit: () => void;
  onDelete: () => void;
}

// Carga perezosa del componente, si se usa dentro de una lista muy larga
// Esto no es estrictamente necesario, pero es una buena práctica para grandes listas
const FincaCardComponent = ({ finca, onEdit, onDelete }: FincaCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-2xl mx-auto transition-all">
      <div className="flex gap-4 items-start mb-2">
        {finca.fotoUrl ? (
          <img src={finca.fotoUrl} alt={finca.nombre} className="w-32 h-20 object-cover rounded" />
        ) : (
          <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 7V5a4 4 0 018 0v2"
              />
            </svg>
          </div>
        )}
      </div>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <div className="font-bold text-lg">{finca.nombre}</div>
          <div className="text-gray-600 text-sm">
            Ubicación: {finca.ubicacion || finca.localizacion}
          </div>
          <div className="text-gray-600 text-sm">Propietario: {finca.propietario}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-blue-600 hover:text-blue-800"
            title="Editar finca"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil />
          </button>
          <button
            className="p-2 text-red-600 hover:text-red-800"
            title="Eliminar finca"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 />
          </button>
          <span className="ml-2">{open ? <ChevronUp /> : <ChevronDown />}</span>
        </div>
      </div>
      {open && (
        <div className="mt-4 border-t pt-4 text-sm space-y-2">
          {finca.descripcion && (
            <div>
              <span className="font-semibold">Descripción:</span> {finca.descripcion}
            </div>
          )}
          {finca.tipoPropiedad && (
            <div>
              <span className="font-semibold">Tipo de propiedad:</span> {finca.tipoPropiedad}
            </div>
          )}
          {finca.entidadPertenece && (
            <div>
              <span className="font-semibold">Entidad a la que pertenece:</span>{' '}
              {finca.entidadPertenece}
            </div>
          )}
          {finca.usoActual && (
            <div>
              <span className="font-semibold">Uso actual:</span> {finca.usoActual}
            </div>
          )}
          {finca.estadoConservacion && (
            <div>
              <span className="font-semibold">Estado de conservación:</span>{' '}
              {finca.estadoConservacion}
            </div>
          )}
          {finca.problematicaDetectada && (
            <div>
              <span className="font-semibold">Problemática detectada:</span>{' '}
              {finca.problematicaDetectada}
            </div>
          )}
          {finca.tradicionesHistoria && (
            <div>
              <span className="font-semibold">Tradiciones e historia:</span>{' '}
              {finca.tradicionesHistoria}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {finca.elementosInteres?.length > 0 && (
              <div>
                <span className="font-semibold">Elementos de interés:</span>
                <ul className="list-disc ml-5">
                  {finca.elementosInteres.map((el: any, i: number) => (
                    <li key={i}>{el.nombre || el}</li>
                  ))}
                </ul>
              </div>
            )}
            {finca.actividadesAgroturisticas?.length > 0 && (
              <div>
                <span className="font-semibold">Actividades agroturísticas:</span>
                <ul className="list-disc ml-5">
                  {finca.actividadesAgroturisticas.map((el: any, i: number) => (
                    <li key={i}>{el.nombre || el}</li>
                  ))}
                </ul>
              </div>
            )}
            {finca.principiosSustentabilidad?.length > 0 && (
              <div>
                <span className="font-semibold">Principios de sustentabilidad:</span>
                <ul className="list-disc ml-5">
                  {finca.principiosSustentabilidad.map((el: any, i: number) => (
                    <li key={i}>{el.nombre || el}</li>
                  ))}
                </ul>
              </div>
            )}
            {finca.accionesAmbientales?.length > 0 && (
              <div>
                <span className="font-semibold">Acciones ambientales:</span>
                <ul className="list-disc ml-5">
                  {finca.accionesAmbientales.map((el: any, i: number) => (
                    <li key={i}>{el.nombre || el}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FincaCardComponent;
