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

    // Buscar la finca para obtener su nombre
    const finca = await prisma.finca.findUnique({
      where: { id: Number(fincaId) },
      select: { id: true, nombre: true },
    });

    // Ejecutar la evaluación (devuelve icon/title/message/puntuacion)
    const resultadoBase = await evaluarPotencialAgroturistico(datos);

    // Añadir el nombre de la finca al título y mensaje si lo tenemos
    const fincaNombre = finca?.nombre ?? `ID ${fincaId}`;
    const resultado = {
      ...resultadoBase,
      title: `${resultadoBase.title} - ${fincaNombre}`,
      message: `${resultadoBase.message} \nFinca: ${fincaNombre}`,
    };

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
