"use client";
import { useState, useTransition, useEffect } from "react";
import Swal from "sweetalert2";
import { createFinca } from "@/actions/registro-finca/create-finca";
import { updateFinca } from "@/actions/registro-finca/update-finca";
import { useFincaEditStore } from "@/store/modal/fincaEdit.store";

interface RegistroFincaFormProps {
  onSuccess?: () => void;
  fincaToEdit?: any | null;
}

export default function RegistroFincaForm({
  onSuccess,
  fincaToEdit,
}: RegistroFincaFormProps) {
  const [nombre, setNombre] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [propietario, setPropietario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const setFincaToEdit = useFincaEditStore((state) => state.setFincaToEdit);

  // Cambiar tipoPropiedad a tipo "ESTATAL" | "PRIVADA"
  const [tipoPropiedad, setTipoPropiedad] = useState<"ESTATAL" | "PRIVADA">(
    "ESTATAL"
  );
  const [entidadPertenece, setEntidadPertenece] = useState("");
  const [usoActual, setUsoActual] = useState("");
  const [estadoConservacion, setEstadoConservacion] = useState("");
  const [problematicaDetectada, setProblematicaDetectada] = useState("");
  const [tradicionesHistoria, setTradicionesHistoria] = useState("");
  const [disponibilidadAnual, setDisponibilidadAnual] = useState(false);
  const [ofreceAlojamiento, setOfreceAlojamiento] = useState(false);
  const [entornoLimpioSeguro, setEntornoLimpioSeguro] = useState(false);

  // Arrays dinámicos
  const [elementosInteres, setElementosInteres] = useState<string[]>([]);
  const [nuevoElementoInteres, setNuevoElementoInteres] = useState("");
  const [actividadesAgroturisticas, setActividadesAgroturisticas] = useState<
    string[]
  >([]);
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [principiosSustentabilidad, setPrincipiosSustentabilidad] = useState<
    string[]
  >([]);
  const [nuevoPrincipio, setNuevoPrincipio] = useState("");
  const [accionesAmbientales, setAccionesAmbientales] = useState<string[]>([]);
  const [nuevaAccion, setNuevaAccion] = useState("");

  useEffect(() => {
    if (fincaToEdit) {
      setNombre(fincaToEdit.nombre || "");
      setLocalizacion(fincaToEdit.localizacion || "");
      setPropietario(fincaToEdit.propietario || "");
      setDescripcion(fincaToEdit.descripcion || "");
      setTipoPropiedad(fincaToEdit.tipoPropiedad || "ESTATAL");
      setEntidadPertenece(fincaToEdit.entidadPertenece || "");
      setUsoActual(fincaToEdit.usoActual || "");
      setEstadoConservacion(fincaToEdit.estadoConservacion || "");
      setProblematicaDetectada(fincaToEdit.problematicaDetectada || "");
      setTradicionesHistoria(fincaToEdit.tradicionesHistoria || "");
      setDisponibilidadAnual(!!fincaToEdit.disponibilidadAnual);
      setOfreceAlojamiento(!!fincaToEdit.ofreceAlojamiento);
      setEntornoLimpioSeguro(!!fincaToEdit.entornoLimpioSeguro);
      setElementosInteres(
        fincaToEdit.elementosInteres?.map((e: any) => e.nombre) || []
      );
  setFotoPreview(fincaToEdit.fotoUrl || null);
  setFotoUrl(fincaToEdit.fotoUrl || undefined);
      setActividadesAgroturisticas(
        fincaToEdit.actividadesAgroturisticas?.map((a: any) => a.nombre) || []
      );
      setPrincipiosSustentabilidad(
        fincaToEdit.principiosSustentabilidad?.map((p: any) => p.nombre) || []
      );
      setAccionesAmbientales(
        fincaToEdit.accionesAmbientales?.map((a: any) => a.nombre) || []
      );
    } else {
      setNombre("");
      setLocalizacion("");
      setPropietario("");
      setDescripcion("");
      setTipoPropiedad("ESTATAL");
      setEntidadPertenece("");
      setUsoActual("");
      setEstadoConservacion("");
      setProblematicaDetectada("");
      setTradicionesHistoria("");
      setDisponibilidadAnual(false);
      setOfreceAlojamiento(false);
      setEntornoLimpioSeguro(false);
      setElementosInteres([]);
      setActividadesAgroturisticas([]);
      setPrincipiosSustentabilidad([]);
      setAccionesAmbientales([]);
    }
  }, [fincaToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fincaToEdit) {
      const result = await Swal.fire({
        title: "¿Editar finca?",
        text: "¿Estás seguro de guardar los cambios?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      });
      if (!result.isConfirmed) return;
      setLoading(true);
      startTransition(async () => {
        // Si se seleccionó un archivo nuevo, subirlo primero
        let uploadedUrl: string | undefined = fotoUrl;
        if (fotoFile) {
          try {
            const fd = new FormData();
            fd.append('file', fotoFile);
            const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });
            const j = await resUp.json();
            if (j.ok) {
              uploadedUrl = j.url;
              setFotoUrl(j.url);
              setFotoPreview(j.url);
            }
          } catch (err) {
            // ignore, continue without fotoUrl
          }
        }
        const res = await updateFinca({
          id: fincaToEdit.id,
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
          disponibilidadAnual,
          ofreceAlojamiento,
          entornoLimpioSeguro,
          elementosInteres,
          actividadesAgroturisticas,
          principiosSustentabilidad,
          accionesAmbientales,
        });
        setLoading(false);
        if (res.ok) {
          Swal.fire({
            title: "¡Finca actualizada!",
            text: "La finca se actualizó correctamente.",
            icon: "success",
            confirmButtonText: "OK",
          });
          window.dispatchEvent(
            new CustomEvent("finca-guardada", { detail: { finca: res.data } })
          );
          setFincaToEdit(null);
          if (onSuccess) onSuccess();
        } else {
          Swal.fire({
            title: "Error",
            text: res.message || "No se pudo actualizar la finca.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
      return;
    }
    const result = await Swal.fire({
      title: "¿Registrar finca?",
      text: "¿Estás seguro de registrar esta finca?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    startTransition(async () => {
        let uploadedUrl: string | undefined = fotoUrl;
        if (fotoFile) {
          try {
            const fd = new FormData();
            fd.append('file', fotoFile);
            const resUp = await fetch('/api/uploads', { method: 'POST', body: fd });
            const j = await resUp.json();
            if (j.ok) {
              uploadedUrl = j.url;
              setFotoUrl(j.url);
              setFotoPreview(j.url);
            }
          } catch (err) {
            // seguir sin foto
          }
        }
      const res = await createFinca({
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
        disponibilidadAnual,
        ofreceAlojamiento,
        entornoLimpioSeguro,
        elementosInteres,
        actividadesAgroturisticas,
        principiosSustentabilidad,
        accionesAmbientales,
      });
      setLoading(false);
      if (res.ok) {
        Swal.fire({
          title: "¡Finca registrada!",
          text: "La finca se registró correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.dispatchEvent(
          new CustomEvent("finca-guardada", { detail: { finca: res.data } })
        );
        if (onSuccess) onSuccess();
      } else {
        Swal.fire({
          title: "Error",
          text: res.message || "No se pudo registrar la finca.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  };

  return (
    <form
      className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit}
    >
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
          {/* hidden file input triggered by button */}
          <input
            id="foto-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFotoFile(f);
              if (f) setFotoPreview(URL.createObjectURL(f));
              else setFotoPreview(null);
            }}
          />
          <label htmlFor="foto-input" className="inline-flex items-center gap-2 bg-gray-200 px-3 py-2 rounded cursor-pointer hover:bg-gray-300">
            Examinar
          </label>
          {fotoFile && <span className="text-sm text-gray-600">{fotoFile.name}</span>}
          {!fotoFile && fotoPreview && (
            <img src={fotoPreview} alt="preview" className="w-32 h-20 object-cover rounded" />
          )}
          {fotoFile && (
            <button
              type="button"
              className="text-red-500 ml-2"
              onClick={() => {
                setFotoFile(null);
                setFotoPreview(fincaToEdit?.fotoUrl || null);
                // clear input value
                const el = document.getElementById('foto-input') as HTMLInputElement | null;
                if (el) el.value = '';
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700">Localización</label>
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
        <label className="block text-gray-700">Descripción</label>
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
          onChange={(e) =>
            setTipoPropiedad(e.target.value as "ESTATAL" | "PRIVADA")
          }
        >
          <option value="ESTATAL">Estatal</option>
          <option value="PRIVADA">Privada</option>
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700">
          Entidad a la que pertenece
        </label>
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
      <div className="col-span-1">
        <label className="block text-gray-700">Problemática detectada</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={problematicaDetectada}
          onChange={(e) => setProblematicaDetectada(e.target.value)}
        />
      </div>
      {/* Listas dinámicas */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Elementos de interés</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={nuevoElementoInteres}
            onChange={(e) => setNuevoElementoInteres(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              if (nuevoElementoInteres) {
                setElementosInteres([
                  ...elementosInteres,
                  nuevoElementoInteres,
                ]);
                setNuevoElementoInteres("");
              }
            }}
          >
            Agregar
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {elementosInteres.map((el, i) => (
            <li
              key={i}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {el}
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() =>
                  setElementosInteres(
                    elementosInteres.filter((_, idx) => idx !== i)
                  )
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">
          Actividades agroturísticas
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={nuevaActividad}
            onChange={(e) => setNuevaActividad(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              if (nuevaActividad) {
                setActividadesAgroturisticas([
                  ...actividadesAgroturisticas,
                  nuevaActividad,
                ]);
                setNuevaActividad("");
              }
            }}
          >
            Agregar
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {actividadesAgroturisticas.map((el, i) => (
            <li
              key={i}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {el}
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() =>
                  setActividadesAgroturisticas(
                    actividadesAgroturisticas.filter((_, idx) => idx !== i)
                  )
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">
          Principios de sustentabilidad
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={nuevoPrincipio}
            onChange={(e) => setNuevoPrincipio(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              if (nuevoPrincipio) {
                setPrincipiosSustentabilidad([
                  ...principiosSustentabilidad,
                  nuevoPrincipio,
                ]);
                setNuevoPrincipio("");
              }
            }}
          >
            Agregar
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {principiosSustentabilidad.map((el, i) => (
            <li
              key={i}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {el}
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() =>
                  setPrincipiosSustentabilidad(
                    principiosSustentabilidad.filter((_, idx) => idx !== i)
                  )
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Acciones ambientales</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={nuevaAccion}
            onChange={(e) => setNuevaAccion(e.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              if (nuevaAccion) {
                setAccionesAmbientales([...accionesAmbientales, nuevaAccion]);
                setNuevaAccion("");
              }
            }}
          >
            Agregar
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {accionesAmbientales.map((el, i) => (
            <li
              key={i}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {el}
              <button
                type="button"
                className="text-red-500 ml-1"
                onClick={() =>
                  setAccionesAmbientales(
                    accionesAmbientales.filter((_, idx) => idx !== i)
                  )
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Campos booleanos */}
      <div className="col-span-1 md:col-span-2 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={disponibilidadAnual}
            onChange={(e) => setDisponibilidadAnual(e.target.checked)}
          />
          Disponibilidad anual
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ofreceAlojamiento}
            onChange={(e) => setOfreceAlojamiento(e.target.checked)}
          />
          Ofrece alojamiento
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={entornoLimpioSeguro}
            onChange={(e) => setEntornoLimpioSeguro(e.target.checked)}
          />
          Entorno limpio y seguro
        </label>
      </div>
      <div className="col-span-1 md:col-span-2">
        <label className="block text-gray-700">Tradiciones e historia</label>
        <textarea
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={2}
          value={tradicionesHistoria}
          onChange={(e) => setTradicionesHistoria(e.target.value)}
        />
      </div>
      {/* Botón de submit ocupa toda la fila */}
      <div className="col-span-1 md:col-span-2">
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading || isPending}
        >
          {fincaToEdit
            ? loading || isPending
              ? "Editando..."
              : "Editar finca"
            : loading || isPending
            ? "Registrando..."
            : "Registrar finca"}
        </button>
      </div>
    </form>
  );
}
