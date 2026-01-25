'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const USO_ACTUAL_OPTIONS = ['Cultivos Varios', 'Ganadería', 'Forestal', 'Agroturismo', 'Otros'];
const ESTADO_CONSERVACION_OPTIONS = ['Muy Bueno', 'Bueno', 'Aceptable', 'Malo'];
const TIPO_ENTIDAD_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'ESTATAL', label: 'Estatal' },
  { value: 'PRIVADA', label: 'Privada' },
];

export function FincasFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para el input de texto (para evitar lag al escribir)
  const [direccionInput, setDireccionInput] = useState(searchParams.get('direccion') || '');

  // Efecto para aplicar Debounce al campo de dirección
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (direccionInput) {
        params.set('direccion', direccionInput);
      } else {
        params.delete('direccion');
      }
      // Solo reemplaza la URL si el valor realmente cambió
      if (params.toString() !== searchParams.toString()) {
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }, 500); // 500ms de espera

    return () => clearTimeout(timer);
  }, [direccionInput, router, searchParams]);

  // Manejador para selects (cambio inmediato)
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const { name, value } = e.target;
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const selectClasses =
    'w-full border rounded-md px-3 py-1.5 bg-white text-gray-800 border-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 transition-colors text-sm';
  const labelClasses =
    'block text-xs font-bold mb-1.5 text-gray-600 dark:text-slate-400 uppercase tracking-wider';

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800">
      {/* Filtro: Tipo de Entidad */}
      <div>
        <label className={labelClasses}>Propiedad</label>
        <select
          name="tipoEntidad"
          className={selectClasses}
          value={searchParams.get('tipoEntidad') || ''}
          onChange={handleSelectChange}
        >
          {TIPO_ENTIDAD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro: Uso Actual */}
      <div>
        <label className={labelClasses}>Uso Actual</label>
        <select
          name="usoActual"
          className={selectClasses}
          value={searchParams.get('usoActual') || ''}
          onChange={handleSelectChange}
        >
          <option value="">Todos los usos</option>
          {USO_ACTUAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro: Estado de Conservación */}
      <div>
        <label className={labelClasses}>Conservación</label>
        <select
          name="estadoConservacion"
          className={selectClasses}
          value={searchParams.get('estadoConservacion') || ''}
          onChange={handleSelectChange}
        >
          <option value="">Cualquier estado</option>
          {ESTADO_CONSERVACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro: Dirección / Localidad (Con Debounce) */}
      <div>
        <label className={labelClasses}>Localización</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por dirección..."
            className={selectClasses}
            value={direccionInput}
            onChange={(e) => setDireccionInput(e.target.value)}
          />
          {direccionInput && (
            <button
              type="button"
              onClick={() => setDireccionInput('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
