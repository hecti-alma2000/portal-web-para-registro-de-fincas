'use server';
import prisma from '@/lib/prisma'; // Asegúrate de importar tu instancia de prisma
import { RequestStatus } from '@prisma/client';

export async function getPendingRequestsCount() {
  try {
    const count = await prisma.finca.count({
      where: {
        status: RequestStatus.PENDING,
      },
    });
    return count;
  } catch (error) {
    console.error('Error contando solicitudes:', error);
    return 0;
  }
}
