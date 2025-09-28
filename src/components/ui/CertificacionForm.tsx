// src/components/ui/CertificacionForm.tsx
'use client';

import React from 'react';
import Swal from 'sweetalert2'; 
import { useFormStatus } from 'react-dom';
import { evaluarCertificacion } from '@/actions/registro-finca/certificacion';

// Definición de tipos para los colores de importancia
type CheckboxColor = 'red' | 'amber' | 'green';

// ----------------------------------------------------
// Componente para el botón de envío
// ----------------------------------------------------

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

/**
 * CheckboxInput: Aplica las clases de color de forma condicional/ternaria 
 * para asegurar que Tailwind compile los estilos dinámicos.
 */
const CheckboxInput: React.FC<{ name: string; label: string; color: CheckboxColor }> = ({ name, label, color }) => {
    
    // 1. Clases de color para el INPUT (color del check interno)
    const inputColorClass = 
        color === 'red' ? 'text-red-500 border-red-500' :
        color === 'amber' ? 'text-amber-500 border-amber-500' :
        'text-green-600 border-green-500'; 

    // 2. CLAVE: Clases de color para el BORDE del LABEL cuando está marcado (persistencia)
    const checkedBorderClass = 
        color === 'red' ? 'has-[:checked]:border-red-500 has-[:checked]:ring-red-300' :
        color === 'amber' ? 'has-[:checked]:border-amber-500 has-[:checked]:ring-amber-300' :
        'has-[:checked]:border-green-500 has-[:checked]:ring-green-300';
    
    // 3. Clases de color para el BORDE del LABEL al hacer hover (visualización previa)
    const hoverBorderClass = 
        color === 'red' ? 'hover:border-red-300' :
        color === 'amber' ? 'hover:border-amber-300' :
        'hover:border-green-300';


    return (
        // El label contenedor ahora tiene el borde y anillo condicionales
        <label 
            htmlFor={name} 
            className={`flex items-start space-x-3 p-4 bg-white rounded-lg border-2 border-gray-200 transition cursor-pointer shadow-sm
                        has-[:checked]:border-2 has-[:checked]:ring-4 
                        ${checkedBorderClass} 
                        ${hoverBorderClass} 
                        hover:shadow-md`}
        >
            
            <input 
                type="checkbox" 
                id={name} 
                name={name} 
                // Aplicamos las clases ternarias explícitas al input nativo.
                className={`mt-1.5 h-5 w-5 rounded border-gray-300 focus:ring-0 ${inputColorClass}`} 
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
        <form action={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6  rounded-xl shadow-2xl">
            <p className="text-gray-700 text-lg mb-6 border-b pb-4 font-semibold">
                Marca cada requisito que tu finca cumple actualmente para obtener un diagnóstico instantáneo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Requisitos Clave (ROJO) */}
                <CheckboxInput name="accesibilidad" label="Accesibilidad (Medios de transporte) - Mínimo" color="red" />
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