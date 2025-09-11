
interface FincaCardSimpleProps {
  finca: any;
}

const FincaCardSimple: React.FC<FincaCardSimpleProps> = ({ finca }) => {
  if (!finca) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {finca.fotoUrl ? (
          <img src={finca.fotoUrl} alt={finca.nombre} className="w-24 h-16 object-cover rounded" />
        ) : (
          <div className="w-24 h-16 bg-green-100 rounded flex items-center justify-center text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 7V5a4 4 0 018 0v2" />
            </svg>
          </div>
        )}
        <h2 className="text-2xl font-bold text-green-800">{finca.nombre}</h2>
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold">Ubicación:</span>{" "}
        {finca.ubicacion || finca.localizacion}
      </div>
      <div className="text-gray-700 mb-1">
        <span className="font-semibold">Propietario:</span> {finca.propietario}
      </div>
      {finca.descripcion && (
        <div className="text-gray-600 mb-1">
          <span className="font-semibold">Descripción:</span>{" "}
          {finca.descripcion}
        </div>
      )}
      {finca.tipoPropiedad && (
        <div className="text-gray-600 mb-1">
          <span className="font-semibold">Tipo de propiedad:</span>{" "}
          {finca.tipoPropiedad}
        </div>
      )}
      {finca.entidadPertenece && (
        <div className="text-gray-600 mb-1">
          <span className="font-semibold">Entidad a la que pertenece:</span>{" "}
          {finca.entidadPertenece}
        </div>
      )}
      {finca.usoActual && (
        <div className="text-gray-600 mb-1">
          <span className="font-semibold">Uso actual:</span> {finca.usoActual}
        </div>
      )}
      {/* Puedes agregar más campos si lo deseas */}
    </div>
  );
};

export default FincaCardSimple;
