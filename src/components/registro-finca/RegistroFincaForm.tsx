'use client';
import { useState, useTransition, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

import { submitFincaRequest, FincaFormData } from '@/actions/registro-finca/submit-request';
import { useFincaEditStore } from '@/store/modal/fincaEdit.store';

// --- Opciones de Selectores ---
const ESTADO_CONSERVACION_OPTIONS = ['Muy Bueno', 'Bueno', 'Aceptable', 'Malo'];
const USO_ACTUAL_OPTIONS = ['Cultivos Varios', 'Ganadería', 'Forestal', 'Agroturismo', 'Otros'];

interface RegistroFincaFormProps {
  onSuccess?: () => void;
  fincaToEdit?: any | null;
}

const cleanString = (value: string | undefined): string | null | undefined => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' && value.trim() === '') return null;
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
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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
  }, [fincaToEdit]);

  useEffect(() => {
    if (tipoPropiedad === 'PRIVADA') setEntidadPertenece('');
  }, [tipoPropiedad]);

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
    setFotoPreview(null);
    setFotoUrl(undefined);
    const el = document.getElementById('foto-input') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!fincaToEdit;
    const actionText = isEditing ? 'Editar' : 'Registrar';
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

      if (fotoFile) {
        try {
          const fd = new FormData();
          fd.append('file', fotoFile);
          const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });
          const j = await resUp.json();
          if (j.ok) currentFotoUrl = j.url;
          else throw new Error(j.message || 'Error al procesar la imagen.');
        } catch (err: any) {
          setLoading(false);
          Swal.fire({ title: 'Error de imagen', text: err.message, icon: 'error' });
          return;
        }
      } else if (!fotoPreview && isEditing) {
        currentFotoUrl = null;
      }

      const baseFincaData: FincaFormData = {
        nombre,
        localizacion,
        propietario,
        elementosInteres,
        actividadesAgroturisticas,
        principiosSustentabilidad,
        accionesAmbientales,
        descripcion: cleanString(descripcion),
        fotoUrl: currentFotoUrl,
        tipoPropiedad,
        entidadPertenece: tipoPropiedad === 'PRIVADA' ? null : cleanString(entidadPertenece),
        usoActual: cleanString(usoFinal),
        estadoConservacion: cleanString(estadoConservacion),
        problematicaDetectada: cleanString(problematicaDetectada),
        tradicionesHistoria: cleanString(tradicionesHistoria),
      };

      try {
        const res = await submitFincaRequest(baseFincaData, fincaToEdit?.id);
        setLoading(false);

        if (res.ok) {
          setFincaToEdit(null);
          if (onSuccess) onSuccess();
          router.refresh();
          Swal.fire({
            title: isEditing ? 'Solicitud de actualización' : 'Solicitud enviada',
            text: res.isPending ? 'Pendiente de revisión.' : 'Operación realizada con éxito.',
            icon: res.isPending ? 'info' : 'success',
          });
        } else {
          Swal.fire('Error', res.message || 'Error al procesar la finca.', 'error');
        }
      } catch (error) {
        setLoading(false);
        Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
      }
    });
  };

  // Clases comunes para inputs y selects
  const inputClasses =
    'mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 transition-colors';
  const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-slate-300';

  return (
    <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4" onSubmit={handleSubmit}>
      {/* Nombre */}
      <div className="col-span-1">
        <label className={labelClasses}>Nombre de la finca</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {/* Foto */}
      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Foto (opcional)</label>
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
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            Examinar
          </label>
          {fotoFile && (
            <span className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-37.5">
              {fotoFile.name}
            </span>
          )}
          {!fotoFile && fotoPreview && (
            <img
              src={fotoPreview}
              alt="preview"
              className="w-24 h-16 object-cover rounded-md border border-gray-200 dark:border-slate-700"
            />
          )}
          {(fotoFile || fotoPreview) && (
            <button
              type="button"
              className="text-red-500 text-sm font-medium hover:underline"
              onClick={handleFotoRemove}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Dirección y Propietario */}
      <div className="col-span-1">
        <label className={labelClasses}>Dirección/Localización</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={localizacion}
          onChange={(e) => setLocalizacion(e.target.value)}
        />
      </div>
      <div className="col-span-1">
        <label className={labelClasses}>Propietario</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={propietario}
          onChange={(e) => setPropietario(e.target.value)}
        />
      </div>

      {/* Descripción */}
      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Breve Descripción</label>
        <textarea
          className={inputClasses}
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      {/* Tipo Propiedad y Entidad */}
      <div className="col-span-1">
        <label className={labelClasses}>Tipo de propiedad</label>
        <select
          className={inputClasses}
          required
          value={tipoPropiedad}
          onChange={(e) => setTipoPropiedad(e.target.value as any)}
        >
          <option value="ESTATAL">Estatal</option>
          <option value="PRIVADA">Privada</option>
        </select>
      </div>
      <div className="col-span-1">
        <label className={labelClasses}>Entidad a la que pertenece</label>
        <input
          type="text"
          className={`${inputClasses} ${
            tipoPropiedad === 'PRIVADA'
              ? 'bg-gray-50 dark:bg-slate-900 cursor-not-allowed opacity-60'
              : ''
          }`}
          value={entidadPertenece}
          onChange={(e) => setEntidadPertenece(e.target.value)}
          disabled={tipoPropiedad === 'PRIVADA'}
          required={tipoPropiedad === 'ESTATAL'}
        />
      </div>

      {/* Uso Actual y Estado */}
      <div className="col-span-1">
        <label className={labelClasses}>Uso actual</label>
        <select
          className={inputClasses}
          required
          value={usoActualSelect}
          onChange={(e) => {
            setUsoActualSelect(e.target.value);
            if (e.target.value !== 'Otros') setUsoActualOtros('');
          }}
        >
          <option value="" disabled>
            Seleccione uso
          </option>
          {USO_ACTUAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        {usoActualSelect === 'Otros' && (
          <>
            <label className={labelClasses}>Especifique otro uso</label>
            <input
              type="text"
              className={inputClasses}
              required
              value={usoActualOtros}
              onChange={(e) => setUsoActualOtros(e.target.value)}
            />
          </>
        )}
      </div>

      <div className="col-span-1">
        <label className={labelClasses}>Estado de conservación</label>
        <select
          className={inputClasses}
          required
          value={estadoConservacion}
          onChange={(e) => setEstadoConservacion(e.target.value)}
        >
          <option value="" disabled>
            Seleccione estado
          </option>
          {ESTADO_CONSERVACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Problemática y Tradiciones */}
      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Problemática detectada</label>
        <input
          type="text"
          className={inputClasses}
          value={problematicaDetectada}
          onChange={(e) => setProblematicaDetectada(e.target.value)}
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Tradiciones e Historia</label>
        <input
          type="text"
          className={inputClasses}
          value={tradicionesHistoria}
          onChange={(e) => setTradicionesHistoria(e.target.value)}
        />
      </div>

      {/* Listas Dinámicas */}
      <div className="col-span-1 md:col-span-2 space-y-6 mt-4">
        {[
          {
            label: 'Elementos de interés',
            list: elementosInteres,
            setList: setElementosInteres,
            value: nuevoElementoInteres,
            setValue: setNuevoElementoInteres,
          },
          {
            label: 'Actividades agroturísticas',
            list: actividadesAgroturisticas,
            setList: setActividadesAgroturisticas,
            value: nuevaActividad,
            setValue: setNuevaActividad,
          },
          {
            label: 'Principios de sustentabilidad',
            list: principiosSustentabilidad,
            setList: setPrincipiosSustentabilidad,
            value: nuevoPrincipio,
            setValue: setNuevoPrincipio,
          },
          {
            label: 'Acciones ambientales',
            list: accionesAmbientales,
            setList: setAccionesAmbientales,
            value: nuevaAccion,
            setValue: setNuevaAccion,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-200 dark:border-slate-800"
          >
            <label className={`${labelClasses} mb-2`}>{item.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                className={inputClasses}
                value={item.value}
                onChange={(e) => item.setValue(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addToList(item.list, item.setList, item.value, item.setValue))
                }
              />
              <button
                type="button"
                onClick={() => addToList(item.list, item.setList, item.value, item.setValue)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {item.list.map((el, i) => (
                <span
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded-md text-xs flex items-center gap-2 text-gray-700 dark:text-slate-300"
                >
                  {el}
                  <button
                    type="button"
                    className="text-red-500 font-bold"
                    onClick={() => removeFromList(item.list, item.setList, i)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón Submit */}
      <div className="col-span-1 md:col-span-2 mt-6">
        <button
          type="submit"
          disabled={loading || isPending}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-slate-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/20 transition-all transform active:scale-[0.98]"
        >
          {loading || isPending
            ? 'Procesando...'
            : fincaToEdit
            ? 'Guardar Cambios'
            : 'Registrar Finca'}
        </button>
      </div>
    </form>
  );
}
