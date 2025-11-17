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

    // ... (Tu lógica existente para Certificaciones, última Certificación, etc.) ...

    // Ejemplo: Certificaciones (asumiendo que es una columna en Finca o tabla separada)
    stats.certificaciones = 0; // Coloca aquí la lógica de conteo real
    stats.ultimaCertificacion = null; // Coloca aquí la lógica de fecha

    stats.isAdmin = isAdmin;

    return stats;
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return null;
  }
}
