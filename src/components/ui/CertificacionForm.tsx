// src/components/ui/CertificacionForm.tsx
'use client';

import Swal from 'sweetalert2'; 
import { useFormStatus } from 'react-dom';
import { evaluarCertificacion } from '@/actions/registro-finca/certificacion';

// Definición de tipos para los colores de importancia
type CheckboxColor = 'red' | 'amber' | 'green';

// ----------------------------------------------------
// CORRECCIÓN: Definición de la interfaz para el mapa de colores
// ----------------------------------------------------

// Define la estructura de cada entrada de color
interface ColorStyle {
    baseBorder: string;
    checkedRing: string;
}

// Define la estructura del mapa completo, asegurando que solo use claves de CheckboxColor
type ColorMap = Record<CheckboxColor, ColorStyle>;

// Mapa de colores de Tailwind para el BORDE del contenedor (la tarjeta)
const colorMap: ColorMap = {
    // 1. Requisitos Clave (ROJO)
    red: { 
        baseBorder: 'border-red-500', 
        checkedRing: 'ring-red-300', // Un anillo sutil
    },
    // 2. Potencial Adicional (ÁMBAR/NARANJA)
    amber: { 
        baseBorder: 'border-amber-500', 
        checkedRing: 'ring-amber-300',
    },
    // 3. Elementos Distintivos (VERDE)
    green: { 
        baseBorder: 'border-green-500', 
        checkedRing: 'ring-green-300',
    },
};

// Componente para el botón de envío
const SubmitButton = () => {
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

// CheckboxInput
const CheckboxInput: React.FC<{ name: string; label: string; color: CheckboxColor }> = ({ name, label, color }) => {
    // TypeScript ahora sabe que 'color' es una clave válida en 'colorMap'
    const colors = colorMap[color]; 

    return (
        <label 
            htmlFor={name} 
            // has-[:checked] ahora activa el estilo del borde y el anillo
            className={`flex items-start space-x-3 p-4 bg-white rounded-lg border-2 border-gray-200 transition cursor-pointer shadow-sm
                        has-[:checked]:border-2 has-[:checked]:${colors.baseBorder} 
                        has-[:checked]:ring-4 has-[:checked]:${colors.checkedRing} 
                        hover:shadow-md`}
        >
            
            <input 
                type="checkbox" 
                id={name} 
                name={name} 
                className={`mt-1.5 h-5 w-5 rounded border-gray-300 text-current focus:ring-current`} 
                value="on"
            />
            
            <span className="text-gray-700 font-medium flex-1 pt-0.5">
                {label}
            </span>
        </label>
    );
};


export const CertificacionForm: React.FC = () => {
    
    const handleSubmit = async (formData: FormData) => {
        
        // Mapeamos FormData a nuestra interfaz tipada para la Server Action
        const data = {
            // Parámetros Clave
            accesibilidad: formData.get('accesibilidad') === 'on',
            permisoPropietario: formData.get('permisoPropietario') === 'on',
            seguridadEntorno: formData.get('seguridadEntorno') === 'on',
            actividadAgricola: formData.get('actividadAgricola') === 'on',
            serviciosBasicos: formData.get('serviciosBasicos') === 'on',
            
            // Parámetros Importantes
            produccionSostenible: formData.get('produccionSostenible') === 'on',
            ofertaProductos: formData.get('ofertaProductos') === 'on',
            ofertaActividades: formData.get('ofertaActividades') === 'on',
            valorCultural: formData.get('valorCultural') === 'on',
            infraestructuraAdic: formData.get('infraestructuraAdic') === 'on',
            
            // Parámetros Adicionales
            ofertaAlojamiento: formData.get('ofertaAlojamiento') === 'on',
            gastronomiaLocal: formData.get('gastronomiaLocal') === 'on',
            senalizacion: formData.get('senalizacion') === 'on',
            elementosInteres: formData.get('elementosInteres') === 'on',
        };

        // Llamamos a la Server Action
        const result = await evaluarCertificacion(data);

        // Disparamos la alerta con SweetAlert2
        Swal.fire({
            icon: result.icon as ('success' | 'error' | 'warning' | 'info'),
            title: result.title,
            text: result.message,
            confirmButtonText: 'Entendido',
            customClass: {
                confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md',
            }
        });
    };

    return (
        <form action={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-2xl">
            <p className="text-gray-700 text-lg mb-6 border-b pb-4 font-semibold">
                Marca cada requisito que tu finca cumple actualmente para obtener un diagnóstico instantáneo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Requisitos Clave (ROJO) */}
                <CheckboxInput name="accesibilidad" label="Accesibilidad (Medios de transporte) - Mínimo" color="red"  />
                <CheckboxInput name="permisoPropietario" label="Permiso del Propietario - Mínimo" color="red" />
                <CheckboxInput name="seguridadEntorno" label="Entorno Seguro y Senderos Claros - Mínimo" color="red" />
                <CheckboxInput name="actividadAgricola" label="Actividad Agrícola o Ganadera Activa - Mínimo" color="red" />
                <CheckboxInput name="serviciosBasicos" label="Provisión de Servicios Sanitarios (Baño) - Mínimo" color="red" />

                {/* 2. Parámetros Importantes (ÁMBAR/NARANJA) */}
                <CheckboxInput name="produccionSostenible" label="Producción con Prácticas Sostenibles" color="amber" />
                <CheckboxInput name="ofertaProductos" label="Oferta/Venta de Productos Propios" color="amber" />
                <CheckboxInput name="ofertaActividades" label="Oferta de Actividades Participativas (Talleres)" color="amber" />
                <CheckboxInput name="valorCultural" label="Valor Histórico o Tradicional a Compartir" color="amber" />
                <CheckboxInput name="infraestructuraAdic" label="Infraestructura Adicional (Descanso, Sombra)" color="amber" />
                
                {/* 3. Parámetros Adicionales (VERDE) */}
                <CheckboxInput name="ofertaAlojamiento" label="Oferta de Alojamiento para pasar la Noche" color="green" />
                <CheckboxInput name="gastronomiaLocal" label="Oferta de Gastronomía Local/Tradicional" color="green" />
                <CheckboxInput name="senalizacion" label="Señalización Clara en Puntos de Interés" color="green" />
                <CheckboxInput name="elementosInteres" label="Elementos Atractivos (Miradores, Ríos, etc.)" color="green" />
            </div>

            <SubmitButton />
        </form>
    );
};