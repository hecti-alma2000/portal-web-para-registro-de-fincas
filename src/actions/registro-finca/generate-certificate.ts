'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * Genera un certificado PDF para una finca que ha sido declarada "Apta"
 * basándose en su puntuación final de certificación.
 * * @param fincaId El ID de la finca a certificar.
 * @param puntuacion La puntuación total obtenida en el diagnóstico.
 * @returns El certificado PDF como una cadena Base64.
 */
export async function generateCertificate(fincaId: string, puntuacion: number) {
  const session = await auth();

  // 1. Validación de Autenticación
  if (!session?.user) {
    throw new Error('User not authenticated.');
  }

  const numericFincaId = Number(fincaId);

  // 2. Obtener datos de la Finca y el Propietario
  const finca = await prisma.finca.findUnique({
    where: { id: numericFincaId },
    select: { nombre: true, userId: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: finca?.userId },
    select: { name: true, email: true },
  });

  if (!finca || !user) {
    throw new Error('Finca or user data not found in the database.');
  }

  // Preparar datos para el certificado
  const propietarioNombre = user.name || user.email || 'Propietario Desconocido';
  const nombreFinca = finca.nombre;
  const fechaEmision = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determinar el nivel de resultado basado en la puntuación
  let nivelResultado: string;
  if (puntuacion >= 35) {
    nivelResultado = 'Óptimo';
  } else if (puntuacion >= 25) {
    nivelResultado = 'Alto';
  } else {
    // Nota: Este Server Action solo se llama si la finca es 'Apta',
    // pero definimos un nivel base si la puntuación es baja dentro del rango de Apta.
    nivelResultado = 'Satisfactorio';
  }

  // 3. Cargar la plantilla PDF
  const templatePath = path.join(process.cwd(), 'public', 'certificate_template.pdf');
  let pdfBytes: Uint8Array;

  try {
    pdfBytes = await fs.readFile(templatePath);
  } catch (error) {
    console.error('Error loading PDF template:', error);
    // Es vital que el cliente sepa que el certificado no pudo generarse
    throw new Error(
      'No se pudo cargar la plantilla del certificado PDF. Contacte al administrador.'
    );
  }

  // 4. Crear y modificar el documento
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();
  const smallSize = 12;
  const mediumSize = 18;
  const largeSize = 24;
  const textColor = rgb(0.1, 0.1, 0.1);
  const strongColor = rgb(0.1, 0.4, 0.2); // Verde oscuro para énfasis

  // --- COORDENADAS DE INSERCIÓN (AJUSTAR SEGÚN TU PLANTILLA) ---

  // Título Dinámico
  firstPage.drawText(
    `CERTIFICACIÓN DE POTENCIAL AGROTURÍSTICO - NIVEL ${nivelResultado.toUpperCase()}`,
    {
      x: width / 2 - 250, // Intentando centrar el texto
      y: height - 150,
      size: smallSize,
      color: strongColor,
    }
  );

  // Declaración formal (Texto Fijo Explicativo)
  firstPage.drawText(
    'Se otorga la presente certificación, validando la aptitud de la propiedad, a:',
    {
      x: 100,
      y: height - 210,
      size: smallSize,
      color: textColor,
    }
  );

  // Nombre del Propietario (Énfasis)
  firstPage.drawText(propietarioNombre, {
    x: 100,
    y: height - 250,
    size: mediumSize,
    color: strongColor,
  });

  // Nombre de la Finca
  firstPage.drawText(`Propietario de la Finca: "${nombreFinca}"`, {
    x: 100,
    y: height - 285,
    size: mediumSize,
    color: textColor,
  });

  // Resultado
  firstPage.drawText(`Resultado: APTO con Potencial Agroturístico Nivel ${nivelResultado}.`, {
    x: 100,
    y: height - 350,
    size: smallSize,
    color: strongColor,
  });

  // Puntuación
  firstPage.drawText(`Puntuación Total Obtenida: ${puntuacion} puntos.`, {
    x: 100,
    y: height - 380,
    size: mediumSize,
    color: textColor,
  });

  // Explicación del Método (Requiere múltiples llamadas para saltos de línea)
  const explicacionLinea1 = `Esta certificación se basa en el Sistema de Evaluación Ponderada de Criterios (SEPC),
    el cual evalúa 11 parámetros críticos`;
  const explicacionLinea2 = `(Infraestructura, Accesibilidad, Sustentabilidad, etc.)
    que confirman la alta viabilidad del espacio para el desarrollo agroturístico sostenible.`;

  firstPage.drawText(explicacionLinea1, {
    x: 100,
    y: height - 430,
    size: smallSize,
    color: textColor,
  });
  firstPage.drawText(explicacionLinea2, {
    x: 100,
    y: height - 445,
    size: smallSize,
    color: textColor,
  });

  // Fecha de Emisión (Pie del Certificado)
  firstPage.drawText(`Emitido el ${fechaEmision}.`, {
    x: width / 2 - 100,
    y: height - 550,
    size: mediumSize,
    color: textColor,
  });

  // 5. Guardar y retornar el PDF
  const pdfFinalBytes = await pdfDoc.save();

  // Retornamos los bytes codificados en base64 para enviarlos al cliente
  return Buffer.from(pdfFinalBytes).toString('base64');
}
