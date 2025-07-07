"use server";

import { Event } from "@/interfaces";
import prisma from "@/lib/prisma";

export const createEvent = async (data: Event) => {
  try {
    const { title, description, endDate, startDate, address, url } = data;
    const create = await prisma.event.create({
      data: { startDate, endDate, title, description, address, url },
    });
    return {
      ok: true,
      data: create,
    };
  } catch (error) {
    return {
      ok: false,
      message: "no se pudo crear el evento",
    };
  }
};
