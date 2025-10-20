// @/actions/registro-finca/generate-certificate.ts
'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function generateCertificate(fincaId: string, puntuacion: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('User not authenticated.');
  }

  const numericFincaId = Number(fincaId);

  // 1. Obtener datos necesarios
  const finca = await prisma.finca.findUnique({
    where: { id: numericFincaId },
    select: { nombre: true, userId: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: finca?.userId },
    select: { name: true },
  });

  if (!finca || !user) {
    throw new Error('Finca or user not found.');
  }

  const propietarioNombre = user.name || session.user.email || 'Propietario Desconocido';
  const nombreFinca = finca.nombre;
  const fechaEmision = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 2. Cargar la plantilla PDF
  // Crea un archivo PDF de plantilla simple y guárdalo en la carpeta 'public'
  const templatePath = path.join(process.cwd(), 'public', 'certificate_template.pdf');

  // Nota: Para sistemas de Serverless (Vercel), debes usar fetch o Buffer.from.
  // Usaremos fs/promises para un entorno Node tradicional (local/docker).
  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await fs.readFile(templatePath);
  } catch (error) {
    console.error('Error loading PDF template:', error);
    throw new Error('No se pudo cargar la plantilla del certificado.');
  }

  // 3. Crear y modificar el documento
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();
  const fontSize = 18;
  const textColor = rgb(0.1, 0.1, 0.1); // Casi negro

  // A continuación, se definen las coordenadas X/Y para los campos de texto:
  // (Estos valores son ESTIMADOS y tendrás que ajustarlos manualmente según tu plantilla)

  // Dibujar Propietario
  firstPage.drawText(`Propietario: ${propietarioNombre}`, {
    x: 50, // Columna
    y: height - 200, // Fila
    size: fontSize,
    color: textColor,
  });

  // Dibujar Nombre de la Finca
  firstPage.drawText(`Finca Certificada: ${nombreFinca}`, {
    x: 50,
    y: height - 250,
    size: fontSize,
    color: textColor,
  });

  // Dibujar Puntuación
  firstPage.drawText(`Puntuación Total: ${puntuacion} puntos`, {
    x: 50,
    y: height - 300,
    size: fontSize,
    color: textColor,
  });

  // Dibujar Fecha
  firstPage.drawText(`Fecha de Emisión: ${fechaEmision}`, {
    x: 50,
    y: height - 350,
    size: fontSize,
    color: textColor,
  });

  // 4. Guardar y retornar el PDF como Buffer (Uint8Array)
  const pdfFinalBytes = await pdfDoc.save();

  // Retornamos los bytes codificados en base64 para enviarlos al cliente
  return Buffer.from(pdfFinalBytes).toString('base64');
}
