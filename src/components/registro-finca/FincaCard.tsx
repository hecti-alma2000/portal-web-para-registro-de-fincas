'use client';

import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface FincaCardProps {
  finca: any;
  onEdit: () => void;
  onDelete: () => void;
}

const FincaCardComponent = ({ finca, onEdit, onDelete }: FincaCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    // AGREGADO: dark:bg-slate-800, dark:border-slate-700, dark:text-white
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-zinc-200 dark:border-slate-700 p-4 w-full max-w-2xl mx-auto transition-all hover:shadow-md">
      <div className="flex gap-4 items-start mb-2">
        {finca.fotoUrl ? (
          <img
            src={finca.fotoUrl}
            alt={finca.nombre}
            className="w-32 h-20 object-cover rounded-lg border border-zinc-100 dark:border-slate-600"
          />
        ) : (
          // Placeholder oscuro
          <div className="w-32 h-20 bg-zinc-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-zinc-400 dark:text-slate-500">
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
          <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{finca.nombre}</div>
          {finca.status && (
            <div className="mt-1">
              <Badge
                variant={
                  finca.status === 'APPROVED'
                    ? 'success'
                    : finca.status === 'REJECTED'
                    ? 'destructive'
                    : 'warning'
                }
              >
                {finca.status === 'APPROVED' ? 'Aprobada ✅' : 'Pendiente ❗'}
              </Badge>
            </div>
          )}
          <div className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            <span className="font-medium">Ubicación:</span> {finca.ubicacion || finca.localizacion}
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 text-sm">
            <span className="font-medium">Propietario:</span> {finca.propietario}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Editar finca"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil size={18} />
          </button>
          <button
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Eliminar finca"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={18} />
          </button>
          <span className="ml-2 text-zinc-400 dark:text-zinc-500">
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </div>
      </div>

      {open && (
        <div className="mt-4 border-t border-zinc-100 dark:border-slate-700 pt-4 text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
          {finca.descripcion && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Descripción:</span>{' '}
              {finca.descripcion}
            </div>
          )}
          {finca.tipoPropiedad && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Tipo de propiedad:
              </span>{' '}
              {finca.tipoPropiedad}
            </div>
          )}
          {finca.entidadPertenece && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Entidad a la que pertenece:
              </span>{' '}
              {finca.entidadPertenece}
            </div>
          )}
          {finca.usoActual && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Uso actual:</span>{' '}
              {finca.usoActual}
            </div>
          )}
          {finca.estadoConservacion && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Estado de conservación:
              </span>{' '}
              {finca.estadoConservacion}
            </div>
          )}
          {finca.problematicaDetectada && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Problemática detectada:
              </span>{' '}
              {finca.problematicaDetectada}
            </div>
          )}
          {finca.tradicionesHistoria && (
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Tradiciones e historia:
              </span>{' '}
              {finca.tradicionesHistoria}
            </div>
          )}

          {/* Listas */}
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              { title: 'Elementos de interés', list: finca.elementosInteres },
              { title: 'Actividades agroturísticas', list: finca.actividadesAgroturisticas },
              { title: 'Principios de sustentabilidad', list: finca.principiosSustentabilidad },
              { title: 'Acciones ambientales', list: finca.accionesAmbientales },
            ].map(
              (section, idx) =>
                section.list?.length > 0 && (
                  <div key={idx} className="bg-zinc-50 dark:bg-slate-700/50 p-3 rounded-lg w-full">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
                      {section.title}:
                    </span>
                    <ul className="list-disc ml-5 space-y-1">
                      {section.list.map((el: any, i: number) => (
                        <li key={i}>{el.nombre || el}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FincaCardComponent;
