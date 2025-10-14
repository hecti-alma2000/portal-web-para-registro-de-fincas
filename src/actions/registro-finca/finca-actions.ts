'use server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function getAllFincas() {
  try {
    const fincas = await prisma.finca.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return fincas;
  } catch (error) {
    return [];
  }
}

export async function deleteFinca(id: number) {
  try {
    // intentar eliminar foto asociada
    const finca: any = await prisma.finca.findUnique({ where: { id } });
    if (finca?.fotoUrl) {
      try {
        // Normalize fotoUrl to a filename inside public/uploads
        let foto = String(finca.fotoUrl || '');

        // If it's a full URL, extract the pathname
        try {
          if (/^https?:\/\//i.test(foto)) {
            const u = new URL(foto);
            foto = u.pathname; // e.g. /uploads/xxxx.jpg
          }
        } catch (e) {
          // ignore URL parse errors
        }

        // Remove any query string or hash
        foto = foto.split('?')[0].split('#')[0];

        // If the path contains 'uploads', take only the part after it
        const uploadsSegmentMatch = foto.match(/uploads[\\/](.*)$/i);
        const filename = uploadsSegmentMatch ? uploadsSegmentMatch[1] : foto.replace(/^[\\/]+/, '');

        // Build path under public/uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const p = path.join(uploadsDir, filename);

        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch (err) {
        // ignore file delete errors
      }
    }
    await prisma.finca.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: 'No se pudo eliminar la finca' };
  }
}

export async function getFincaByName(nombre: string) {
  try {
    const finca = await prisma.finca.findFirst({
      where: {
        nombre: {
          contains: nombre,
        },
      },
    });
    return finca;
  } catch (error) {
    return null;
  }
}
