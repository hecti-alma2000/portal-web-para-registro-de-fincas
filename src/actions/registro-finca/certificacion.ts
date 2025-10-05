// src/actions/registro-finca/evaluarPotencialAgroturistico.ts

// Mapeo de Pesos (PI)
const PESOS = {
    criterioA: 0.06,
    criterioB: 0.06,
    criterioC: 0.07,
    criterioD: 0.07,
    criterioE: 0.11,
    criterioF: 0.09,
    criterioG: 0.14,
    criterioH: 0.13,
    criterioI: 0.09,
    criterioJ: 0.09,
    criterioK: 0.09,
};

// Tipo para los datos recibidos del formulario (ya convertidos a número)
interface DiagnosticoData {
    criterioA: number;
    criterioB: number;
    criterioC: number;
    criterioD: number;
    criterioE: number;
    criterioF: number;
    criterioG: number;
    criterioH: number;
    criterioI: number;
    criterioJ: number;
    criterioK: number;
}

export const evaluarPotencialAgroturistico = async (data: DiagnosticoData) => {
    // 1. Inicializar la puntuación
    let puntuacionTotal = 0;

    // 2. Iterar sobre cada criterio para calcular la puntuación ponderada (VI * PI)
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const criterio = key as keyof DiagnosticoData;
            const valoracion = data[criterio]; // Valoración seleccionada (VI)
            const peso = PESOS[criterio as keyof typeof PESOS]; // Peso del indicador (PI)

            // Calcular y sumar la Evaluación Final (VI * PI)
            puntuacionTotal += (valoracion * peso);
        }
    }

    // Aseguramos que solo tengamos dos decimales para el resultado final
    puntuacionTotal = parseFloat(puntuacionTotal.toFixed(2));

    // 3. Determinar el resultado final basado en el umbral
    const UMBRAL_APTO = 2.02;

    let resultadoFinal: "Apta" | "No apta";
    let icon: "success" | "warning";
    let message: string;

    if (puntuacionTotal > UMBRAL_APTO) {
        resultadoFinal = "Apta";
        icon = "success";
        message = `¡Felicidades! Tu finca ha sido clasificada como APTA para desarrollar actividades de agroturismo. Puntuación: ${puntuacionTotal}`;
    } else {
        resultadoFinal = "No apta";
        icon = "warning";
        message = `Tu finca ha sido clasificada como NO APTA (debe ser > ${UMBRAL_APTO}). Puntuación: ${puntuacionTotal}. Requiere mejoras para alcanzar el potencial agroturístico.`;
    }

    // 4. Aquí iría la lógica para guardar el Diagnostico en Prisma
    // Importa tu cliente Prisma
    // await prisma.diagnostico.create({ data: { ...data, fincaId: '...', puntuacionTotal, resultadoFinal } });

    // 5. Retornar el resultado para la alerta (SweetAlert2)
    return {
        icon,
        title: `Diagnóstico: Finca ${resultadoFinal}`,
        message,
        puntuacion: puntuacionTotal,
    };
};