'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const userChangeRole = async (userId: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe estar autenticado como admin',
    };
  }
  try {
    // Evitar cambiar el role del usuario principal (semilla)
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    const primaryEmail = process.env.SEED_ADMIN_EMAIL;
    if (targetUser && primaryEmail && targetUser.email === primaryEmail) {
      return {
        ok: false,
        message: 'No se puede cambiar el role del usuario principal',
      };
    }
    const newRole = role === 'admin' ? 'admin' : 'user';
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
      },
    });
    revalidatePath('/admin/users');
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo cambiar el role',
    };
  }
};
