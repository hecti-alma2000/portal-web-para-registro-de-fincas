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
    // Marcar el usuario principal en base a la variable de entorno usada en seed
    const primaryEmail = process.env.SEED_ADMIN_EMAIL;
    const usersWithFlag = users.map((u) => ({
      ...u,
      isPrimary: primaryEmail ? u.email === primaryEmail : false,
    }));
    return {
      ok: true,
      users: usersWithFlag,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudieron obtener los productos',
    };
  }
};
