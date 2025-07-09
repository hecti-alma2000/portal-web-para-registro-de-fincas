"use client";
import React, { useState } from "react";
import { getFincaByName } from "@/actions/registro-finca/finca-actions";
import FincaCard from "../components/registro-finca/FincaCard";

export default function HeroBanner() {
  const [nombre, setNombre] = useState("");
  const [finca, setFinca] = useState<any>(null);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setBuscado(false);
    setFinca(null);
    const result = await getFincaByName(nombre);
    setFinca(result);
    setBuscado(true);
    setLoading(false);
  }

  // Nueva función para limpiar la búsqueda sin confirmación
  function handleLimpiar() {
    setNombre("");
    setFinca(null);
    setBuscado(false);
  }

  return (
    <section className="w-screen max-w-none relative flex flex-col items-center justify-start overflow-visible p-0 m-0 h-auto min-h-[340px] md:min-h-[400px] transition-all duration-300">
      {/* Imagen de fondo */}
      <img
        src="/2505c393a0eba629a2b27c28bf625209.jpg"
        alt="Imagen de fondo"
        className="absolute inset-0 object-cover w-full h-full z-0 min-h-[340px] md:min-h-[400px]"
        style={{ minHeight: "340px" }}
      />
      {/* Overlay para mejorar contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-white/0 z-10" />
      {/* Contenido centrado y más arriba */}
      <div className="relative z-20 flex flex-col items-center w-full px-2 mt-0 pt-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-blue-500 drop-shadow-lg font-[cursive] tracking-widest mb-2 text-center"
          style={{ fontFamily: "Pacifico, cursive" }}
        >
          FINCAS Y AGROTURISMO
        </h1>
        {/* Buscador funcional */}
        <form
          className="bg-white/90 rounded-lg shadow flex flex-col md:flex-row items-center gap-2 px-4 py-3 w-full max-w-2xl mt-2 justify-center"
          onSubmit={handleBuscar}
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Nombre de la finca..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
            style={{ minWidth: "200px", maxWidth: "100%" }}
          />
          <button
            type="submit"
            className="bg-green-600 text-white rounded px-4 py-2 flex items-center gap-2 hover:bg-green-700 transition"
            disabled={loading || !nombre.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z"
              />
            </svg>
            Buscar
          </button>
          {/* Botón limpiar, solo visible si hay texto o resultado */}
          {(nombre || (buscado && (finca || !finca))) && (
            <button
              type="button"
              className="bg-gray-200 text-gray-700 rounded px-3 py-2 flex items-center gap-1 hover:bg-gray-300 transition border border-gray-300"
              onClick={handleLimpiar}
              tabIndex={0}
              aria-label="Limpiar búsqueda"
              style={{ marginLeft: 4 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Limpiar
            </button>
          )}
        </form>
        {/* Resultado de la búsqueda */}
        <div className="w-full flex justify-center mt-4 min-h-[48px]">
          {loading && <span className="text-gray-500">Buscando...</span>}
          {buscado && !loading && finca && (
            <div className="w-full max-w-2xl">
              <FincaCard finca={finca} onEdit={() => {}} onDelete={() => {}} />
            </div>
          )}
          {buscado && !loading && !finca && (
            <div className="text-red-600 font-semibold">
              No se ha encontrado la finca
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Para usar la fuente Pacifico, agrégala en tu layout o _document.js/_app.js:
// <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
// O bien, usa @import en tu CSS global:
// @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
// Así el título tendrá la fuente decorativa como en la maqueta.
