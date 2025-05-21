import { useId } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

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
    // Creamos un evento sintético para borrar el contenido
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
        <FaSearch
          className="text-gray-600"
          style={{ width: "20px", height: "20px" }}
        />
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
          <FaTimes
            className="text-gray-600 hover:cursor-pointer"
            style={{ width: "20px", height: "20px" }}
          />
        </button>
      )}
    </div>
  );
};
