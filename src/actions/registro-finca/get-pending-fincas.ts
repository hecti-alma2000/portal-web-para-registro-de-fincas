'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';

export async function getPendingFincas() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return [];

  const pending = await prisma.finca.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
  return pending;
}
