// src/components/ui/CertificacionForm.tsx
"use client"
import { useFormStatus } from "react-dom";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
            className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
            {pending ? 'Evaluando...' : 'Obtener mi Diagnóstico'}
        </button>
    );
};

// ----------------------------------------------------
// Nuevo Componente: RadioCriterioInput
// ----------------------------------------------------

interface RadioCriterioInputProps {
    name: string; // El nombre del criterio (ej: criterioA)
    label: string; // La descripción del criterio
    maxValoracion: number; // El valor máximo de valoración (2, 3 o 4)
}

const RadioCriterioInput: React.FC<RadioCriterioInputProps> = ({ name, label, maxValoracion }) => {
    
    // Generamos un array con los valores posibles: [1, 2, 3, 4, ...]
    const valoraciones = Array.from({ length: maxValoracion }, (_, i) => i + 1);

    // Clase de Tailwind para el estilo del radio button
    const radioColorClass = 'text-green-600 border-gray-300 focus:ring-green-500'; 

    return (
        <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm transition hover:shadow-md">
            <h4 className="text-gray-800 font-semibold mb-3">{label}</h4>
            
            <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-500 font-medium">Valoración:</span>
                
                {valoraciones.map((valor) => (
                    <label 
                        key={valor} 
                        className="flex items-center space-x-1 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name={name} // Usamos el mismo nombre para agrupar los radios
                            value={valor} // El valor que se enviará: 1, 2, 3 o 4
                            required // Hacemos que la selección sea obligatoria
                            className={`h-4 w-4 ${radioColorClass}`}
                        />
                        <span className="text-sm text-gray-700 font-medium">{valor}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// ----------------------------------------------------
// Componente principal CertificacionForm
// ----------------------------------------------------

export const CertificacionForm: React.FC = () => {
    const [fincas, setFincas] = useState<Array<{ id: number; nombre: string }>>([]);
    const [loadingFincas, setLoadingFincas] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoadingFincas(true);
            try {
                const res = await fetch('/api/fincas');
                const json = await res.json();
                if (json.ok) setFincas(json.data || []);
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

        const payload = {
            fincaId: formData.get('fincaId'),
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
                await Swal.fire({
                    icon: resultado.icon,
                    title: resultado.title,
                    text: resultado.message,
                });
                // Optionally reset the form
                form.reset();
            } else {
                await Swal.fire({ icon: 'error', title: 'Error', text: json.error || 'Error en la solicitud' });
            }
        } catch (err: any) {
            await Swal.fire({ icon: 'error', title: 'Error', text: String(err) });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-8 bg-gray-50 rounded-xl shadow-2xl">
            <p className="text-gray-700 text-lg mb-6 border-b pb-4 font-semibold">
                Valora cada criterio para obtener el diagnóstico ponderado de potencial agroturístico.
            </p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona la finca</label>
                <select name="fincaId" required className="w-full p-2 border rounded">
                    <option value="">{loadingFincas ? 'Cargando fincas...' : 'Selecciona una finca'}</option>
                    {fincas.map(f => (
                        <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                
                <RadioCriterioInput name="criterioA" label="A. Existencia de una casa rural o rancho campestre" maxValoracion={2} />
                <RadioCriterioInput name="criterioB" label="B. Capacidad de recibir clientes" maxValoracion={2} />
                <RadioCriterioInput name="criterioC" label="C. Accesibilidad" maxValoracion={3} />
                <RadioCriterioInput name="criterioD" label="D. Distribución de las áreas según su uso agropecuario" maxValoracion={3} />
                <RadioCriterioInput name="criterioE" label="E. Sustentabilidad agrícola" maxValoracion={4} />
                <RadioCriterioInput name="criterioF" label="F. Categorización del espacio rural circundante" maxValoracion={3} />
                <RadioCriterioInput name="criterioG" label="G. Manejo sostenible de las tierras" maxValoracion={4} />
                <RadioCriterioInput name="criterioH" label="H. Aprovechamiento de los recursos naturales o construidos" maxValoracion={4} />
                <RadioCriterioInput name="criterioI" label="I. Infraestructura disponible" maxValoracion={4} />
                <RadioCriterioInput name="criterioJ" label="J. Cercanía a sitios con valores socioculturales y centros nodales" maxValoracion={4} />
                <RadioCriterioInput name="criterioK" label="K. Entorno atractivo" maxValoracion={4} />
            </div>

            <SubmitButton />
        </form>
    );
};