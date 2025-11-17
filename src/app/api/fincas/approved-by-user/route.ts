import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const fincas = await prisma.finca.findMany({
      where: { userId: session.user.id, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(fincas);
  } catch (error) {
    console.error('Error en approved-by-user API:', error);
    return NextResponse.json([], { status: 500 });
  }
}
