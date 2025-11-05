// prisma/seed.ts
import { PrismaClient, TipoPropiedad, Role } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

// Definiciones de Constantes y Credenciales del Administrador
const ADMIN_EMAIL = 'lisbeteunice1008@gmail.com';
const ADMIN_PASSWORD = 'LizEunice25*';

// Tipado auxiliar para los datos de la finca antes de asignar la relación de usuario.
// Esto resuelve el error de TypeScript al declarar el array inicial, ya que no incluye 'user'.
type FincaDataTemplate = {
  nombre: string;
  localizacion: string;
  propietario: string;
  tipoPropiedad: TipoPropiedad;
  entidadPertenece: string | null;
  descripcion: string | null;
  usoActual: string | null;
  estadoConservacion: string | null;
  problematicaDetectada: string | null;
  tradicionesHistoria: string | null;
  fotoUrl: string | null;
};

// Datos del Usuario Administrador
const usersData = [
  {
    name: 'Lisbet Eunice Pérez Anzardo',
    email: ADMIN_EMAIL,
    // Hasheo síncrono de la contraseña (salt = 12)
    password: bcryptjs.hashSync(ADMIN_PASSWORD, 12),
    role: Role.admin,
  },
];

// Datos de las Fincas (Tipado como FincaDataTemplate[])
const fincasDataTemplate: FincaDataTemplate[] = [
  {
    nombre: 'La Bendecida',
    localizacion: 'Consejo Popular Buenaventura 2 (Jagüeyes)',
    propietario: 'Yainier Fajardo',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Su actividad fundamental son los cultivos varios, aunque también desarrolla la ganadería en menor escala. Cuenta, además, con un espejo de agua con abundante vegetación acuática y crianza de peces comestibles. Igualmente realiza conservas de productos mediante una minindustria instalada en su propiedad.',
    usoActual:
      'Ganadería, cultivos permanentes y crías de animales domésticos, autoconsumo familiar.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Falta de insumos',
    tradicionesHistoria: 'Mantiene tradiciones campesinas.',
    fotoUrl: '/uploads/la-bendecida.webp',
  },
  {
    nombre: 'El Troncón',
    localizacion:
      'Consejo Popular Buenaventura 2 (La Alegría No.3); a dos kilómetros del poblado cabecera Buenaventura.',
    propietario: 'Nolberto Santiesteban Velázquez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Su actividad económica fundamental es la pecuaria, aunque también se desarrolla la crianza de cerdos. Cuenta con una base alimentaria propia para el rebaño. Constituye un loto de reserva genética en la reproducción de 18 especies exóticas, como flamencos, pavo real, cotorras, toros siboneyes, jicoteas y un cocodrilo. El sendero de la entrada principal es un jardín con plantas ornamentales, 30 árboles frutales y 25 maderables. Ha sido declarada de referencia nacional en la diversificación agropecuaria y coto genético.',
    usoActual: 'Actividad pecuaria, autoconsumo familiar, cría de especies exóticas.',
    estadoConservacion: 'Muy bueno',
    problematicaDetectada: 'Falta de insumos',
    tradicionesHistoria:
      'Declarada de referencia nacional en diversificación agropecuaria y coto genético.',
    fotoUrl: '/uploads/el-troncon.webp',
  },
  {
    nombre: 'La Gloria',
    localizacion: 'Consejo Popular Buenaventura 2 (La Alegría No.3)',
    propietario: 'Olmo Santiesteban Álamo',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Su actividad fundamental es la ganadería, aunque también se producen cultivos varios, lo que abastece la minindustria La Gloria. Desarrolla la reforestación de áreas boscosas y mantiene las tradiciones campesinas asociadas a la agricultura en general.',
    usoActual: 'Actividad pecuaria y autoconsumo familiar, minindustria de alimentos.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Mantiene las tradiciones campesinas y desarrollo de reforestación.',
    fotoUrl: '/uploads/la-gloria.webp',
  },
  {
    nombre: 'El Carmen',
    localizacion: 'Consejo Popular Buenaventura 2 (La Alegría No.3)',
    propietario: 'Mariano Santiesteban Velázquez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Esta finca, tercera de la familia Santiesteban, tiene como actividad fundamental la ganadería, con producción de cultivos varios que abastecen a la minindustria La Gloria. Cuenta con vegetación variada y fauna doméstica. Desarrolla la reforestación de áreas boscosas y mantiene las tradiciones campesinas en apego a las costumbres familiares.',
    usoActual: 'Actividad pecuaria y autoconsumo familiar.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Falta de insumos para desarrollar la agricultura.',
    tradicionesHistoria:
      'Mantiene las tradiciones campesinas en apego a las costumbres familiares.',
    fotoUrl: '/uploads/el-carmen.webp',
  },
  {
    nombre: 'La Próspera',
    localizacion: 'Consejo Popular San Agustín (Cabezo)',
    propietario: 'Dainier Ballester Leyva',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Carlos Manuel de Céspedes”',
    descripcion:
      'Su actividad fundamental es cultivos varios, y su especialidad son los cítricos. Cuenta con recursos naturales y humanos de interés turístico. Su comercialización es con el turismo.',
    usoActual: 'Cultivos varios, especialmente cítricos como el limón y autoconsumo.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Especializada en cítricos, con comercialización al sector turismo.',
    fotoUrl: '/uploads/la-prospera.webp',
  },
  {
    nombre: 'La Margarita',
    localizacion: 'Consejo Popular La Jíquima (La Esperanza de Domínguez)',
    propietario: 'Rodrigo Crúz Álvarez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Raúl Pupo Morales”',
    descripcion:
      'Su actividad fundamental es cultivos varios, destacando una hectárea de limón. Llama la atención la existencia de siete palmas reales, símbolo nacional, en el paisaje de las lomas.',
    usoActual: 'Producción de cultivos varios, especialmente limón y autoconsumo.',
    estadoConservacion: 'Aceptable',
    problematicaDetectada: null,
    tradicionesHistoria: 'Presencia de siete palmas reales, símbolo nacional, en el paisaje.',
    fotoUrl: '/uploads/la-margarita.webp',
  },
  {
    nombre: 'La Alegría',
    localizacion: 'Consejo Popular Las Calabazas',
    propietario: 'Dixan Zúñiga Parra',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Frank País”',
    descripcion:
      'Su actividad fundamental es cultivos varios, destacando la siembra de 2 hectáreas de limón. Entre los elementos más distintivos del lugar se encuentra un riachuelo que atraviesa la propiedad.',
    usoActual: 'Producción de cultivos varios, especialmente limón y autoconsumo.',
    estadoConservacion: 'Aceptable',
    problematicaDetectada: null,
    tradicionesHistoria: 'Un riachuelo atraviesa la propiedad, ideal para actividades.',
    fotoUrl: '/uploads/la-alegria.webp',
  },
  {
    nombre: 'Las Maravillas',
    localizacion: 'Consejo Popular Buenaventura 1',
    propietario: 'Carlos Alberto Pozo Ramírez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Juan Manuel Romero”',
    descripcion:
      'Campesino ganadero con los mejores rendimientos de leche y carne. Ha transformado su finca en polígono de experimentación para la obtención de bovino adaptado al cambio climático (inseminación artificial). Cuenta con un área dedicada a cultivos varios con fertilizantes orgánicos.',
    usoActual:
      'Producción de cultivos varios, ganadería de alto rendimiento, experimentación genética.',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria:
      'Reconocimiento a diferentes niveles por rendimiento de leche y carne. Polígono de experimentación.',
    fotoUrl: '/uploads/las-maravillas.webp',
  },
  {
    nombre: 'La Paula',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Alberto Peña Valera',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería (producción de carne y leche) con cría de ganado mayor y menor. Cuenta con un rebaño ovino-caprino, tres micropresas con cría de pescados, y codornices. La infraestructura para la actividad pecuaria es buena (naves de ordeño y ceba).',
    usoActual: 'Ganadería, cría de ganado menor, cría de peces y codornices, autoconsumo familiar.',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria: 'Responsable con el medioambiente.',
    fotoUrl: '/uploads/la-paula.webp',
  },
  {
    nombre: 'Finca de Gil',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Gil Valera Ávila',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería, incluyendo ganado menor (ovino). Cuenta con dos micropresas, un pozo y un molino. Sus prácticas son mayormente ecológicas, utilizando materia orgánica como fertilizantes.',
    usoActual: 'Ganadería (mayor y menor), autoconsumo familiar.',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria: 'Uso de molinos y micropresas, prácticas mayormente ecológicas.',
    fotoUrl: '/uploads/finca-gil.webp',
  },
  {
    nombre: 'Los Piriles',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Ramón Daniel Mora Pérez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería. Cuenta con una pequeña producción de cultivos varios y producción porcina. Utiliza medios biológicos y orgánicos y su infraestructura está en buen estado.',
    usoActual: 'Ganadería, cultivos varios y producción porcina, autoconsumo familiar.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Uso de medios biológicos y orgánicos.',
    fotoUrl: '/uploads/los-piriles.webp',
  },
  {
    nombre: 'La Guinda',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Onilio Cristino Domínguez Téllez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Wilfredo Peña Cabrera”',
    descripcion:
      'Su actividad fundamental es la ganadería (producción de carne y leche), aunque también tiene, en menor medida, cultivos varios. Cuenta con un sistema de riego. El río La Rioja atraviesa su propiedad, lo que constituye un atractivo.',
    usoActual: 'Ganadería, cultivos varios, autoconsumo familiar.',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Insumos para desarrollar la agricultura.',
    tradicionesHistoria:
      'El río La Rioja atraviesa la propiedad, sistema de riego para la producción.',
    fotoUrl: '/uploads/la-guinda.webp',
  },
];

