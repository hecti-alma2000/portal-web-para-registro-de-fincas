"use server";

import prisma from "@/lib/prisma";

export const getEventById = async (id: string) => {
  try {
    const event = await prisma.event.findFirst({
      where: { id: id },
    });
    return {
      ok: true,
      event: event,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo encontrar el evento por el id",
    };
  }
};
