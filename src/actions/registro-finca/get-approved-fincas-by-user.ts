'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function getApprovedFincasByUser() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }
  const userId = session.user.id;

  try {
    const fincas = await prisma.finca.findMany({
      where: { userId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
    return fincas;
  } catch (error) {
    console.error('Error al obtener fincas aprobadas del usuario:', error);
    return [];
  }
}
