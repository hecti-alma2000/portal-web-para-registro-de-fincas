// prisma/seed.ts
import { PrismaClient, TipoPropiedad, Role, RequestStatus } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

// Definiciones de Constantes y Credenciales del Administrador
// Tomamos la contraseña del administrador desde una variable de entorno
// para evitar dejar secretos en el código fuente.
// Definiciones de Constantes y Credenciales del Administrador
// Tomamos el email y la contraseña del administrador desde variables de entorno
if (!process.env.SEED_ADMIN_EMAIL) {
  throw new Error(
    'SEED_ADMIN_EMAIL no está definida en las variables de entorno. Por seguridad, define SEED_ADMIN_EMAIL en tu fichero .env antes de ejecutar prisma/seed.ts'
  );
}
const ADMIN_EMAIL: string = process.env.SEED_ADMIN_EMAIL;
if (!process.env.SEED_ADMIN_PASSWORD) {
  throw new Error(
    'SEED_ADMIN_PASSWORD no está definida en las variables de entorno. Por seguridad, define SEED_ADMIN_PASSWORD en tu fichero .env antes de ejecutar prisma/seed.ts'
  );
}
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

// 🔑 TIPADO CLAVE: Incluir las listas de relaciones en la plantilla de datos
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
  latitude?: number;
  longitude?: number;
  // 🔑 Nuevos campos de lista
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
};

