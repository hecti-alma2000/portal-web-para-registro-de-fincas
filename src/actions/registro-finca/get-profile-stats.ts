// actions/registro-finca/get-profile-stats.ts (Ejemplo de implementación)
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';

export async function getProfileStats() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === 'admin';

  if (!userId) return null;

  try {
    const stats: any = {};

    // 🔑 CAMBIO CLAVE AQUÍ: Filtrar el conteo por status = 'APPROVED'
    if (isAdmin) {
      stats.totalFincas = await prisma.finca.count({
        where: {
          status: 'APPROVED', // 👈 Solo fincas aprobadas
        },
      });
    } else {
      // Conteo de fincas del usuario (puede incluir PENDING y APPROVED, ajusta según la UX deseada)
      stats.userFincas = await prisma.finca.count({
        where: {
          userId: userId,
          status: {
            // Podrías querer mostrar APROBADAS y PENDIENTES
            not: 'REJECTED',
          },
        },
      });
    }

    // Certificaciones: contamos diagnósticos que resultaron 'Apta'.
    // Para administradores contamos en todo el sistema; para usuarios solo en sus fincas.
    if (isAdmin) {
      stats.certificaciones = await prisma.diagnostico.count({
        where: {
          resultadoFinal: 'Apta',
        },
      });

      const ultima = await prisma.diagnostico.findFirst({
        where: { resultadoFinal: 'Apta' },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      stats.ultimaCertificacion = ultima?.createdAt ?? null;
    } else {
      stats.certificaciones = await prisma.diagnostico.count({
        where: {
          resultadoFinal: 'Apta',
          finca: { userId: userId },
        },
      });

      const ultima = await prisma.diagnostico.findFirst({
        where: { resultadoFinal: 'Apta', finca: { userId: userId } },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      stats.ultimaCertificacion = ultima?.createdAt ?? null;
    }

    stats.isAdmin = isAdmin;

    return stats;
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return null;
  }
}
