'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * Genera un certificado PDF con datos dinámicos y 3 logos institucionales al pie.
 */
export async function generateCertificate(fincaId: string, puntuacion: number) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('User not authenticated.');
  }

  const numericFincaId = Number(fincaId);

  // 1. Obtener datos
  const finca = await prisma.finca.findUnique({
    where: { id: numericFincaId },
    select: { nombre: true, userId: true, propietario: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: finca?.userId },
    select: { name: true, email: true },
  });

  if (!finca || !user) {
    throw new Error('Finca or user data not found.');
  }

  // 2. Preparar textos
  const propietarioNombre = finca.propietario || 'Propietario Desconocido';
  const nombreFinca = finca.nombre;
  const fechaEmision = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let nivelResultado: string;
  if (puntuacion >= 3.2) {
    nivelResultado = 'ÓPTIMO';
  } else if (puntuacion >= 2.5) {
    nivelResultado = 'ALTO';
  } else {
    nivelResultado = 'SATISFACTORIO';
  }

  // 3. Definir rutas de archivos (Plantilla + Logos)
  const publicDir = path.join(process.cwd(), 'public');
  const templatePath = path.join(publicDir, 'certificate_template.pdf');

  // ⚠️ Asegúrate de que estos nombres coincidan con tus archivos reales en public/icons/
  const logo1Path = path.join(publicDir, 'icons', 'logo1.png');
  const logo2Path = path.join(publicDir, 'icons', 'logo2.png');
  const logo3Path = path.join(publicDir, 'icons', 'logo3.png');

  // 4. Cargar todos los recursos en paralelo (Buffer)
  let pdfBytes, logo1Bytes, logo2Bytes, logo3Bytes;

  try {
    [pdfBytes, logo1Bytes, logo2Bytes, logo3Bytes] = await Promise.all([
      fs.readFile(templatePath),
      fs.readFile(logo1Path),
      fs.readFile(logo2Path),
      fs.readFile(logo3Path),
    ]);
  } catch (error) {
    console.error('Error cargando recursos (PDF o Logos):', error);
    throw new Error('No se pudieron cargar los recursos necesarios para el certificado.');
  }

  // 5. Crear documento PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // 6. Incrustar las imágenes (Embed)
  // Nota: Si tus logos son JPG, usa pdfDoc.embedJpg(bytes)
  const logo1Image = await pdfDoc.embedPng(logo1Bytes);
  const logo2Image = await pdfDoc.embedPng(logo2Bytes);
  const logo3Image = await pdfDoc.embedPng(logo3Bytes);

  // --- DIBUJAR TEXTOS ---
  const textColor = rgb(0.1, 0.1, 0.1);

  // Fecha (Pie izquierdo o donde hayas limpiado el espacio)
  firstPage.drawText(`Emitido el ${fechaEmision}.`, {
    x: 180,
    y: height - 385,
    size: 13,
    color: textColor,
  });

  // Propietario
  firstPage.drawText(propietarioNombre, {
    x: 215,
    y: height - 451,
    size: 18,
    color: textColor,
  });

  // Finca
  firstPage.drawText(nombreFinca, {
    x: 240,
    y: height - 515,
    size: 18,
    color: textColor,
  });

  // Nivel (Centrado visualmente donde estaban las casillas)
  firstPage.drawText(`Nivel Optenido: ${ nivelResultado }`, {
    x: 200,
    y: height - 572,
    size: 18,
    color: textColor,
  });

  // Puntuación
  firstPage.drawText(`${puntuacion} puntos.`, {
    x: 350,
    y: height - 612,
    size: 12,
    color: textColor,
  });

  // --- 7. DIBUJAR LOGOS (Distribución Uniforme) ---




  // --- DIBUJAR LOGOS (Pie, centrados y dentro de la página) ---
  const logoSize = 70; // Tamaño cuadrado de cada logo
  const gap = 100; // Espacio entre logos
  const logoY = 150; // Altura desde el borde inferior
  const totalLogosWidth = logoSize * 3 + gap * 2;
  const startX = (width - totalLogosWidth) / 2;

  // Logo 1 (izquierda)
  firstPage.drawImage(logo1Image, {
    x: startX,
    y: logoY,
    width: logoSize,
    height: logoSize,
  });
  // Logo 2 (centro)
  firstPage.drawImage(logo2Image, {
    x: startX + logoSize + gap,
    y: logoY,
    width: logoSize,
    height: logoSize,
  });
  // Logo 3 (derecha)
  firstPage.drawImage(logo3Image, {
    x: startX + (logoSize + gap) * 2,
    y: logoY,
    width: logoSize,
    height: logoSize,
  });

  // 8. Finalizar
  const pdfFinalBytes = await pdfDoc.save();
  return Buffer.from(pdfFinalBytes).toString('base64');
}
