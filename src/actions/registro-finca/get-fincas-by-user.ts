'use server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
export async function getFincasByUser() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }
  const userId = session?.user?.id;
  try {
    const fincas = await prisma.finca.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return fincas;
  } catch (error) {
    console.error('Error al obtener fincas por usuario:', error);
    return [];
  }
}
