'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export async function getProfileStats() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  const isAdmin = session.user.role === 'admin';
  let totalFincas = 0;
  let userFincas = 0;
  let userId = session.user.id;
  let certificaciones = 0;
  let ultimaCertificacion: string | null = null;
  let fincaReciente: { nombre: string; fecha: string } | null = null;

  if (isAdmin) {
    totalFincas = await prisma.finca.count();
    certificaciones = await prisma.diagnostico.count();
    // Última certificación (diagnóstico más reciente)
    const lastDiag = await prisma.diagnostico.findFirst({ orderBy: { createdAt: 'desc' } });
    ultimaCertificacion = lastDiag?.createdAt ? lastDiag.createdAt.toISOString() : null;
    // Finca más reciente
    const lastFinca = await prisma.finca.findFirst({ orderBy: { createdAt: 'desc' } });
    fincaReciente = lastFinca
      ? { nombre: lastFinca.nombre, fecha: lastFinca.createdAt.toISOString() }
      : null;
  } else {
    userFincas = await prisma.finca.count({ where: { userId } });
    certificaciones = await prisma.diagnostico.count({ where: { finca: { userId } } });
    // Última certificación del usuario
    const lastDiag = await prisma.diagnostico.findFirst({
      where: { finca: { userId } },
      orderBy: { createdAt: 'desc' },
    });
    ultimaCertificacion = lastDiag?.createdAt ? lastDiag.createdAt.toISOString() : null;
    // Finca más reciente del usuario
    const lastFinca = await prisma.finca.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    fincaReciente = lastFinca
      ? { nombre: lastFinca.nombre, fecha: lastFinca.createdAt.toISOString() }
      : null;
  }

  return {
    totalFincas,
    userFincas,
    isAdmin,
    certificaciones,
    ultimaCertificacion,
    fincaReciente,
  };
}
