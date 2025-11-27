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
    select: { nombre: true, userId: true, propietario: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: finca?.userId },
    select: { name: true, email: true },
  });

  if (!finca || !user) {
    throw new Error('Finca or user data not found in the database.');
  }

  // Preparar datos para el certificado
  const propietarioNombre = finca.propietario || 'Propietario Desconocido';
  const nombreFinca = finca.nombre;
  const fechaEmision = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determinar el nivel de resultado basado en la puntuación
  let nivelResultado: string;
  if (puntuacion >= 3.2) {
    // Umbral Óptimo (~85%)
    nivelResultado = 'Óptimo';
  } else if (puntuacion >= 2.5) {
    // Umbral Suficiente (~70%)
    nivelResultado = 'Suficiente';
  } else {
    // Si es "Apta" pero con bajo potencial (P < 2.5)
    nivelResultado = 'Insatisfactorio';
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

  // Fecha de Emisión (Pie del Certificado)
  firstPage.drawText(`Emitido el ${fechaEmision}.`, {
    x: width / 2 - 130,
    y: height - 390,
    size: smallSize,
    color: textColor,
  });

  // Nombre del Propietario (Énfasis)
  firstPage.drawText(propietarioNombre, {
    x: 215,
    y: height - 455,
    size: mediumSize,
    color: textColor,
  });

  // Nombre de la Finca
  firstPage.drawText(`${nombreFinca}`, {
    x: 215,
    y: height - 520,
    size: mediumSize,
    color: textColor,
  });

  // Nivel Alcanzado
  firstPage.drawText(`Nivel Alcanzado: ${nivelResultado.toUpperCase()}`, {
    x: 180,
    y: height - 575,
    size: mediumSize,
    color: textColor,
  });

  // Puntuación
  firstPage.drawText(`${puntuacion} puntos.`, {
    x: 350,
    y: height - 618,
    size: smallSize,
    color: textColor,
  });

  // 5. Guardar y retornar el PDF
  const pdfFinalBytes = await pdfDoc.save();

  // Retornamos los bytes codificados en base64 para enviarlos al cliente
  return Buffer.from(pdfFinalBytes).toString('base64');
}
