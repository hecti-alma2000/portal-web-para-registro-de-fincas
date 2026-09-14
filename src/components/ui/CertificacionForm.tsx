// src/components/ui/CertificacionForm.tsx
'use client';
import { useFormStatus } from 'react-dom';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from '@/lib/swal';
import { getAllFincas } from '@/actions/registro-finca/finca-actions';
import { generateCertificate } from '@/actions/registro-finca/generate-certificate';

// ... (Imports y SubmitButton se mantienen igual) ...

// Nuevo tipo de color para la interfaz, lo mantendremos simple (primary)
type InputColor = 'primary';

// ----------------------------------------------------
// Componente para el botón de envío (¡SOLUCIÓN AL ERROR!)
// ----------------------------------------------------
const SubmitButton = () => {
  // Es vital importar 'useFormStatus' para que este componente funcione en una Server Action
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 dark:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
    >
      {pending ? 'Evaluando...' : 'Obtener mi Diagnóstico'}
    </button>
  );
};

// ----------------------------------------------------
//  Componente: RadioCriterioInput
// ----------------------------------------------------

interface RadioCriterioInputProps {
  name: string; // El nombre del criterio (ej: criterioA)
  label: string; // La descripción del criterio
  maxValoracion: number; // El valor máximo de valoración (2, 3 o 4)
  onAnswered?: (name: string) => void;
}

