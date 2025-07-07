"use server";

import prisma from "@/lib/prisma";

export const deleteEvent = async (id: string) => {
  try {
    const deleteEvent = await prisma.event.delete({
      where: { id: id },
    });
    return {
      ok: true,
      deleteEvent: deleteEvent,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo eliminar el evento",
    };
  }
};
