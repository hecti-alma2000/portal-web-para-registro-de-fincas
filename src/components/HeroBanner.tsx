"use client";
import React, { useState } from "react";
import {
  getFincaByName,
  getAllFincas,
} from "@/actions/registro-finca/finca-actions";
import FincaCardSimple from "../components/registro-finca/FincaCardSimple";

export default function HeroBanner() {
  const [nombre, setNombre] = useState("");
  const [finca, setFinca] = useState<any>(null);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  // Estado para mostrar el modal
  const [showModal, setShowModal] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [todasFincas, setTodasFincas] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  React.useEffect(() => {
    // Cargar todas las fincas al montar el componente
    getAllFincas().then((fincas) => setTodasFincas(fincas || []));
  }, []);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setBuscado(false);
    setFinca(null);
    const result = await getFincaByName(nombre);
    setFinca(result);
    setBuscado(true);
    setLoading(false);
    setShowModal(true); // Mostrar modal si hay resultado o no
  }

  function handleLimpiar() {
    setNombre("");
    setFinca(null);
    setBuscado(false);
    setShowModal(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNombre(value);
    setFinca(null);
    setBuscado(false);
    setShowModal(false);
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
    setBuscado(true);
    setShowModal(true);
    setDropdownVisible(false);
    setNombre(f.nombre);
  }

  // Cerrar el dropdown al hacer click fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const input = document.getElementById("input-finca-busqueda");
      const dropdown = document.getElementById("dropdown-finca-busqueda");
      if (
        dropdownVisible &&
        !(
          (input && input.contains(event.target as Node)) ||
          (dropdown && dropdown.contains(event.target as Node))
        )
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownVisible]);

  return (
    <section className="w-screen max-w-none relative flex flex-col items-center justify-start overflow-visible p-0 m-0 h-auto min-h-[340px] md:min-h-[400px] transition-all duration-300">
      {/* Imagen de fondo con desvanecidos arriba y abajo */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/imgs_bg/pasadia-vinnales.webp"
          alt="Imagen de fondo"
          className="object-cover w-full h-full min-h-[340px] md:min-h-[400px]"
          style={{ minHeight: "340px" }}
        />
        {/* Fade arriba: más suave y alto */}
        <div className="absolute top-0 left-0 w-full h-28 md:h-40 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        {/* Fade abajo: más suave y alto */}
        <div className="absolute bottom-0 left-0 w-full h-10 md:h-40 bg-gradient-to-t from-white via-white/10 to-transparent pointer-events-none" />
      </div>
      {/* Overlay para mejorar contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-white/0 z-10 pointer-events-none" />
      {/* Contenido centrado y más arriba */}
      <div className="relative z-20 flex flex-col items-center w-full px-2 mt-0 pt-10">
        <h1
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg font-[cursive] tracking-widest mb-2 text-center"
          style={{ fontFamily: "Pacifico, cursive" }}
        >
          FINCAS Y AGROTURISMO
        </h1>
        {/* Buscador funcional */}
        <form
          className="bg-white/90 rounded-lg shadow flex flex-row items-center gap-2 px-4 py-3 w-full max-w-2xl mt-2 justify-center"
          onSubmit={handleBuscar}
          style={{ position: "relative" }}
          autoComplete="off"
        >
          <div className="relative flex-1 flex items-center">
            <input
              id="input-finca-busqueda"
              type="text"
              placeholder="Nombre de la finca..."
              value={nombre}
              onChange={handleInputChange}
              onFocus={() =>
                nombre && sugerencias.length > 0 && setDropdownVisible(true)
              }
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-left pr-10"
              style={{ minWidth: "200px", maxWidth: "100%" }}
            />
            {/* Botón limpiar dentro del input */}
            {nombre && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={handleLimpiar}
                tabIndex={0}
                aria-label="Limpiar búsqueda"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {/* Dropdown de sugerencias */}
            {dropdownVisible && sugerencias.length > 0 && (
              <ul
                id="dropdown-finca-busqueda"
                className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-30 animate-fade-in"
                style={{
                  maxHeight: "220px", // Menor altura para asegurar que no salga del HeroBanner
                  overflowY: "auto",
                  boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10)",
                  minWidth: "100%",
                }}
              >
                {sugerencias.map((f, idx) => (
                  <li
                    key={f.id}
                    className="px-4 py-2 cursor-pointer hover:bg-green-100 text-gray-800 flex flex-col"
                    onClick={() => handleSelectFinca(f)}
                  >
                    <span className="font-semibold text-green-700">
                      {f.nombre}
                    </span>
                    <span className="text-xs text-gray-500">
                      {f.ubicacion || f.localizacion}
                    </span>
                    <span className="text-xs text-gray-400">
                      Propietario: {f.propietario}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {dropdownVisible && sugerencias.length === 0 && nombre && (
              <div
                id="dropdown-finca-busqueda"
                className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-30 px-4 py-2 text-gray-500 animate-fade-in"
              >
                No hay coincidencias
              </div>
            )}
          </div>
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
        </form>
        {/* Modal para mostrar el resultado de la búsqueda */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative animate-fade-in border border-green-200">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full p-1 shadow"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
                style={{ zIndex: 10 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] max-h-[80vh] overflow-y-auto">
                {loading && <span className="text-gray-500">Buscando...</span>}
                {buscado && !loading && finca && (
                  <FincaCardSimple finca={finca} />
                )}
                {buscado && !loading && !finca && (
                  <div className="text-red-600 font-semibold text-center">
                    No se ha encontrado la finca
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

// Para usar la fuente Pacifico, agrégala en tu layout o _document.js/_app.js:
// <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
// O bien, usa @import en tu CSS global:
// @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
// Así el título tendrá la fuente decorativa como en la maqueta.