async function main() {
  console.log(`Iniciando la siembra (seeding) de ${fincasDataTemplate.length} fincas...`);

  // 1. LIMPIEZA TOTAL (Eliminación en orden inverso para respetar las claves foráneas)
  await prisma.diagnostico.deleteMany();
  await prisma.infraestructuraFinca.deleteMany();
  await prisma.elementoInteres.deleteMany();
  await prisma.actividadAgroturistica.deleteMany();
  await prisma.principioSustentabilidad.deleteMany();
  await prisma.accionAmbiental.deleteMany();
  await prisma.finca.deleteMany();
  await prisma.user.deleteMany(); // Limpiar la tabla de usuarios

  console.log('Todas las tablas de Fincas y Usuarios han sido limpiadas.');

  // 2. CREAR USUARIO ADMINISTRADOR
  const adminUser = await prisma.user.create({
    data: usersData[0],
  });

  console.log(`Usuario Admin creado: ${adminUser.email} con ID: ${adminUser.id}`);

  // 3. MAPEO Y ASIGNACIÓN DE FINCAS
  // Mapeo crucial: Creamos la estructura final FincaCreateInput,
  // utilizando la conexión de relación 'user' en lugar de la clave 'userId'.
  const fincasToCreate = fincasDataTemplate.map((finca) => ({
    ...finca,
    // Conexión del usuario (obligatoria por el esquema de Prisma)
    user: {
      connect: {
        id: adminUser.id,
      },
    },
  }));

  // 4. INSERCIÓN DE FINCAS
  for (const data of fincasToCreate) {
    const finca = await prisma.finca.create({
      // TypeScript ahora acepta 'data' porque 'user' está definido con la conexión.
      data: data,
    });
    console.log(`Finca creada: ${finca.nombre}`);
  }

  console.log(
    `\n✅ Siembra finalizada. Se insertaron ${fincasToCreate.length} fincas y ${usersData.length} usuario(s).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
