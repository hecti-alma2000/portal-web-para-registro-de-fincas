'use server';

import prisma from '@/lib/prisma';

export const getFincaById = async (id: number) => {
  try {
    const finca = await prisma.finca.findUnique({
      where: { id },
    });

    if (!finca) return null;

    return finca;
  } catch (error) {
    console.error('Error fetching Finca by id:', error);
    return null;
  }
};
