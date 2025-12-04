// src/components/finca/FincasFilterBar.tsx
'use client';
import React from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const { name, value } = e.target;
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <form className="flex flex-wrap gap-4 mb-6 items-end">
      <div>
        <label className="block text-xs font-semibold mb-1">Tipo de entidad</label>
        <select
          name="tipoEntidad"
          className="border rounded px-2 py-1"
          value={searchParams.get('tipoEntidad') || ''}
          onChange={handleChange}
        >
          {TIPO_ENTIDAD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Uso actual</label>
        <select
          name="usoActual"
          className="border rounded px-2 py-1"
          value={searchParams.get('usoActual') || ''}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          {USO_ACTUAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Estado de conservación</label>
        <select
          name="estadoConservacion"
          className="border rounded px-2 py-1"
          value={searchParams.get('estadoConservacion') || ''}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          {ESTADO_CONSERVACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
