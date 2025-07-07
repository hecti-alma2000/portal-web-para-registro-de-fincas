"use server";
import prisma from "@/lib/prisma";

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
    await prisma.finca.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "No se pudo eliminar la finca" };
  }
}
