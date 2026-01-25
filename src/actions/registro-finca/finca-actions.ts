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

// 🔑 MODIFICADO: Ahora acepta "direccion" y usa coincidencia parcial
export async function getPublicFincas(filters?: {
  tipoEntidad?: 'ESTATAL' | 'PRIVADA';
  usoActual?: string;
  estadoConservacion?: string;
  direccion?: string; // Nuevo campo
}) {
  try {
    const where: any = { status: 'APPROVED' };

    if (filters) {
      if (filters.tipoEntidad) {
        where.tipoPropiedad = filters.tipoEntidad;
      }
      if (filters.usoActual) {
        where.usoActual = filters.usoActual;
      }
      if (filters.estadoConservacion) {
        where.estadoConservacion = filters.estadoConservacion;
      }

      // 🚀 LÓGICA DE BÚSQUEDA POR COINCIDENCIA
      // El modelo de Finca no tiene campo `direccion` en Prisma; usamos `nombre` y `localizacion`.
      if (filters.direccion) {
        where.OR = [
          {
            nombre: {
              contains: filters.direccion,
              mode: 'insensitive',
            },
          },
          {
            localizacion: {
              contains: filters.direccion,
              mode: 'insensitive',
            },
          },
          {
            propietario: {
              contains: filters.direccion,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    const fincas = await prisma.finca.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return fincas;
  } catch (error) {
    console.error('Error filtrando fincas:', error);
    return [];
  }
}

export async function deleteFinca(id: number) {
  const session = await auth();
  if (!session?.user) return { ok: false, message: 'No autenticado.' };

  const userId = session.user.id;
  const isAdmin = session.user.role === 'admin';

  try {
    const whereClause: any = { id };
    if (!isAdmin) whereClause.userId = userId;

    const finca: any = await prisma.finca.findUnique({ where: whereClause });
    if (!finca) return { ok: false, message: 'Finca no encontrada o sin permisos.' };

    if (finca.fotoUrl && typeof finca.fotoUrl === 'string' && finca.fotoUrl.trim() !== '') {
      try {
        let foto = String(finca.fotoUrl || '');
        if (/^https?:\/\//i.test(foto)) {
          const u = new URL(foto);
          foto = u.pathname;
        }
        foto = foto.split('?')[0].split('#')[0];
        const uploadsSegmentMatch = foto.match(/uploads[\\/](.*)$/i);
        const filename = uploadsSegmentMatch ? uploadsSegmentMatch[1] : foto.replace(/^[\\/]+/, '');
        const p = path.join(process.cwd(), 'public', 'uploads', filename);
        if (filename && fs.existsSync(p)) fs.unlinkSync(p);
      } catch (err) {
        console.error('Error al borrar foto:', err);
      }
    }

    await prisma.finca.delete({ where: whereClause });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: 'Error en la base de datos.' };
  }
}

export async function getFincaByName(nombre: string) {
  try {
    const finca = await prisma.finca.findFirst({
      where: {
        nombre: { contains: nombre, mode: 'insensitive' },
      },
    });
    return finca;
  } catch (error) {
    return null;
  }
}
