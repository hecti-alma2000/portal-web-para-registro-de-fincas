'use server';
import { auth } from '@/auth.config';
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
  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: 'No autenticado. Inicie sesión.' };
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'admin';

  try {
    // 1. Definir la cláusula WHERE
    const whereClause: any = { id };

    // 🔑 RESTRICCIÓN DE SEGURIDAD:
    // Si NO es admin, se debe verificar que la finca pertenezca al usuario.
    if (!isAdmin) {
      whereClause.userId = userId;
    }

    // 2. Intentar buscar la finca para eliminar la foto
    const finca: any = await prisma.finca.findUnique({ where: whereClause });

    // Si no se encuentra la finca bajo estas condiciones (e.g., el user intentó borrar la finca de otro)
    if (!finca) {
      return { ok: false, message: 'Finca no encontrada o no tiene permisos para eliminarla.' };
    }

    // 3. Lógica para eliminar la foto (solo si hay fotoUrl válida)
    if (finca.fotoUrl && typeof finca.fotoUrl === 'string' && finca.fotoUrl.trim() !== '') {
      try {
        let foto = String(finca.fotoUrl || '');
        // Normalize fotoUrl to a filename inside public/uploads
        try {
          if (/^https?:\/\//i.test(foto)) {
            const u = new URL(foto);
            foto = u.pathname; // e.g. /uploads/xxxx.jpg
          }
        } catch (e) {
          // ignore URL parse errors
        }
        foto = foto.split('?')[0].split('#')[0];
        const uploadsSegmentMatch = foto.match(/uploads[\\/](.*)$/i);
        const filename = uploadsSegmentMatch ? uploadsSegmentMatch[1] : foto.replace(/^[\\/]+/, '');
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const p = path.join(uploadsDir, filename);
        if (filename && fs.existsSync(p)) fs.unlinkSync(p);
      } catch (err) {
        console.error('Error al borrar foto:', err);
      }
    }

    // 4. Eliminar la finca (usando la cláusula WHERE con o sin userId)
    await prisma.finca.delete({ where: whereClause });

    return { ok: true };
  } catch (error) {
    // Este catch capturará errores de Prisma si el WHERE no encuentra nada (lo cual ya manejamos arriba)
    console.error('Error al eliminar finca en DB:', error);
    return { ok: false, message: 'Error en la base de datos al eliminar.' };
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
