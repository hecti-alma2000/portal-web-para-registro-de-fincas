'use client';
import React, { useState, useEffect } from 'react';
import { getFincaByName, getPublicFincas } from '@/actions/registro-finca/finca-actions';
import FincaCardSimple from '../components/registro-finca/FincaCardSimple';

export default function HeroBanner() {
  const [nombre, setNombre] = useState('');
  const [finca, setFinca] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [todasFincas, setTodasFincas] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    getPublicFincas().then((fincas) => setTodasFincas(fincas || []));
  }, []);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true);
    const result = await getFincaByName(nombre);
    setFinca(result);
    setLoading(false);
    setShowModal(true);
    setDropdownVisible(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNombre(value);
    if (value.trim().length > 0) {
      const matches = todasFincas.filter((f: any) =>
        f.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(matches);
      setDropdownVisible(true);
    } else {
      setSugerencias([]);
      setDropdownVisible(false);
    }
  }

  function handleSelectFinca(f: any) {
    setFinca(f);
    setShowModal(true);
    setDropdownVisible(false);
    setNombre(f.nombre);
  }

  return (
    <section className="w-full relative flex flex-col items-center justify-start min-h-100 transition-all duration-500 overflow-hidden bg-white dark:bg-zinc-950 prose dark:prose-invert ">
      {/* IMAGEN DE FONDO Y GRADIENTES */}
      <div className="absolute inset-0 z-0">
        <img
          src="/imgs_bg/pasadia-vinnales.webp"
          alt="Finca"
          className="object-cover w-full h-full brightness-110 dark:brightness-30 transition-all duration-700"
        />
        <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-b from-white dark:from-zinc-950 to-transparent transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-white dark:from-zinc-950 to-transparent transition-colors duration-500" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 pt-24 prose dark:prose-invert">
        <h1
          className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-8 text-center"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          Fincas y Agroturismo
        </h1>

        {/* BUSCADOR: Fondo sólido para que destaque en Light Mode */}
        <form
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-row items-center gap-2 p-2 w-full max-w-2xl border border-gray-100 dark:border-zinc-800 transition-all "
          onSubmit={handleBuscar}
          autoComplete="off"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="¿Qué finca buscas hoy?..."
              value={nombre}
              onChange={handleInputChange}
              className="bg-transparent border-none w-full focus:ring-0 text-xl py-3 px-4 outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />

            {/* SUGERENCIAS DROPDOWN */}
            {dropdownVisible && sugerencias.length > 0 && (
              <ul className="absolute left-0 top-full mt-4 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-50 border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {sugerencias.map((f) => (
                  <li
                    key={f.id}
                    className="px-6 py-4 cursor-pointer hover:bg-green-50 dark:hover:bg-zinc-800 flex flex-col transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-none"
                    onClick={() => handleSelectFinca(f)}
                  >
                    <span className="font-bold text-green-700 dark:text-green-400">{f.nombre}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{f.ubicacion}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl px-8 py-4 shadow-md transition-all active:scale-95"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </form>

        {/* MODAL DE RESULTADOS */}
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-4xl shadow-3xl max-w-lg w-full relative border border-gray-100 dark:border-zinc-800 p-8 animate-in zoom-in-95 duration-200">
              <button
                className="absolute top-6 right-6 text-zinc-400 hover:text-red-500 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center">
                {finca ? (
                  <FincaCardSimple finca={finca} />
                ) : (
                  <div className="text-center py-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      No encontrada
                    </h2>
                    <p className="text-zinc-500">Prueba con otro nombre de finca.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
