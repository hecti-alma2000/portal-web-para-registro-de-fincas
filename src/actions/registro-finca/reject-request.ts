// actions/registro-finca/reject-request.ts (o renombrarla)
'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';

export async function deleteFincaRequest(id: number) {
  // 👈 Renombrada para claridad
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    // 🔑 CAMBIO CLAVE: Usamos DELETE en lugar de UPDATE
    await prisma.finca.delete({ where: { id } });

    // Revalidar la ruta para que la lista se actualice
    revalidatePath('/admin/request');

    return { ok: true, message: 'Finca eliminada correctamente.' };
  } catch (error) {
    console.error('deleteFincaRequest error', error);
    return { ok: false, message: 'Error al eliminar la finca.' };
  }
}