// Datos de las Fincas (AHORA INCLUYENDO LISTAS)
const fincasDataTemplate: FincaDataTemplate[] = [
  {
    nombre: 'La Bendecida',
    localizacion: 'Consejo Popular Buenaventura 2 (Jagüeyes)',
    propietario: 'Yainier Fajardo',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Su actividad fundamental son los cultivos varios, aunque también desarrolla la ganadería en menor escala. Cuenta, además, con un espejo de agua con abundante vegetación acuática y crianza de peces comestibles. Igualmente realiza conservas de productos mediante una minindustria instalada en su propiedad.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Falta de insumos',
    tradicionesHistoria: 'Mantiene tradiciones campesinas.',
    fotoUrl: '/uploads/la-bendecida.webp',
    latitude: 20.88586,
    longitude: -76.66603,
    // 🔑 Datos de las listas (nuevos)
    elementosInteres: ['Espejo de agua', 'Vegetación acuática', 'Minindustria'],
    actividadesAgroturisticas: ['Degustación de conservas', 'Observación de aves'],
    principiosSustentabilidad: ['Biodiversidad', 'Uso eficiente del agua'],
    accionesAmbientales: ['Reforestación', 'Manejo integrado de plagas'],
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
    usoActual: 'Ganadería',
    estadoConservacion: 'Muy bueno',
    problematicaDetectada: 'Falta de insumos',
    tradicionesHistoria:
      'Declarada de referencia nacional en diversificación agropecuaria y coto genético.',
    fotoUrl: '/uploads/el-troncon.webp',
    latitude: 20.86979227902078,
    longitude: -76.65062229885747,
    // 🔑 Datos de las listas
    elementosInteres: ['Jardín ornamental', 'Coto genético', 'Especies exóticas'],
    actividadesAgroturisticas: ['Tour por coto genético', 'Rutas por sendero'],
    principiosSustentabilidad: ['Conservación de fauna', 'Diversificación'],
    accionesAmbientales: ['Control biológico', 'Protección de especies'],
  },
  // Añadir el resto de tus 10 fincas aquí, asegurándote de incluir
  // TODOS los 4 campos de listas:
  // elementosInteres: [],
  // actividadesAgroturisticas: [],
  // principiosSustentabilidad: [],
  // accionesAmbientales: [],
  {
    nombre: 'La Gloria',
    localizacion: 'Consejo Popular Buenaventura 2 (La Alegría No.3)',
    propietario: 'Olmo Santiesteban Álamo',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Su actividad fundamental es la ganadería, aunque también se producen cultivos varios, lo que abastece la minindustria La Gloria. Desarrolla la reforestación de áreas boscosas y mantiene las tradiciones campesinas asociadas a la agricultura en general.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Mantiene las tradiciones campesinas y desarrollo de reforestación.',
    fotoUrl: '/uploads/la-gloria.webp',
    latitude: 20.869128,
    longitude: -76.653746,
    elementosInteres: ['Minindustria', 'Áreas boscosas'],
    actividadesAgroturisticas: ['Visita a minindustria', 'Reforestación participativa'],
    principiosSustentabilidad: ['Valor agregado', 'Suelo saludable'],
    accionesAmbientales: ['Reforestación'],
  },
  {
    nombre: 'El Carmen',
    localizacion: 'Consejo Popular Buenaventura 2 (La Alegría No.3)',
    propietario: 'Mariano Santiesteban Velázquez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Cristino Naranjo”',
    descripcion:
      'Esta finca, tercera de la familia Santiesteban, tiene como actividad fundamental la ganadería, con producción de cultivos varios que abastecen a la minindustria La Gloria. Cuenta con vegetación variada y fauna doméstica. Desarrolla la reforestación de áreas boscosas y mantiene las tradiciones campesinas en apego a las costumbres familiares.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Falta de insumos para desarrollar la agricultura.',
    tradicionesHistoria:
      'Mantiene las tradiciones campesinas en apego a las costumbres familiares.',
    fotoUrl: '/uploads/el-carmen.webp',
    elementosInteres: ['Vegetación variada', 'Fauna doméstica'],
    actividadesAgroturisticas: ['Convivencia familiar', 'Participación en faenas'],
    principiosSustentabilidad: ['Tradición', 'Integración familiar'],
    accionesAmbientales: ['Reforestación'],
  },
  {
    nombre: 'La Próspera',
    localizacion: 'Consejo Popular San Agustín (Cabezo)',
    propietario: 'Dainier Ballester Leyva',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Carlos Manuel de Céspedes”',
    descripcion:
      'Su actividad fundamental es cultivos varios, y su especialidad son los cítricos. Cuenta con recursos naturales y humanos de interés turístico. Su comercialización es con el turismo.',
    usoActual: 'Cultivos Varios',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Especializada en cítricos, con comercialización al sector turismo.',
    fotoUrl: '/uploads/la-prospera.webp',
    latitude: 20.90925,
    longitude: -76.6241,
    elementosInteres: ['Cultivos cítricos', 'Recursos turísticos'],
    actividadesAgroturisticas: ['Cosecha de cítricos', 'Venta a turismo'],
    principiosSustentabilidad: ['Comercialización directa', 'Monocultivo diversificado'],
    accionesAmbientales: ['Manejo de suelo'],
  },
  {
    nombre: 'La Margarita',
    localizacion: 'Consejo Popular La Jíquima (La Esperanza de Domínguez)',
    propietario: 'Rodrigo Crúz Álvarez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Raúl Pupo Morales”',
    descripcion:
      'Su actividad fundamental es cultivos varios, destacando una hectárea de limón. Llama la atención la existencia de siete palmas reales, símbolo nacional, en el paisaje de las lomas.',
    usoActual: 'Cultivos Varios',
    estadoConservacion: 'Aceptable',
    problematicaDetectada: null,
    tradicionesHistoria: 'Presencia de siete palmas reales, símbolo nacional, en el paisaje.',
    fotoUrl: '/uploads/la-margarita.webp',
    latitude: 20.90083,
    longitude: -76.53986,
    elementosInteres: ['Palmas reales (símbolo nacional)', 'Cultivo de limón'],
    actividadesAgroturisticas: ['Avistamiento de palmas'],
    principiosSustentabilidad: ['Respeto a la flora nativa'],
    accionesAmbientales: ['Conservación de palmas'],
  },
  {
    nombre: 'La Alegría',
    localizacion: 'Consejo Popular Las Calabazas',
    propietario: 'Dixan Zúñiga Parra',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Frank País”',
    descripcion:
      'Su actividad fundamental es cultivos varios, destacando la siembra de 2 hectáreas de limón. Entre los elementos más distintivos del lugar se encuentra un riachuelo que atraviesa la propiedad.',
    usoActual: 'Cultivos Varios',
    estadoConservacion: 'Aceptable',
    problematicaDetectada: null,
    tradicionesHistoria: 'Un riachuelo atraviesa la propiedad, ideal para actividades.',
    fotoUrl: '/uploads/la-alegria.webp',
    latitude: 20.85272,
    longitude: -76.52072,
    elementosInteres: ['Riachuelo'],
    actividadesAgroturisticas: ['Senderismo acuático'],
    principiosSustentabilidad: ['Recurso hídrico'],
    accionesAmbientales: ['Protección de orillas'],
  },
  {
    nombre: 'Las Maravillas',
    localizacion: 'Consejo Popular Buenaventura 1',
    propietario: 'Carlos Alberto Pozo Ramírez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Juan Manuel Romero”',
    descripcion:
      'Campesino ganadero con los mejores rendimientos de leche y carne. Ha transformado su finca en polígono de experimentación para la obtención de bovino adaptado al cambio climático (inseminación artificial). Cuenta con un área dedicada a cultivos varios con fertilizantes orgánicos.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria:
      'Reconocimiento a diferentes niveles por rendimiento de leche y carne. Polígono de experimentación.',
    fotoUrl: '/uploads/las-maravillas.webp',
    latitude: 20.86202,
    longitude: -76.62822,
    elementosInteres: ['Polígono de experimentación', 'Inseminación artificial'],
    actividadesAgroturisticas: ['Tour de genética bovina', 'Visita a cultivos orgánicos'],
    principiosSustentabilidad: ['Innovación', 'Fertilizantes orgánicos'],
    accionesAmbientales: ['Mejora genética', 'Compostaje'],
  },
  {
    nombre: 'La Paula',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Alberto Peña Valera',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería (producción de carne y leche) con cría de ganado mayor y menor. Cuenta con un rebaño ovino-caprino, tres micropresas con cría de pescados, y codornices. La infraestructura para la actividad pecuaria es buena (naves de ordeño y ceba).',
    usoActual: 'Ganadería',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria: 'Responsable con el medioambiente.',
    fotoUrl: '/uploads/la-paula.webp',
    elementosInteres: ['Rebaño ovino-caprino', 'Micropresas', 'Infraestructura pecuaria'],
    actividadesAgroturisticas: ['Pesca recreativa', 'Alimentación de ganado menor'],
    principiosSustentabilidad: ['Diversificación de cría', 'Manejo de agua'],
    accionesAmbientales: ['Uso de micropresas'],
  },
  {
    nombre: 'Finca de Gil',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Gil Valera Ávila',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería, incluyendo ganado menor (ovino). Cuenta con dos micropresas, un pozo y un molino. Sus prácticas son mayormente ecológicas, utilizando materia orgánica como fertilizantes.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Muy buena',
    problematicaDetectada: null,
    tradicionesHistoria: 'Uso de molinos y micropresas, prácticas mayormente ecológicas.',
    fotoUrl: '/uploads/finca-gil.webp',
    elementosInteres: ['Molino', 'Micropresas', 'Pozo'],
    actividadesAgroturisticas: ['Demostración de prácticas ecológicas'],
    principiosSustentabilidad: ['Fertilización orgánica', 'Uso de energía renovable (molino)'],
    accionesAmbientales: ['Uso de abonos verdes'],
  },
  {
    nombre: 'Los Piriles',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Ramón Daniel Mora Pérez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Ignacio Agramonte”',
    descripcion:
      'Su actividad fundamental es la ganadería. Cuenta con una pequeña producción de cultivos varios y producción porcina. Utiliza medios biológicos y orgánicos y su infraestructura está en buen estado.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Bueno',
    problematicaDetectada: null,
    tradicionesHistoria: 'Uso de medios biológicos y orgánicos.',
    fotoUrl: '/uploads/los-piriles.webp',
    elementosInteres: ['Producción porcina', 'Medios biológicos'],
    actividadesAgroturisticas: ['Demostración de biopreparados'],
    principiosSustentabilidad: ['Medios biológicos'],
    accionesAmbientales: ['Uso de biopreparados'],
  },
  {
    nombre: 'La Guinda',
    localizacion: 'Consejo Popular Sabanazo',
    propietario: 'Onilio Cristino Domínguez Téllez',
    tipoPropiedad: TipoPropiedad.PRIVADA,
    entidadPertenece: 'CCS “Wilfredo Peña Cabrera”',
    descripcion:
      'Su actividad fundamental es la ganadería (producción de carne y leche), aunque también tiene, en menor medida, cultivos varios. Cuenta con un sistema de riego. El río La Rioja atraviesa su propiedad, lo que constituye un atractivo.',
    usoActual: 'Ganadería',
    estadoConservacion: 'Bueno',
    problematicaDetectada: 'Insumos para desarrollar la agricultura.',
    tradicionesHistoria:
      'El río La Rioja atraviesa la propiedad, sistema de riego para la producción.',
    fotoUrl: '/uploads/la-guinda.webp',
    elementosInteres: ['Río La Rioja', 'Sistema de riego'],
    actividadesAgroturisticas: ['Paseo por el río', 'Demostración de riego'],
    principiosSustentabilidad: ['Riego eficiente', 'Recursos hídricos'],
    accionesAmbientales: ['Protección de cauce'],
  },
];

