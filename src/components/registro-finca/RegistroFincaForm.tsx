'use client';
import { useState, useTransition, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// 🔑 NOTA: Ya no necesitamos importar updateFinca si submitFincaRequest lo maneja todo.
import { submitFincaRequest, FincaFormData } from '@/actions/registro-finca/submit-request'; // Importamos el tipo FincaFormData
import { useFincaEditStore } from '@/store/modal/fincaEdit.store';

// --- Type Definitions (Ahora importamos FincaFormData directamente de la Server Action) ---
// El tipo FincaUpdateInput ya no es necesario si la Server Action solo usa FincaFormData + id opcional

type FincaUpdateInput = FincaFormData & {
  id: number;
};

// --- Opciones de Selectores ---
const ESTADO_CONSERVACION_OPTIONS = ['Muy Bueno', 'Bueno', 'Aceptable', 'Malo'];
const USO_ACTUAL_OPTIONS = [
  'Cultivos Varios',
  'Ganadería',
  'Forestal',
  'Agroturismo',
  'Otros', // Opción para activar el campo de texto
];
// -----------------------------------------------------------------

interface RegistroFincaFormProps {
  onSuccess?: () => void;
  fincaToEdit?: any | null;
}

/**
 * FUNCIÓN CLAVE: Convierte string vacío ("") a NULL.
 */
const cleanString = (value: string | undefined): string | null | undefined => {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }
  return value;
};

