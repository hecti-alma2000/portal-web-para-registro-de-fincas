"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}
// 1. Obtner los eventos en pag donde cada una va a tener 12 productos por defecto
export const getPaginatedEvents = async ({
  page = 1,
  take = 12,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  try {
    const events = prisma.event.findMany({
      take: take,
      skip: (page - 1) * take,
    });
    // 2. Obtner el total de pag
    const totalCount = await prisma.event.count({}); //contar la cantidad de eventos que hay en la DB
    const totalPages = Math.ceil(totalCount / take); //el metodo ceil toma el sigiente entero ejem: 4.1=5 (cuatro pag con 12 y la 5 con 1 evento)

    return {
      currentPage: page, // pag en la que se está
      totalPages: totalPages,
      events: (await events).map((event) => ({
        ...event,
      })),
    };
  } catch (error) {
    throw new Error("No se pudierion cargar los productos");
  }
};
