"use server";

import prisma from "@/lib/prisma";

export const getAllEvents = async () => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: "asc", // Ordena por la fecha de inicio de forma ascendente
      },
    });
    return {
      ok: true,
      events: events,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudieron obtener los eventos",
    };
  }
};