const RadioCriterioInput: React.FC<RadioCriterioInputProps> = ({
  name,
  label,
  maxValoracion,
  onAnswered,
}) => {
  // Generamos un array con los valores posibles: [1, 2, 3, 4, ...]
  const valoraciones = Array.from({ length: maxValoracion }, (_, i) => i + 1);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm transition hover:shadow-md hover:border-green-300 dark:hover:border-green-700 h-full">
      <h4 className="text-gray-800 dark:text-slate-100 font-semibold mb-3 text-sm leading-snug">
        {label}
      </h4>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium shrink-0">
          Valoración
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {valoraciones.map((valor) => (
            <label
              key={valor}
              className="relative flex items-center justify-center h-9 w-9 rounded-full border-2 border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-600 dark:text-slate-300 cursor-pointer select-none transition-colors hover:border-green-400 has-[:checked]:bg-green-600 has-[:checked]:border-green-600 has-[:checked]:text-white dark:has-[:checked]:bg-green-500 dark:has-[:checked]:border-green-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-400 has-[:focus-visible]:ring-offset-2"
            >
              <input
                type="radio"
                name={name} // Usamos el mismo nombre para agrupar los radios
                value={valor} // El valor que se enviará: 1, 2, 3 o 4
                required // Hacemos que la selección sea obligatoria
                onChange={() => onAnswered?.(name)}
                className="sr-only"
              />
              {valor}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Componente principal CertificacionForm
// ----------------------------------------------------
const TOTAL_CRITERIOS = 11;

interface CertificacionFormProps {
  role: 'user' | 'admin';
}
export const CertificacionForm = ({ role }: CertificacionFormProps) => {
  const [fincas, setFincas] = useState<Array<{ id: number; nombre: string }>>([]);
  const [loadingFincas, setLoadingFincas] = useState(false);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  const handleAnswered = (name: string) => {
    setAnswered((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
  };
  const progress = Math.round((answered.size / TOTAL_CRITERIOS) * 100);

  useEffect(() => {
    const load = async () => {
      setLoadingFincas(true);
      try {
        if (role === 'admin') {
          const res = await getAllFincas();
          setFincas(res);
        } else {
          // Para usuarios normales solo mostramos fincas aprobadas
          const res = await fetch('/api/fincas/approved-by-user')
            .then((r) => r.json())
            .then((j) => j || []);
          // Si quieres usar una server action en el futuro, puedes reemplazar este fetch
          setFincas(res);
        }
      } catch (e) {
        // ignore for now
      } finally {
        setLoadingFincas(false);
      }
    };
    load();
  }, []);

  // handle submit in client: collect form values and POST to the API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // ... (payload creation remains the same)

    const payload = {
      fincaId: formData.get('fincaId'), // No se convierte a Number aquí, se hace en el API o Server Action
      criterioA: Number(formData.get('criterioA')),
      criterioB: Number(formData.get('criterioB')),
      criterioC: Number(formData.get('criterioC')),
      criterioD: Number(formData.get('criterioD')),
      criterioE: Number(formData.get('criterioE')),
      criterioF: Number(formData.get('criterioF')),
      criterioG: Number(formData.get('criterioG')),
      criterioH: Number(formData.get('criterioH')),
      criterioI: Number(formData.get('criterioI')),
      criterioJ: Number(formData.get('criterioJ')),
      criterioK: Number(formData.get('criterioK')),
    };

    try {
      const res = await fetch('/api/certificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        const { resultado } = json;

        // --- 🔑 LÓGICA DE CERTIFICADO AÑADIDA ---
        const isApta = resultado.title.includes('Apta'); // O el chequeo que uses
        let certificadoBase64 = null;

        if (isApta) {
          // Llamar a la Server Action para generar el certificado
          try {
            certificadoBase64 = await generateCertificate(
              payload.fincaId as string,
              resultado.puntuacion
            );
          } catch (certError) {
            console.error('Error al generar certificado:', certError);
            // Si falla la generación del certificado, muestra un mensaje de advertencia pero continúa.
            resultado.message += '\n\n⚠️ ¡Advertencia! Error al generar el certificado PDF.';
          }
        }
        // --- 🔑 FIN LÓGICA DE CERTIFICADO ---

        await Swal.fire({
          icon: resultado.icon,
          title: resultado.title,
          text: resultado.message,
          confirmButtonText: isApta ? 'Descargar Certificado' : 'Entendido',
          showCancelButton: isApta,
          cancelButtonText: 'Cerrar',
        }).then((result) => {
          if (isApta && result.isConfirmed && certificadoBase64) {
            // Función de descarga
            const byteCharacters = atob(certificadoBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado_${payload.fincaId}_${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }); // Optionally reset the form
        form.reset();
        setAnswered(new Set());
      } else {
        // ... (manejo de error) ...
      }
    } catch (err: any) {
      // ... (manejo de error) ...
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl mx-auto p-6 sm:p-8 bg-gray-50 dark:bg-slate-900 text-black dark:text-white rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800"
    >
      <div className="flex items-center justify-between gap-6 flex-col sm:flex-row border-b border-gray-200 dark:border-slate-700 pb-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Diagnóstico FPAT
          </h2>
          <p className="text-green-600 dark:text-green-400 text-sm sm:text-base">
            Valora cada criterio para obtener el resultado ponderado del índice de FPAT y si es
            apta para su certificación avalada.
          </p>
        </div>
        <Image
          src="/icons/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-md bg-white dark:bg-slate-700 p-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
          Selecciona la finca
        </label>
        <select
          name="fincaId"
          required
          className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        >
          <option value="">{loadingFincas ? 'Cargando fincas...' : 'Selecciona una finca'}</option>
          {fincas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Progreso del cuestionario */}
      <div>
        <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-slate-300 mb-1.5">
          <span>Progreso del cuestionario</span>
          <span>
            {answered.size} de {TOTAL_CRITERIOS} completados
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-green-600 dark:bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RadioCriterioInput
          name="criterioA"
          label="A. Existencia de una casa rural o rancho campestre"
          maxValoracion={2}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioB"
          label="B. Capacidad de recibir clientes"
          maxValoracion={2}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioC"
          label="C. Accesibilidad"
          maxValoracion={3}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioD"
          label="D. Distribución de las áreas según su uso agropecuario"
          maxValoracion={3}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioE"
          label="E. Sustentabilidad agrícola"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioF"
          label="F. Categorización del espacio rural circundante"
          maxValoracion={3}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioG"
          label="G. Manejo sostenible de las tierras"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioH"
          label="H. Aprovechamiento de los recursos naturales o construidos"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioI"
          label="I. Infraestructura disponible"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioJ"
          label="J. Cercanía a sitios con valores socioculturales y centros nodales"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
        <RadioCriterioInput
          name="criterioK"
          label="K. Entorno atractivo"
          maxValoracion={4}
          onAnswered={handleAnswered}
        />
      </div>

      <SubmitButton />
    </form>
  );
};
