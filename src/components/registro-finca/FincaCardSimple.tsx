
interface FincaCardSimpleProps {
  finca: any;
}

const FincaCardSimple: React.FC<FincaCardSimpleProps> = ({ finca }) => {
  if (!finca) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-2">{finca.nombre}</h2>
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
