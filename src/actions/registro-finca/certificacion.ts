
'use server';
import prisma from "@/lib/prisma";


// Tipado para los datos de entrada del formulario
interface CertificacionFormState {
    // Parámetros Clave
    accesibilidad: boolean;
    permisoPropietario: boolean;
    seguridadEntorno: boolean;
    actividadAgricola: boolean;
    serviciosBasicos: boolean;
    
    // Parámetros Importantes
    produccionSostenible: boolean;
    ofertaProductos: boolean;
    ofertaActividades: boolean;
    valorCultural: boolean;
    infraestructuraAdic: boolean;
    
    // Parámetros Adicionales
    ofertaAlojamiento: boolean;
    gastronomiaLocal: boolean;
    senalizacion: boolean;
    elementosInteres: boolean;
}

/**
 * Procesa el formulario de certificación, calcula la puntuación y devuelve el resultado.
 */
export async function evaluarCertificacion(formData: CertificacionFormState) {
    // 1. Verificar Parámetros Clave (Condición de No Apto)
    const parametrosClave = [
        formData.accesibilidad,
        formData.permisoPropietario,
        formData.seguridadEntorno,
        formData.actividadAgricola,
        formData.serviciosBasicos,
    ];

    const esAptoMinimo = parametrosClave.every(cumplido => cumplido === true);

    if (!esAptoMinimo) {
        // Guardar el resultado en la BD (Puntuación 0, Nivel No Apto)
        await prisma.certificacion.create({
            data: { ...formData, puntuacionTotal: 0, nivelPotencial: 'No Apto' },
        });
        return {
            status: 'error',
            title: 'No Apto para Certificación',
            message: 'Tu finca no cumple con los requisitos mínimos esenciales para el agroturismo.',
            icon: 'error',
        };
    }

    // 2. Calcular la Puntuación de Potencial (Si es Apto Mínimo)
    let puntuacion = 0;

    // Pesos: Importantes (2 puntos)
    if (formData.produccionSostenible) puntuacion += 2;
    if (formData.ofertaProductos) puntuacion += 2;
    if (formData.ofertaActividades) puntuacion += 2;
    if (formData.valorCultural) puntuacion += 2;
    if (formData.infraestructuraAdic) puntuacion += 2; // Total máximo: 10
    
    // Pesos: Adicionales (1 punto)
    if (formData.ofertaAlojamiento) puntuacion += 1;
    if (formData.gastronomiaLocal) puntuacion += 1;
    if (formData.senalizacion) puntuacion += 1;
    if (formData.elementosInteres) puntuacion += 1; // Total máximo: 14

    // 3. Determinar el Nivel de Potencial (Basado en nuestra regla: 70% para Gran Potencial, 40% para Mejoras)
    const MAX_PUNTOS_POTENCIAL = 14; // 10 + 4
    const porcentaje = (puntuacion / MAX_PUNTOS_POTENCIAL) * 100;

    let nivelPotencial = '';
    let icon = 'success'; // Icono por defecto
    let title = '';
    let message = '';

    if (porcentaje >= 70) {
        nivelPotencial = 'Gran Potencial';
        title = '¡Felicidades! Gran Potencial Agroturístico';
        message = `Tu finca cumple con ${puntuacion} de ${MAX_PUNTOS_POTENCIAL} puntos y está lista para el agroturismo.`;
    } else if (porcentaje >= 40) {
        nivelPotencial = 'Potencial con Mejoras';
        title = '¡Tiene Potencial, pero con Mejoras!';
        message = `Tu finca cumple con ${puntuacion} de ${MAX_PUNTOS_POTENCIAL} puntos. Recomendamos enfocarte en los criterios pendientes.`;
        icon = 'warning';
    } else {
        // En teoría, si esAptoMinimo es true, este caso no debería ser 'No Apto', sino 'Potencial bajo'
        nivelPotencial = 'Potencial bajo';
        title = 'Potencial Identificado, pero Requiere Más Desarrollo';
        message = `Tu finca cumple con ${puntuacion} de ${MAX_PUNTOS_POTENCIAL} puntos. Hay que trabajar mucho en las áreas de valor añadido.`;
        icon = 'info';
    }

    // 4. Guardar el resultado final en la BD
    await prisma.certificacion.create({
        data: { ...formData, puntuacionTotal: puntuacion, nivelPotencial },
    });

    return { status: 'success', title, message, icon };
}