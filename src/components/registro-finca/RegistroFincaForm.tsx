'use client';
import { useState, useTransition, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
// 🔑 Importación del router de Next.js
import { useRouter } from 'next/navigation';

import { createFinca } from '@/actions/registro-finca/create-finca';
import { updateFinca } from '@/actions/registro-finca/update-finca';
import { useFincaEditStore } from '@/store/modal/fincaEdit.store';

// --- Type Definitions (se mantienen iguales) ---
type FincaFormData = {
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion?: string;
  fotoUrl?: string;
  tipoPropiedad: 'ESTATAL' | 'PRIVADA';
  entidadPertenece?: string;
  usoActual?: string;
  estadoConservacion?: string;
  problematicaDetectada?: string;
  tradicionesHistoria?: string;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
};

type FincaUpdateInput = FincaFormData & {
  id: number;
};
// -----------------------------------------------------------------

interface RegistroFincaFormProps {
  onSuccess?: () => void;
  fincaToEdit?: any | null;
}

export default function RegistroFincaForm({ onSuccess, fincaToEdit }: RegistroFincaFormProps) {
  // 🔑 Inicialización del router
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

  // Campos y estados dinámicos (se mantienen iguales)
  const [tipoPropiedad, setTipoPropiedad] = useState<'ESTATAL' | 'PRIVADA'>('ESTATAL');
  const [entidadPertenece, setEntidadPertenece] = useState('');
  const [usoActual, setUsoActual] = useState('');
  const [estadoConservacion, setEstadoConservacion] = useState('');
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

  // Lógica de inicialización (se mantiene igual)
  useEffect(() => {
    if (fincaToEdit) {
      setNombre(fincaToEdit.nombre || '');
      setLocalizacion(fincaToEdit.localizacion || '');
      setPropietario(fincaToEdit.propietario || '');
      setDescripcion(fincaToEdit.descripcion || '');
      setTipoPropiedad(fincaToEdit.tipoPropiedad || 'ESTATAL');
      setEntidadPertenece(fincaToEdit.entidadPertenece || '');
      setUsoActual(fincaToEdit.usoActual || '');
      setEstadoConservacion(fincaToEdit.estadoConservacion || '');
      setProblematicaDetectada(fincaToEdit.problematicaDetectada || '');
      setTradicionesHistoria(fincaToEdit.tradicionesHistoria || '');

      setElementosInteres(fincaToEdit.elementosInteres?.map((e: any) => e.nombre) || []);
      setFotoPreview(fincaToEdit.fotoUrl || null);
      setFotoUrl(fincaToEdit.fotoUrl || undefined);
      setActividadesAgroturisticas(
        fincaToEdit.actividadesAgroturisticas?.map((a: any) => a.nombre) || []
      );
      setPrincipiosSustentabilidad(
        fincaToEdit.principiosSustentabilidad?.map((p: any) => p.nombre) || []
      );
      setAccionesAmbientales(fincaToEdit.accionesAmbientales?.map((a: any) => a.nombre) || []);
    } else {
      // Resetear estados
      setNombre('');
      setLocalizacion('');
      setPropietario('');
      setDescripcion('');
      setTipoPropiedad('ESTATAL');
      setEntidadPertenece('');
      setUsoActual('');
      setEstadoConservacion('');
      setProblematicaDetectada('');
      setTradicionesHistoria('');
      setElementosInteres([]);
      setActividadesAgroturisticas([]);
      setPrincipiosSustentabilidad([]);
      setAccionesAmbientales([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fincaToEdit]);

  // Funciones de utilidad (se mantienen iguales)
  const addToList = useCallback(
    (
      list: string[],
      setList: (l: string[]) => void,
      newItem: string,
      setNewItem: (i: string) => void
    ) => {
      if (newItem && !list.includes(newItem)) {
        setList([...list, newItem]);
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
    setFotoPreview(fincaToEdit?.fotoUrl || null);
    const el = document.getElementById('foto-input') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  // --- Lógica principal: handleSubmit con router.refresh() ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!fincaToEdit;
    const actionText = isEditing ? 'Editar' : 'Registrar';

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
      let uploadedUrl: string | undefined = fotoUrl;

      // 1. Manejo de subida de foto (se mantiene igual)
      if (fotoFile) {
        try {
          const fd = new FormData();
          fd.append('file', fotoFile);

          const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });

          if (!resUp.ok) {
            const errorText = await resUp.text();
            throw new Error(
              `Error en la subida. Estado: ${resUp.status}. Respuesta: ${errorText.substring(
                0,
                100
              )}...`
            );
          }

          const j = await resUp.json();

          if (j.ok) {
            uploadedUrl = j.url;
            setFotoUrl(j.url);
            setFotoPreview(j.url);
          } else {
            throw new Error(j.message || 'Error desconocido al procesar la imagen.');
          }
        } catch (err: any) {
          setLoading(false);
          console.error('ERROR AL SUBIR IMAGEN:', err.message);
          Swal.fire({
            title: 'Error de imagen',
            text: err.message.includes('Error en la subida')
              ? `No se pudo subir la foto. Verifique la API. (${err.message})`
              : err.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }
      }

      // 2. Preparar datos y ejecutar Server Action (se mantiene igual)
      const baseFincaData: FincaFormData = {
        nombre,
        localizacion,
        propietario,
        descripcion,
        fotoUrl: uploadedUrl,
        tipoPropiedad,
        entidadPertenece,
        usoActual,
        estadoConservacion,
        problematicaDetectada,
        tradicionesHistoria,
        elementosInteres,
        actividadesAgroturisticas,
        principiosSustentabilidad,
        accionesAmbientales,
      };

      let res: { ok: boolean; message?: string; data?: any };

      try {
        if (isEditing) {
          if (typeof fincaToEdit.id !== 'number') {
            throw new Error('ID de finca inválido para la actualización.');
          }
          const updateData: FincaUpdateInput = { ...baseFincaData, id: fincaToEdit.id };
          res = await updateFinca(updateData);
        } else {
          res = await createFinca(baseFincaData);
        }
      } catch (serverActionError: any) {
        res = {
          ok: false,
          message: serverActionError.message || 'Error desconocido del servidor.',
        };
      }

      setLoading(false);

      if (res.ok) {
        // Cierra el modal vía Zustand
        setFincaToEdit(null);
        if (onSuccess) onSuccess();

        // 🔑 CAMBIO CLAVE: Forzar la actualización de la data en el cliente
        // Disparar un evento con la finca actualizada/creada para que los componentes client-side
        // puedan actualizar su estado sin depender de una recarga completa.
        try {
          if (res.data) {
            const evt = new CustomEvent('finca-guardada', { detail: { finca: res.data } });
            window.dispatchEvent(evt);
          } else {
            // Si el server action no devuelve data, solo refrescamos la ruta como respaldo
            router.refresh();
          }
        } catch (e) {
          // En entornos donde window no exista (por ejemplo tests), hacemos refresh como respaldo
          router.refresh();
        }

        Swal.fire({
          title: `¡Finca ${isEditing ? 'actualizada' : 'registrada'}!`,
          text: `La finca se ${isEditing ? 'actualizó' : 'registró'} correctamente.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        // Muestra el error
        Swal.fire({
          title: 'Error',
          text: res.message || `No se pudo ${actionText.toLowerCase()} la finca.`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  // --- JSX (Se mantiene igual) ---

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
          value={tipoPropiedad}
          onChange={(e) => setTipoPropiedad(e.target.value as 'ESTATAL' | 'PRIVADA')}
        >
          <option value="ESTATAL">Estatal</option>
          <option value="PRIVADA">Privada</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-gray-700">Entidad a la que pertenece</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={entidadPertenece}
          onChange={(e) => setEntidadPertenece(e.target.value)}
        />
      </div>

      <div className="col-span-1">
        <label className="block text-gray-700">Uso actual</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={usoActual}
          onChange={(e) => setUsoActual(e.target.value)}
        />
      </div>

      <div className="col-span-1">
        <label className="block text-gray-700">Estado de conservación</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={estadoConservacion}
          onChange={(e) => setEstadoConservacion(e.target.value)}
        />
      </div>

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

      {/* Listas dinámicas con lógica refactorizada */}
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
