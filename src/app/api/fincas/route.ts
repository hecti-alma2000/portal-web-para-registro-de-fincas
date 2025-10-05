import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fincas = await prisma.finca.findMany({ select: { id: true, nombre: true } });
    return NextResponse.json({ ok: true, data: fincas });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