async function main() {
  console.log(`Iniciando la siembra (seeding) de ${fincasDataTemplate.length} fincas...`);

  // 1. LIMPIEZA TOTAL (Orden inverso)
  await prisma.diagnostico.deleteMany();
  await prisma.infraestructuraFinca.deleteMany();
  await prisma.elementoInteres.deleteMany();
  await prisma.actividadAgroturistica.deleteMany();
  await prisma.principioSustentabilidad.deleteMany();
  await prisma.accionAmbiental.deleteMany();
  await prisma.finca.deleteMany();
  await prisma.user.deleteMany();

  console.log('Todas las tablas de Fincas y Usuarios han sido limpiadas.');

  // 2. CREAR USUARIO ADMINISTRADOR
  const adminUser = await prisma.user.create({
    data: {
      name: 'Lisbet Eunice Pérez Anzardo',
      email: ADMIN_EMAIL,
      password: bcryptjs.hashSync(ADMIN_PASSWORD, 12),
      role: Role.admin,
    },
  });

  console.log(`Usuario Admin creado: ${adminUser.email} con ID: ${adminUser.id}`);

  // 3. MAPEO Y ASIGNACIÓN DE FINCAS (Ahora incluyendo la creación de relaciones)
  for (const fincaData of fincasDataTemplate) {
    // Separamos las listas del resto de los datos
    const {
      elementosInteres,
      actividadesAgroturisticas,
      principiosSustentabilidad,
      accionesAmbientales,
      ...baseData
    } = fincaData;

    try {
      const finca = await prisma.finca.create({
        data: {
          ...baseData,
          // 🔑 ASIGNACIÓN CORRECTA DEL ENUMERADOR
          status: RequestStatus.APPROVED,

          // Conexión del usuario
          user: {
            connect: {
              id: adminUser.id,
            },
          },

          // 🔑 CREACIÓN DE RELACIONES (LISTAS)
          elementosInteres: {
            create: elementosInteres.map((nombre) => ({ nombre })),
          },
          actividadesAgroturisticas: {
            create: actividadesAgroturisticas.map((nombre) => ({ nombre })),
          },
          principiosSustentabilidad: {
            create: principiosSustentabilidad.map((nombre) => ({ nombre })),
          },
          accionesAmbientales: {
            create: accionesAmbientales.map((nombre) => ({ nombre })),
          },
        },
      });
      console.log(`Finca creada: ${finca.nombre} (Estado: APROBADO)`);
    } catch (error) {
      console.error(`Error al crear la finca ${fincaData.nombre}:`, error);
    }
  }

  console.log(
    `\n✅ Siembra finalizada. Se insertaron ${fincasDataTemplate.length} fincas y ${1} usuario(s).`
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
