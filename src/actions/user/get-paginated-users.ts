'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getPaginatedUser = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'El role debe ser administrador',
    };
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'desc',
      },
    });
    return {
      ok: true,
      users: users,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudieron obtener los productos',
    };
  }
};
