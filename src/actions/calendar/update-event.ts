"use server";

import { Event } from "@/interfaces";
import prisma from "@/lib/prisma";

export const updateEvent = async (data: Event) => {
  const { title, description, startDate, endDate, address, url, id } = data;
  try {
    const update = await prisma.event.update({
      where: { id: id },
      data: { title, description, startDate, endDate, address, url },
    });
    return {
      ok: true,
      data: update,
    };
  } catch (error) {
    return {
      ok: false,
      message: "no se pudo actualizar el evento",
    };
  }
};