export default function RegistroFincaForm({ onSuccess, fincaToEdit }: RegistroFincaFormProps) {
  const router = useRouter();
  const { setFincaToEdit } = useFincaEditStore();

  const [nombre, setNombre] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [propietario, setPropietario] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  // Nota: Inicializamos fotoUrl como 'string | undefined' porque puede ser el URL existente (string),
  // o undefined si es un nuevo registro sin foto.
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Campos y estados dinámicos
  const [tipoPropiedad, setTipoPropiedad] = useState<'ESTATAL' | 'PRIVADA'>('ESTATAL');
  const [entidadPertenece, setEntidadPertenece] = useState('');

  const [estadoConservacion, setEstadoConservacion] = useState('');
  const [usoActualSelect, setUsoActualSelect] = useState('');
  const [usoActualOtros, setUsoActualOtros] = useState('');

  const [problematicaDetectada, setProblematicaDetectada] = useState('');
  const [tradicionesHistoria, setTradicionesHistoria] = useState('');
  const [elementosInteres, setElementosInteres] = useState<string[]>([]);
  const [nuevoElementoInteres, setNuevoElementoInteres] = useState('');
  const [actividadesAgroturisticas, setActividadesAgroturisticas] = useState<string[]>([]);
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [principiosSustentabilidad, setPrincipiosSustentabilidad] = useState<string[]>([]);
  const [nuevoPrincipio, setNuevoPrincipio] = useState('');
  const [accionesAmbientales, setAccionesAmbientales] = useState<string[]>([]);
  const [nuevaAccion, setNuevaAccion] = useState('');

  // Lógica de inicialización
  useEffect(() => {
    if (fincaToEdit) {
      setNombre(fincaToEdit.nombre || '');
      setLocalizacion(fincaToEdit.localizacion || '');
      setPropietario(fincaToEdit.propietario || '');
      setDescripcion(fincaToEdit.descripcion || '');
      setTipoPropiedad(fincaToEdit.tipoPropiedad || 'ESTATAL');
      setEntidadPertenece(fincaToEdit.entidadPertenece || '');
      setEstadoConservacion(fincaToEdit.estadoConservacion || '');

      const uso = fincaToEdit.usoActual || '';
      if (USO_ACTUAL_OPTIONS.includes(uso)) {
        setUsoActualSelect(uso);
        setUsoActualOtros('');
      } else if (uso) {
        setUsoActualSelect('Otros');
        setUsoActualOtros(uso);
      } else {
        setUsoActualSelect('');
        setUsoActualOtros('');
      }

      setProblematicaDetectada(fincaToEdit.problematicaDetectada || '');
      setTradicionesHistoria(fincaToEdit.tradicionesHistoria || '');

      setElementosInteres(fincaToEdit.elementosInteres?.map((e: any) => e.nombre || e) || []);
      setFotoPreview(fincaToEdit.fotoUrl || null);
      setFotoUrl(fincaToEdit.fotoUrl || undefined);
      setActividadesAgroturisticas(
        fincaToEdit.actividadesAgroturisticas?.map((a: any) => a.nombre || a) || []
      );
      setPrincipiosSustentabilidad(
        fincaToEdit.principiosSustentabilidad?.map((p: any) => p.nombre || p) || []
      );
      setAccionesAmbientales(fincaToEdit.accionesAmbientales?.map((a: any) => a.nombre || a) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fincaToEdit]);

  // Lógica para deshabilitar Entidad a la que pertenece si es PRIVADA
  useEffect(() => {
    if (tipoPropiedad === 'PRIVADA') {
      setEntidadPertenece('');
    }
  }, [tipoPropiedad]);

  // Funciones de utilidad (se mantienen iguales)
  const addToList = useCallback(
    (
      list: string[],
      setList: (l: string[]) => void,
      newItem: string,
      setNewItem: (i: string) => void
    ) => {
      if (newItem && !list.includes(newItem.trim())) {
        setList([...list, newItem.trim()]);
        setNewItem('');
      }
    },
    []
  );

  const removeFromList = useCallback(
    (list: string[], setList: (l: string[]) => void, index: number) => {
      setList(list.filter((_, idx) => idx !== index));
    },
    []
  );

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFotoFile(f);
    if (f) setFotoPreview(URL.createObjectURL(f));
    else setFotoPreview(null);
  };
  const handleFotoRemove = () => {
    setFotoFile(null);
    setFotoPreview(null); // Eliminamos la vista previa para forzar la carga de null/undefined
    setFotoUrl(undefined);
    const el = document.getElementById('foto-input') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  // --- Lógica principal: handleSubmit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!fincaToEdit;
    const actionText = isEditing ? 'Editar' : 'Registrar';

    // 1. DEDUCCIÓN Y VALIDACIÓN DE CAMPOS OBLIGATORIOS
    const usoFinal = usoActualSelect === 'Otros' ? usoActualOtros : usoActualSelect;

    if (
      !estadoConservacion ||
      !usoActualSelect ||
      (usoActualSelect === 'Otros' && !usoActualOtros)
    ) {
      Swal.fire(
        'Campos requeridos',
        'Por favor complete el **estado de conservación** y el **uso actual**.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: `¿${actionText} finca?`,
      text: `¿Estás seguro de ${actionText.toLowerCase()} esta finca?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${actionText.toLowerCase()}`,
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    startTransition(async () => {
      let currentFotoUrl: string | null = fotoUrl || null;

      // 1. Manejo de subida de foto
      if (fotoFile) {
        try {
          const fd = new FormData();
          fd.append('file', fotoFile);
          const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });
          if (!resUp.ok) {
            const errorText = await resUp.text();
            throw new Error(`Error en la subida. ${errorText.substring(0, 100)}...`);
          }
          const j = await resUp.json();
          if (j.ok) {
            currentFotoUrl = j.url;
          } else {
            throw new Error(j.message || 'Error desconocido al procesar la imagen.');
          }
        } catch (err: any) {
          setLoading(false);
          console.error('ERROR AL SUBIR IMAGEN:', err.message);
          Swal.fire({
            title: 'Error de imagen',
            text: 'No se pudo subir la foto: ' + err.message,
            icon: 'error',
          });
          return;
        }
      } else if (!fotoPreview && isEditing) {
        // Si estamos editando y se eliminó la foto del preview/url
        currentFotoUrl = null;
      }

      // 2. Preparar datos para la Server Action
      const entidad = tipoPropiedad === 'PRIVADA' ? null : cleanString(entidadPertenece);

      const baseFincaData: FincaFormData = {
        nombre,
        localizacion,
        propietario,

        descripcion: cleanString(descripcion),
        // Si fotoUrl es undefined, lo enviamos como null si es creación o currentFotoUrl
        fotoUrl: currentFotoUrl,
        tipoPropiedad,
        entidadPertenece: entidad,

        usoActual: cleanString(usoFinal),
        estadoConservacion: cleanString(estadoConservacion),

        problematicaDetectada: cleanString(problematicaDetectada),
        tradicionesHistoria: cleanString(tradicionesHistoria),

        elementosInteres,
        actividadesAgroturisticas,
        principiosSustentabilidad,
        accionesAmbientales,
      };

      let res: { ok: boolean; message?: string; data?: any; isPending?: boolean };

      try {
        if (isEditing) {
          if (typeof fincaToEdit.id !== 'number') {
            throw new Error('ID de finca inválido para la actualización.');
          }
          // 🔑 Llama a la acción unificada con el ID
          res = await submitFincaRequest(baseFincaData, fincaToEdit.id);
        } else {
          // 🔑 Llama a la acción unificada sin ID (Creación)
          res = await submitFincaRequest(baseFincaData);
        }
      } catch (serverActionError: any) {
        res = {
          ok: false,
          message: 'Error de conexión con el servidor. Consulte la consola.',
        };
      }

      setLoading(false);

      if (res.ok) {
        setFincaToEdit(null);
        if (onSuccess) onSuccess();

        router.refresh();

        const title = isEditing ? 'Solicitud de actualización' : 'Solicitud enviada';
        const notificationText = res.isPending
          ? isEditing
            ? 'La actualización ha sido enviada para su revisión.'
            : 'Tu solicitud fue enviada y está pendiente de revisión.'
          : isEditing
          ? 'La finca se actualizó y aprobó correctamente.'
          : 'La finca se registró y aprobó automáticamente (Admin).';

        Swal.fire({
          title: title,
          text: notificationText,
          icon: res.isPending ? 'info' : 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: res.message || `No se pudo ${actionText.toLowerCase()} la finca.`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  // --- JSX (El contenido de la forma se mantiene igual) ---

  return (
    <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div className="col-span-1">
        <label className="block text-gray-700">Nombre de la finca</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {/* Imagen */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Foto (opcional)</label>
        <div className="flex items-center gap-4 mt-2">
          <input
            id="foto-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFotoChange}
          />
          <label
            htmlFor="foto-input"
            className="inline-flex items-center gap-2 bg-gray-200 px-3 py-2 rounded cursor-pointer hover:bg-gray-300"
          >
            Examinar
          </label>
          {fotoFile && <span className="text-sm text-gray-600">{fotoFile.name}</span>}
          {!fotoFile && fotoPreview && (
            <img src={fotoPreview} alt="preview" className="w-32 h-20 object-cover rounded" />
          )}
          {(fotoFile || fotoPreview) && (
            <button type="button" className="text-red-500 ml-2" onClick={handleFotoRemove}>
              Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="col-span-1">
        <label className="block text-gray-700">Dirección/Localización</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={localizacion}
          onChange={(e) => setLocalizacion(e.target.value)}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Propietario</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={propietario}
          onChange={(e) => setPropietario(e.target.value)}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Breve Descripción</label>
        <textarea
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      {/* Tipo de propiedad */}
      <div className="col-span-1">
        <label className="block text-gray-700">Tipo de propiedad</label>
        <select
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={tipoPropiedad}
          onChange={(e) => setTipoPropiedad(e.target.value as 'ESTATAL' | 'PRIVADA')}
        >
          <option value="ESTATAL">Estatal</option>
          <option value="PRIVADA">Privada</option>
        </select>
      </div>

      {/* 1. Entidad a la que pertenece (Condicional) */}
      <div className="col-span-1">
        <label className="block text-gray-700">Entidad a la que pertenece</label>
        <input
          type="text"
          className={`mt-1 block w-full border rounded px-3 py-2 ${
            tipoPropiedad === 'PRIVADA' ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          value={entidadPertenece}
          onChange={(e) => setEntidadPertenece(e.target.value)}
          disabled={tipoPropiedad === 'PRIVADA'}
          required={tipoPropiedad === 'ESTATAL'}
        />
        {tipoPropiedad === 'PRIVADA' && (
          <p className="text-xs text-gray-500 mt-1">Campo deshabilitado para propiedad privada.</p>
        )}
      </div>

      {/* 2. Uso actual (Select obligatorio + Otros) */}
      <div className="col-span-1">
        <label className="block text-gray-700">Uso actual</label>
        <select
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={usoActualSelect}
          onChange={(e) => {
            setUsoActualSelect(e.target.value);
            if (e.target.value !== 'Otros') setUsoActualOtros('');
          }}
        >
          <option value="" disabled>
            Seleccione el uso actual
          </option>
          {USO_ACTUAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Campo 'Otros' condicional para Uso Actual */}
      {usoActualSelect === 'Otros' && (
        <div className="col-span-1">
          <label className="block text-gray-700">Especifique otro uso</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-3 py-2"
            required
            value={usoActualOtros}
            onChange={(e) => setUsoActualOtros(e.target.value)}
          />
        </div>
      )}

      {/* 3. Estado de conservación (Select obligatorio) */}
      <div className="col-span-1">
        <label className="block text-gray-700">Estado de conservación</label>
        <select
          className="mt-1 block w-full border rounded px-3 py-2"
          required
          value={estadoConservacion}
          onChange={(e) => setEstadoConservacion(e.target.value)}
        >
          <option value="" disabled>
            Seleccione un estado
          </option>
          {ESTADO_CONSERVACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1">{/* Placeholder vacío para mantener la rejilla */}</div>

      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Problemática detectada</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={problematicaDetectada}
          onChange={(e) => setProblematicaDetectada(e.target.value)}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Tradiciones e Historia</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={tradicionesHistoria}
          onChange={(e) => setTradicionesHistoria(e.target.value)}
        />
      </div>

      {/* Listas dinámicas (El JSX se mantiene igual) */}
      <div className="col-span-1 md:col-span-2 space-y-4">
        {/* Elementos de interés */}
        <div>
          <label className="block text-gray-700 font-medium">Elementos de interés</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={nuevoElementoInteres}
              onChange={(e) => setNuevoElementoInteres(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
              onClick={() =>
                addToList(
                  elementosInteres,
                  setElementosInteres,
                  nuevoElementoInteres,
                  setNuevoElementoInteres
                )
              }
            >
              Agregar
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {elementosInteres.map((el, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {el}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-1 font-bold"
                  onClick={() => removeFromList(elementosInteres, setElementosInteres, i)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actividades agroturísticas */}
        <div>
          <label className="block text-gray-700 font-medium">Actividades agroturísticas</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={nuevaActividad}
              onChange={(e) => setNuevaActividad(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
              onClick={() =>
                addToList(
                  actividadesAgroturisticas,
                  setActividadesAgroturisticas,
                  nuevaActividad,
                  setNuevaActividad
                )
              }
            >
              Agregar
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {actividadesAgroturisticas.map((el, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {el}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-1 font-bold"
                  onClick={() =>
                    removeFromList(actividadesAgroturisticas, setActividadesAgroturisticas, i)
                  }
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Principios de sustentabilidad */}
        <div>
          <label className="block text-gray-700 font-medium">Principios de sustentabilidad</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={nuevoPrincipio}
              onChange={(e) => setNuevoPrincipio(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
              onClick={() =>
                addToList(
                  principiosSustentabilidad,
                  setPrincipiosSustentabilidad,
                  nuevoPrincipio,
                  setNuevoPrincipio
                )
              }
            >
              Agregar
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {principiosSustentabilidad.map((el, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {el}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-1 font-bold"
                  onClick={() =>
                    removeFromList(principiosSustentabilidad, setPrincipiosSustentabilidad, i)
                  }
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Acciones ambientales */}
        <div>
          <label className="block text-gray-700 font-medium">Acciones ambientales</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              value={nuevaAccion}
              onChange={(e) => setNuevaAccion(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
              onClick={() =>
                addToList(accionesAmbientales, setAccionesAmbientales, nuevaAccion, setNuevaAccion)
              }
            >
              Agregar
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {accionesAmbientales.map((el, i) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {el}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-1 font-bold"
                  onClick={() => removeFromList(accionesAmbientales, setAccionesAmbientales, i)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botón de submit */}
      <div className="col-span-1 md:col-span-2 mt-6">
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
          disabled={loading || isPending}
        >
          {fincaToEdit
            ? loading || isPending
              ? 'Editando...'
              : 'Editar finca'
            : loading || isPending
            ? 'Registrando...'
            : 'Registrar finca'}
        </button>
      </div>
    </form>
  );
}
