import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { evaluarPotencialAgroturistico } from '@/actions/registro-finca/certificacion';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fincaId,
      criterioA,
      criterioB,
      criterioC,
      criterioD,
      criterioE,
      criterioF,
      criterioG,
      criterioH,
      criterioI,
      criterioJ,
      criterioK,
    } = body;

    if (!fincaId) {
      return NextResponse.json({ ok: false, error: 'fincaId is required' }, { status: 400 });
    }

    const datos = {
      criterioA,
      criterioB,
      criterioC,
      criterioD,
      criterioE,
      criterioF,
      criterioG,
      criterioH,
      criterioI,
      criterioJ,
      criterioK,
    };

    // Ejecutar la evaluación (devuelve icon/title/message/puntuacion)
    const resultado = await evaluarPotencialAgroturistico(datos);

    // Guardar en la base de datos
    const diagnostico = await prisma.diagnostico.create({
      data: {
        // id will be cuid generated
        fincaId: Number(fincaId),
        puntuacionTotal: resultado.puntuacion,
        resultadoFinal: resultado.title.includes('Apta') ? 'Apta' : 'No apta',
        criterioA: Number(criterioA),
        criterioB: Number(criterioB),
        criterioC: Number(criterioC),
        criterioD: Number(criterioD),
        criterioE: Number(criterioE),
        criterioF: Number(criterioF),
        criterioG: Number(criterioG),
        criterioH: Number(criterioH),
        criterioI: Number(criterioI),
        criterioJ: Number(criterioJ),
        criterioK: Number(criterioK),
      },
    });

    return NextResponse.json({ ok: true, resultado, diagnostico });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
