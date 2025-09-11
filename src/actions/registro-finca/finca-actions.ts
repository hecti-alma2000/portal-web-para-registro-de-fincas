"use server";
import prisma from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

export async function getAllFincas() {
  try {
    const fincas = await prisma.finca.findMany({
      orderBy: { createdAt: "desc" },
    });
    return fincas;
  } catch (error) {
    return [];
  }
}

export async function deleteFinca(id: number) {
  try {
    // intentar eliminar foto asociada
  const finca: any = await prisma.finca.findUnique({ where: { id } });
  if (finca?.fotoUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public');
        const p = path.join(uploadsDir, finca.fotoUrl.replace(/^[\\/]+/, ''));
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch (err) {
        // ignore file delete errors
      }
    }
    await prisma.finca.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "No se pudo eliminar la finca" };
  }
}

export async function getFincaByName(nombre: string) {
  try {
    const finca = await prisma.finca.findFirst({
      where: {
        nombre: {
          contains: nombre,
        },
      },
    });
    return finca;
  } catch (error) {
    return null;
  }
}
