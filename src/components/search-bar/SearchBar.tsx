"use client";

import { useId } from "react";
import { Search, X } from "lucide-react"; // Importamos los iconos de Lucide React

interface SearchBarProps {
  value: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const SearchBar = ({
  value,
  onSearchChange,
  placeholder,
}: SearchBarProps) => {
  const inputId = useId();

  const handleClear = () => {
    // onSearchChange espera un evento, por lo que creamos uno de forma manual
    onSearchChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex items-center mb-3 w-full md:w-2/4">
      {/* Ícono de búsqueda (lado izquierdo) */}
      <span
        className="bg-gray-200 p-2 rounded-l-md flex justify-center items-center"
        id={inputId}
      >
        <Search className="text-gray-600 w-5 h-5" />
      </span>
      {/* Input de búsqueda */}
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={onSearchChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`text-gray-900 border-green-500 flex-1 p-2 focus:border-blue-500 focus:ring-blue-500 ${
          value ? "" : "rounded-r-md"
        }`}
      />
      {/* Botón "X" de limpiar (solo cuando hay texto en el input) */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 p-2 rounded-r-md flex justify-center items-center"
        >
          <X className="text-gray-600 hover:cursor-pointer w-5 h-5" />
        </button>
      )}
    </div>
  );
};