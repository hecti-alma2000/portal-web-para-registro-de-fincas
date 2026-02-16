'use client';
import { useState, useTransition, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { ImagePlus, Trash2, Plus, X } from 'lucide-react';

import { submitFincaRequest, FincaFormData } from '@/actions/registro-finca/submit-request';
import { useFincaEditStore } from '@/store/modal/fincaEdit.store';

const ESTADO_CONSERVACION_OPTIONS = ['Muy Bueno', 'Bueno', 'Aceptable', 'Malo'];
const USO_ACTUAL_OPTIONS = ['Cultivos Varios', 'Ganadería', 'Forestal', 'Agroturismo', 'Otros'];
const DRAFT_KEY = 'registro_finca_draft'; // Llave para guardar el borrador

const cleanString = (value: string | undefined): string | null | undefined => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
};

export default function RegistroFincaForm({
  onSuccess,
  fincaToEdit,
}: {
  onSuccess?: () => void;
  fincaToEdit?: any;
}) {
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

  // 1. CARGAR DATOS (Edición o Borrador)
  useEffect(() => {
    if (fincaToEdit) {
      // Modo Edición: Cargar datos del servidor
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
    } else {
      // Modo Creación: Recuperar borrador de LocalStorage si la página se refrescó accidentalmente
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setNombre(parsed.nombre || '');
          setLocalizacion(parsed.localizacion || '');
          setPropietario(parsed.propietario || '');
          setDescripcion(parsed.descripcion || '');
          setTipoPropiedad(parsed.tipoPropiedad || 'ESTATAL');
          setEntidadPertenece(parsed.entidadPertenece || '');
          setEstadoConservacion(parsed.estadoConservacion || '');
          setUsoActualSelect(parsed.usoActualSelect || '');
          setUsoActualOtros(parsed.usoActualOtros || '');
          setProblematicaDetectada(parsed.problematicaDetectada || '');
          setTradicionesHistoria(parsed.tradicionesHistoria || '');
          setElementosInteres(parsed.elementosInteres || []);
          setActividadesAgroturisticas(parsed.actividadesAgroturisticas || []);
          setPrincipiosSustentabilidad(parsed.principiosSustentabilidad || []);
          setAccionesAmbientales(parsed.accionesAmbientales || []);
        } catch (e) {
          console.error('Error parseando borrador', e);
        }
      }
    }
  }, [fincaToEdit]);

  // 2. GUARDAR BORRADOR AUTOMÁTICAMENTE
  useEffect(() => {
    // Solo guardamos borrador si es un registro nuevo (no edición)
    if (!fincaToEdit) {
      const formDraft = {
        nombre,
        localizacion,
        propietario,
        descripcion,
        tipoPropiedad,
        entidadPertenece,
        estadoConservacion,
        usoActualSelect,
        usoActualOtros,
        problematicaDetectada,
        tradicionesHistoria,
        elementosInteres,
        actividadesAgroturisticas,
        principiosSustentabilidad,
        accionesAmbientales,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formDraft));
    }
  }, [
    nombre,
    localizacion,
    propietario,
    descripcion,
    tipoPropiedad,
    entidadPertenece,
    estadoConservacion,
    usoActualSelect,
    usoActualOtros,
    problematicaDetectada,
    tradicionesHistoria,
    elementosInteres,
    actividadesAgroturisticas,
    principiosSustentabilidad,
    accionesAmbientales,
    fincaToEdit,
  ]);

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

  const removeFromList = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFotoFile(f);
    if (f) setFotoPreview(URL.createObjectURL(f));
  };

  // 3. PREVENIR SUBMIT AL PRESIONAR "ENTER" EN LOS CAMPOS
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Si presionan Enter, y el elemento no es un TextArea ni un botón, evitamos el submit.
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && target.tagName !== 'TEXTAREA' && target.tagName !== 'BUTTON') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!fincaToEdit;
    const usoFinal = usoActualSelect === 'Otros' ? usoActualOtros : usoActualSelect;

    if (
      !estadoConservacion ||
      !usoActualSelect ||
      (usoActualSelect === 'Otros' && !usoActualOtros)
    ) {
      Swal.fire(
        'Campos requeridos',
        'Por favor complete el estado de conservación y el uso actual.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: `¿${isEditing ? 'Editar' : 'Registrar'} finca?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Sí, continuar',
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    startTransition(async () => {
      // 4. BLOQUE TRY-CATCH PARA PREVENIR CRASHES DEL COMPONENTE
      try {
        let currentFotoUrl = fotoUrl || null;

        if (fotoFile) {
          const fd = new FormData();
          fd.append('file', fotoFile);
          const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });

          if (!resUp.ok) throw new Error('Error al subir la imagen');

          const j = await resUp.json();
          if (j.ok) currentFotoUrl = j.url;
          else throw new Error(j.message || 'Error en el servidor de imágenes');
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

        const res = await submitFincaRequest(baseFincaData, fincaToEdit?.id);

        if (res.ok) {
          // Si todo salió bien, limpiamos el borrador de LocalStorage
          localStorage.removeItem(DRAFT_KEY);

          setFincaToEdit(null);
          if (onSuccess) onSuccess();
          router.refresh();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Operación realizada correctamente.',
            icon: 'success',
          });
        } else {
          // Si la API responde con un error pero no crashea
          Swal.fire(
            'Error',
            res.message || 'Error al guardar los datos en base de datos.',
            'error'
          );
        }
      } catch (error: any) {
        // Si hay una excepción en el fetch, Next.js no se romperá, lo atrapamos aquí
        console.error('Error crítico durante el envío:', error);
        Swal.fire(
          'Error Crítico',
          error.message || 'No se pudo conectar con el servidor.',
          'error'
        );
      } finally {
        setLoading(false); // Garantizamos que siempre se desactiva el loading
      }
    });
  };

  const inputClasses =
    'mt-1.5 block w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-green-500 focus:ring-green-500/20 px-4 py-2.5 transition-all outline-none';
  const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1';
  const sectionClasses =
    'col-span-1 md:col-span-2 mt-4 mb-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-xs';

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-2"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown} // Evitar el Enter en todo el form
    >
      <h3 className={sectionClasses}>Información General</h3>

      <div className="col-span-1 md:col-span-1">
        <label className={labelClasses}>Nombre de la Finca</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Finca La Esperanza"
        />
      </div>

      <div className="col-span-1">
        <label className={labelClasses}>Propietario / Responsable</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={propietario}
          onChange={(e) => setPropietario(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Imagen Representativa</label>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          {fotoPreview ? (
            <div className="relative group">
              <img
                src={fotoPreview}
                alt="Preview"
                className="w-32 h-24 object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  setFotoFile(null);
                  setFotoPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="w-32 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
              <ImagePlus size={32} />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Sube una foto clara de la entrada o el paisaje principal.
            </p>
            <input
              id="foto-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
            <label
              htmlFor="foto-input"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              Seleccionar archivo
            </label>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Ubicación Exacta</label>
        <input
          type="text"
          className={inputClasses}
          required
          value={localizacion}
          onChange={(e) => setLocalizacion(e.target.value)}
          placeholder="Dirección, municipio o coordenadas"
        />
      </div>

      <h3 className={sectionClasses}>Detalles Técnicos</h3>

      <div className="col-span-1">
        <label className={labelClasses}>Tipo de Propiedad</label>
        <select
          className={inputClasses}
          value={tipoPropiedad}
          onChange={(e) => setTipoPropiedad(e.target.value as any)}
        >
          <option value="ESTATAL">Estatal</option>
          <option value="PRIVADA">Privada</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className={labelClasses}>Entidad Perteneciente</label>
        <input
          type="text"
          className={`${inputClasses} ${
            tipoPropiedad === 'PRIVADA' ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          disabled={tipoPropiedad === 'PRIVADA'}
          value={entidadPertenece}
          onChange={(e) => setEntidadPertenece(e.target.value)}
          placeholder={tipoPropiedad === 'ESTATAL' ? 'Ej: Ministerio de Agricultura' : 'No aplica'}
        />
      </div>

      <div className="col-span-1">
        <label className={labelClasses}>Uso Actual del Suelo</label>
        <select
          className={inputClasses}
          required
          value={usoActualSelect}
          onChange={(e) => setUsoActualSelect(e.target.value)}
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {USO_ACTUAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1">
        <label className={labelClasses}>Estado de Conservación</label>
        <select
          className={inputClasses}
          required
          value={estadoConservacion}
          onChange={(e) => setEstadoConservacion(e.target.value)}
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {ESTADO_CONSERVACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {usoActualSelect === 'Otros' && (
        <div className="col-span-1 md:col-span-2">
          <label className={labelClasses}>Especifique el uso</label>
          <input
            type="text"
            className={inputClasses}
            required
            value={usoActualOtros}
            onChange={(e) => setUsoActualOtros(e.target.value)}
          />
        </div>
      )}

      <div className="col-span-1 md:col-span-2">
        <label className={labelClasses}>Descripción del Entorno</label>
        <textarea
          className={inputClasses}
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe el clima, relieve y belleza del lugar..."
        />
      </div>

      <h3 className={sectionClasses}>Análisis y Atractivos</h3>

      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Problemática Detectada</label>
          <input
            type="text"
            className={inputClasses}
            value={problematicaDetectada}
            onChange={(e) => setProblematicaDetectada(e.target.value)}
            placeholder="Ej: Erosión, falta de riego..."
          />
        </div>
        <div>
          <label className={labelClasses}>Tradiciones e Historia</label>
          <input
            type="text"
            className={inputClasses}
            value={tradicionesHistoria}
            onChange={(e) => setTradicionesHistoria(e.target.value)}
            placeholder="Historias locales o cultura..."
          />
        </div>
      </div>

      <h3 className={sectionClasses}>Atributos y Sostenibilidad</h3>

      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: 'Elementos de Interés',
            list: elementosInteres,
            set: setElementosInteres,
            val: nuevoElementoInteres,
            setVal: setNuevoElementoInteres,
          },
          {
            label: 'Actividades Ofrecidas',
            list: actividadesAgroturisticas,
            set: setActividadesAgroturisticas,
            val: nuevaActividad,
            setVal: setNuevaActividad,
          },
          {
            label: 'Principios Sustentables',
            list: principiosSustentabilidad,
            set: setPrincipiosSustentabilidad,
            val: nuevoPrincipio,
            setVal: setNuevoPrincipio,
          },
          {
            label: 'Acciones Ambientales',
            list: accionesAmbientales,
            set: setAccionesAmbientales,
            val: nuevaAccion,
            setVal: setNuevaAccion,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block mb-2">
              {item.label}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-white dark:bg-zinc-800 border-none rounded-lg text-sm px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
                value={item.val}
                onChange={(e) => item.setVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Detenemos propagación explícita
                    addToList(item.list, item.set, item.val, item.setVal);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addToList(item.list, item.set, item.val, item.setVal)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {item.list.map((tag, i) => (
                <span
                  key={i}
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-green-200 dark:border-green-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeFromList(item.list, item.set, i)}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-1 md:col-span-2 mt-8">
        <button
          type="submit"
          disabled={loading || isPending}
          className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-xl shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading || isPending
              ? 'Guardando datos...'
              : fincaToEdit
              ? 'Actualizar Finca'
              : 'Finalizar Registro'}
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    </form>
  );
}
