'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Globe2, Search } from 'lucide-react';
import { SORTED_COUNTRIES, getCountry, type Country } from '@/lib/countries';
import { CountryFlag } from './CountryFlag';

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  /** Limita las opciones a estos códigos (ej. países con fincas registradas) */
  allowedCodes?: string[];
  /** Si se indica, añade una opción "todos" con valor '' (para filtros) */
  allLabel?: string;
  /** Conteo opcional por país, se muestra a la derecha de cada opción */
  counts?: Record<string, number>;
  className?: string;
  id?: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export const CountrySelect = ({
  value,
  onChange,
  allowedCodes,
  allLabel,
  counts,
  className = '',
  id,
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const options = useMemo<Country[]>(() => {
    const base = allowedCodes
      ? SORTED_COUNTRIES.filter((c) => allowedCodes.includes(c.code))
      : SORTED_COUNTRIES;
    const q = normalize(query.trim());
    if (!q) return base;
    return base.filter((c) => normalize(c.name).includes(q) || c.code.toLowerCase() === q);
  }, [allowedCodes, query]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  const selected = value ? getCountry(value) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        className={`flex items-center justify-between gap-2 text-left ${className}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              <CountryFlag code={selected.code} className="w-6 h-auto shrink-0" />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <>
              <Globe2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{allLabel ?? 'Seleccionar país...'}</span>
            </>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-[1100] mt-1 w-full min-w-[14rem] rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
          <div className="relative border-b border-zinc-100 dark:border-slate-700">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (options.length > 0) select(options[0].code);
                }
              }}
              placeholder="Buscar país..."
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-slate-100 outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {allLabel !== undefined && !query && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={!value}
                  onClick={() => select('')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-700"
                >
                  <Globe2 className="w-5 h-4 text-gray-400" />
                  <span className="flex-1 text-left">{allLabel}</span>
                  {!value && <Check className="w-4 h-4 text-green-600" />}
                </button>
              </li>
            )}
            {options.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === c.code}
                  onClick={() => select(c.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-green-50 dark:hover:bg-slate-700 ${
                    value === c.code
                      ? 'font-semibold text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-slate-200'
                  }`}
                >
                  <CountryFlag code={c.code} className="w-6 h-auto shrink-0" />
                  <span className="flex-1 text-left truncate">{c.name}</span>
                  {counts?.[c.code] !== undefined && (
                    <span className="text-xs text-gray-400">{counts[c.code]}</span>
                  )}
                  {value === c.code && <Check className="w-4 h-4 text-green-600" />}
                </button>
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">Sin resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
